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

  let auditLogs = [
    { id: 1, type: "Create", tableName: "Schools", primaryKey: "{\"Id\":3}", dateTime: new Date().toISOString(), affectedColumns: "Full entity" },
    { id: 2, type: "Update", tableName: "Students", primaryKey: "{\"Id\":1}", dateTime: new Date(Date.now() - 3600000).toISOString(), affectedColumns: "[\"Status\",\"ModifiedOn\"]" }
  ];

  let errorLogs: any[] = [];

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "SCANID Backend is running." });
  });

  app.get("/api/auditlogs", (req, res) => {
    res.json(auditLogs);
  });

  app.get("/api/errorlogs", (req, res) => {
    res.json(errorLogs);
  });

  app.delete("/api/errorlogs/clear", (req, res) => {
    errorLogs = [];
    res.status(204).send();
  });

  app.get("/api/errorlogs/filesystem", (req, res) => {
    res.json({ content: "[INFO] Server started\n[INFO] Connected to mock database\n[DEBUG] Vite middleware initialized" });
  });

  app.get("/api/database/script", async (req, res) => {
    try {
      const fs = await import("fs/promises");
      const scriptPath = path.join(process.cwd(), "database.sql");
      const content = await fs.readFile(scriptPath, "utf-8");
      res.json({ content });
    } catch (err) {
      res.status(500).json({ error: "Could not read database script" });
    }
  });

  const mockUsers = [
    { username: "superadmin", password: "Password123", role: "superadmin", name: "Global Admin", email: "admin@scanid.com", schoolId: null, schoolName: "System-wide" },
    { username: "schooladmin1", password: "Password123", role: "admin", name: "John Doe", email: "john@greenvalley.edu", schoolId: 1, schoolName: "Greenwood High" },
    { username: "teacher1", password: "Password123", role: "teacher", name: "Sarah Wilson", email: "sarah@greenvalley.edu", schoolId: 1, schoolName: "Greenwood High" },
    { username: "student1", password: "Password123", role: "student", name: "James Brown", email: "james@student.com", schoolId: 1, schoolName: "Greenwood High" },
  ];

  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    
    const user = mockUsers.find(u => u.username === username && u.password === password);
    
    if (user) {
      res.json({
        id: "u" + Math.random().toString(36).substr(2, 4),
        name: user.name,
        email: user.email,
        role: user.role,
        schoolId: user.schoolId,
        schoolName: user.schoolName
      });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
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
