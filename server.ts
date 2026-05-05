import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  let schools = [
    { id: 1, name: "Greenwood High", status: "Active", address: "123 Academic Way", email: "admin@greenwood.edu", phone: "9876543210" },
    { id: 2, name: "St. Xavier International", status: "Active", address: "456 Education Lane", email: "office@stxavier.edu", phone: "9876543211" }
  ];

  let students = [
    { id: 1, registrationNumber: "REG2024001", fullName: "Alice Johnson", schoolId: 1, standard: "10th", section: "A", rollNumber: 1, status: "Active", contactNumber: "9000000001" },
    { id: 2, registrationNumber: "REG2024002", fullName: "Bob Smith", schoolId: 1, standard: "10th", section: "A", rollNumber: 2, status: "Active", contactNumber: "9000000002" }
  ];

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "SCANID Backend is running." });
  });

  app.post("/api/auth/login", (req, res) => {
    const { username, role, schoolId } = req.body;
    // Mock login that returns a user object
    res.json({
      id: "u" + Math.random().toString(36).substr(2, 4),
      name: username.split("@")[0],
      email: username.includes("@") ? username : `${username}@school.com`,
      role: role || "admin",
      schoolId: schoolId,
      schoolName: schools.find(s => s.id === schoolId)?.name || "Default School"
    });
  });

  app.post("/api/auth/forgot-password", (req, res) => {
    res.json({ message: "Recovery email sent successfully." });
  });

  app.get("/api/schools", (req, res) => {
    res.json(schools);
  });

  app.post("/api/schools", (req, res) => {
    const newSchool = { id: schools.length + 1, ...req.body };
    schools.push(newSchool);
    res.status(201).json(newSchool);
  });

  app.put("/api/schools/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = schools.findIndex(s => s.id === id);
    if (index !== -1) {
      schools[index] = { ...schools[index], ...req.body };
      res.json(schools[index]);
    } else {
      res.status(404).json({ message: "School not found" });
    }
  });

  app.get("/api/students", (req, res) => {
    const schoolId = req.query.schoolId ? parseInt(req.query.schoolId as string) : null;
    if (schoolId) {
      res.json(students.filter(s => s.schoolId === schoolId));
    } else {
      res.json(students);
    }
  });

  app.put("/api/students/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
      students[index] = { ...students[index], ...req.body };
      res.json(students[index]);
    } else {
      res.status(404).json({ message: "Student not found" });
    }
  });

  // Role-based access control simulation / session logic can go here
  // For now, we'll proxy everything to Vite in dev
  
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SCANID running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
