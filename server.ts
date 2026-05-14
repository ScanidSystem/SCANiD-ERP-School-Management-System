import express from "express";
// Import cors middleware for cross-origin requests
import cors from "cors";
import "dotenv/config";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);

  app.use(cors());
  app.use(express.json());

  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // Mock Data Arrays for Development Preview
  let schools = [
    {
      id: 1,
      name: "Greenwood High",
      status: "Active",
      address: "123 Academic Way",
      email: "admin@greenwood.edu",
      phone: "9876543210",
    },
    {
      id: 2,
      name: "St. Xavier International",
      status: "Active",
      address: "456 Education Lane",
      email: "office@stxavier.edu",
      phone: "9876543211",
    },
  ];

  let students = [
    {
      id: 1,
      registrationNumber: "REG2024001",
      fullName: "Alice Johnson",
      schoolId: 1,
      standard: "10th",
      section: "A",
      rollNumber: 1,
      status: "Active",
      contactNumber: "9000000001",
    },
    {
      id: 2,
      registrationNumber: "REG2024002",
      fullName: "Bob Smith",
      schoolId: 1,
      standard: "10th",
      section: "A",
      rollNumber: 2,
      status: "Active",
      contactNumber: "9000000002",
    },
  ];

  let auditLogs = [
    {
      id: 1,
      type: "Create",
      tableName: "Schools",
      primaryKey: '{"Id":3}',
      dateTime: new Date().toISOString(),
      affectedColumns: "Full entity",
    },
  ];

  let errorLogs: any[] = [];
  
  // Master Data Mock Arrays
  let standards = [{ id: 1, name: "10th Standard", description: "Secondary Final Year", isActive: true }];
  let sections = [{ id: 1, name: "A", description: "General Section A", isActive: true }];
  let academicYears = [{ id: 1, name: "2024-25", isCurrent: true, isActive: true }];
  let castes = [{ id: 1, name: "General", isActive: true }];
  let subCastes = [{ id: 1, casteId: 1, name: "Sub-Caste 1", isActive: true }];
  let religions = [{ id: 1, name: "Hindu", isActive: true }];
  let states = [{ id: 1, name: "Maharashtra", isActive: true }];
  let cities = [{ id: 1, stateId: 1, name: "Mumbai", isActive: true }];
  let bloodGroups = [{ id: 1, name: "A+", isActive: true }];
  let houses = [{ id: 1, name: "Red House", color: "#ef4444", isActive: true }];
  let admissionTypes = [{ id: 1, name: "Regular", isActive: true }];
  let categories = [{ id: 1, name: "General", isActive: true }];
  let sessions = [{ id: 1, name: "Morning", isActive: true }];
  let batches = [{ id: 1, name: "Batch A", isActive: true }];
  let shifts = [{ id: 1, name: "Early Bird", isActive: true }];
  let subjects = [{ id: 1, name: "Mathematics", isActive: true }];
  let examTypes = [{ id: 1, name: "Mid-Term", isActive: true }];
  let designations = [{ id: 1, name: "Principal", isActive: true }];
  let occupations = [{ id: 1, name: "Service", isActive: true }];
  let roles = [{ id: 1, name: "Super Admin", description: "Full system access", isActive: true }];

  const mastersMap: Record<string, any[]> = {
    "academic-years": academicYears,
    "castes": castes,
    "sub-castes": subCastes,
    "religions": religions,
    "states": states,
    "cities": cities,
    "blood-groups": bloodGroups,
    "houses": houses,
    "admission-types": admissionTypes,
    "categories": categories,
    "sessions": sessions,
    "batches": batches,
    "shifts": shifts,
    "subjects": subjects,
    "exam-types": examTypes,
    "designations": designations,
    "occupations": occupations,
    "roles": roles,
    "standards": standards,
    "sections": sections
  };

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "SCANID Dev Server is running." });
  });

  // Audit Logs
  app.get("/api/auditlogs", (req, res) => {
    res.json(auditLogs);
  });

  // Error Logs
  app.get("/api/errorlogs", (req, res) => {
    res.json(errorLogs);
  });

  app.delete("/api/errorlogs/clear", (req, res) => {
    errorLogs = [];
    res.status(204).send();
  });

  // Auth
  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "superadmin" && password === "Password123") {
      res.json({
        id: 1,
        name: "Global Admin",
        email: "admin@scanid.com",
        role: "superadmin",
        schoolName: "System-wide",
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });

  // Schools
  app.get("/api/schools", (req, res) => res.json(schools));
  app.post("/api/schools", (req, res) => {
    const newItem = { id: schools.length + 1, ...req.body };
    schools.push(newItem);
    res.status(201).json(newItem);
  });

  // Students
  app.get("/api/students", (req, res) => res.json(students));

  // Generic Master Routes for Dev Preview
  Object.keys(mastersMap).forEach(resourceName => {
    const dataArray = mastersMap[resourceName];
    
    app.get(`/api/masters/${resourceName}`, (req, res) => res.json(dataArray));
    
    app.post(`/api/masters/${resourceName}`, (req, res) => {
      const newItem = { id: dataArray.length + 1, ...req.body, isActive: true };
      dataArray.push(newItem);
      res.status(201).json(newItem);
    });

    app.put(`/api/masters/${resourceName}/:id`, (req, res) => {
      const id = parseInt(req.params.id);
      const index = dataArray.findIndex(item => item.id === id);
      if (index !== -1) {
        dataArray[index] = { ...dataArray[index], ...req.body };
        res.json(dataArray[index]);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    });

    app.delete(`/api/masters/${resourceName}/:id`, (req, res) => {
      const id = parseInt(req.params.id);
      const index = dataArray.findIndex(item => item.id === id);
      if (index !== -1) {
        dataArray.splice(index, 1);
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Not found" });
      }
    });
  });

  // Users
  app.get("/api/users", (req, res) => res.json([{ id: 1, fullName: "Global Admin", username: "superadmin", role: "superadmin" }]));

  // File serving and Vite
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
