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

  // API Routes
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
    {
      id: 2,
      type: "Update",
      tableName: "Students",
      primaryKey: '{"Id":1}',
      dateTime: new Date(Date.now() - 3600000).toISOString(),
      affectedColumns: '["Status","ModifiedOn"]',
    },
  ];

  let errorLogs: any[] = [];
  let standards = [
    { id: 1, name: "1st Standard", description: "Primary Grade 1", isActive: true },
    { id: 2, name: "2nd Standard", description: "Primary Grade 2", isActive: true },
    { id: 3, name: "10th Standard", description: "Secondary Final Year", isActive: true },
  ];

  let sections = [
    { id: 1, name: "A", description: "General Section A", isActive: true },
    { id: 2, name: "B", description: "General Section B", isActive: true },
    { id: 3, name: "C", description: "Special Section C", isActive: true },
  ];

  let academicYears = [
    { id: 1, name: "2023-24", isCurrent: false, isActive: true },
    { id: 2, name: "2024-25", isCurrent: true, isActive: true },
  ];

  let castes = [
    { id: 1, name: "General", isActive: true },
    { id: 2, name: "OBC", isActive: true },
    { id: 3, name: "SC", isActive: true },
    { id: 4, name: "ST", isActive: true },
  ];

  let subCastes = [
    { id: 1, casteId: 2, name: "Sub-Caste 1", isActive: true },
  ];

  let religions = [
    { id: 1, name: "Hindu", isActive: true },
    { id: 2, name: "Muslim", isActive: true },
    { id: 3, name: "Christian", isActive: true },
    { id: 4, name: "Sikh", isActive: true },
  ];

  let states = [
    { id: 1, name: "Maharashtra", isActive: true },
    { id: 2, name: "Gujarat", isActive: true },
    { id: 3, name: "Delhi", isActive: true },
  ];

  let cities = [
    { id: 1, stateId: 1, name: "Mumbai", isActive: true },
    { id: 2, stateId: 1, name: "Pune", isActive: true },
    { id: 3, stateId: 2, name: "Ahmedabad", isActive: true },
  ];

  let bloodGroups = [
    { id: 1, name: "A+", isActive: true },
    { id: 2, name: "A-", isActive: true },
    { id: 3, name: "B+", isActive: true },
    { id: 4, name: "B-", isActive: true },
    { id: 5, name: "O+", isActive: true },
    { id: 6, name: "O-", isActive: true },
    { id: 7, name: "AB+", isActive: true },
    { id: 8, name: "AB-", isActive: true },
  ];

  let houses = [
    { id: 1, name: "Red House", color: "#ef4444", isActive: true },
    { id: 2, name: "Blue House", color: "#3b82f6", isActive: true },
    { id: 3, name: "Green House", color: "#22c55e", isActive: true },
    { id: 4, name: "Yellow House", color: "#eab308", isActive: true },
  ];

  let admissionTypes = [
    { id: 1, name: "Regular", isActive: true },
    { id: 2, name: "Distance", isActive: true },
    { id: 3, name: "Transfer", isActive: true },
  ];

  let roles = [
    { id: 1, name: "Super Admin", description: "Full system access", isActive: true },
    { id: 2, name: "Admin", description: "School-level administrative access", isActive: true },
    { id: 3, name: "Teacher", description: "Academic and attendance access", isActive: true },
    { id: 4, name: "Student", description: "Student-level access", isActive: true },
    { id: 5, name: "Parent", description: "Parent-level access", isActive: true },
  ];

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
    res.json({
      content:
        "[INFO] Server started\n[INFO] Connected to mock database\n[DEBUG] Vite middleware initialized",
    });
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

  app.get("/api/database/seed", async (req, res) => {
    try {
      const fs = await import("fs/promises");
      const scriptPath = path.join(process.cwd(), "seed_data.sql");
      const content = await fs.readFile(scriptPath, "utf-8");
      res.json({ content });
    } catch (err) {
      res.status(500).json({ error: "Could not read seed script" });
    }
  });

  let mockUsers = [
    {
      username: "superadmin",
      password: "Password123",
      role: "superadmin",
      name: "Global Admin",
      email: "admin@scanid.com",
      schoolId: null,
      schoolName: "System-wide",
    },
    {
      username: "schooladmin1",
      password: "Password123",
      role: "admin",
      name: "John Doe",
      email: "john@greenvalley.edu",
      schoolId: 1,
      schoolName: "Greenwood High",
    },
    {
      username: "teacher1",
      password: "Password123",
      role: "teacher",
      name: "Sarah Wilson",
      email: "sarah@greenvalley.edu",
      schoolId: 1,
      schoolName: "Greenwood High",
    },
    {
      username: "student1",
      password: "Password123",
      role: "student",
      name: "James Brown",
      email: "james@student.com",
      schoolId: 1,
      schoolName: "Greenwood High",
    },
  ];

  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    console.log(`Login attempt for: ${username}`);

    const user = mockUsers.find(
      (u) => u.username === username && u.password === password,
    );

    if (user) {
      res.json({
        id: "u" + Math.random().toString(36).substr(2, 4),
        name: user.name,
        email: user.email,
        role: user.role,
        schoolId: user.schoolId,
        schoolName: user.schoolName,
      });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  });

  app.post("/api/Auth/login", (req, res) => {
    res.redirect(307, "/api/auth/login");
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
    const index = schools.findIndex((s) => s.id === id);
    if (index !== -1) {
      schools[index] = { ...schools[index], ...req.body };
      res.json(schools[index]);
    } else {
      res.status(404).json({ message: "School not found" });
    }
  });

  app.delete("/api/schools/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = schools.findIndex((s) => s.id === id);
    if (index !== -1) {
      schools.splice(index, 1);
      res.status(204).send();
    } else {
      res.status(404).json({ message: "School not found" });
    }
  });

  app.get("/api/students", (req, res) => {
    const schoolId = req.query.schoolId
      ? parseInt(req.query.schoolId as string)
      : null;
    if (schoolId) {
      res.json(students.filter((s) => s.schoolId === schoolId));
    } else {
      res.json(students);
    }
  });

  app.put("/api/students/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = students.findIndex((s) => s.id === id);
    if (index !== -1) {
      students[index] = { ...students[index], ...req.body };
      res.json(students[index]);
    } else {
      res.status(404).json({ message: "Student not found" });
    }
  });

  // Masters: Standards
  app.get("/api/masters/standards", (req, res) => {
    res.json(standards);
  });

  app.post("/api/masters/standards", (req, res) => {
    const newStandard = { id: standards.length + 1, ...req.body, isActive: true };
    standards.push(newStandard);
    res.status(201).json(newStandard);
  });

  app.put("/api/masters/standards/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = standards.findIndex(s => s.id === id);
    if (index !== -1) {
      standards[index] = { ...standards[index], ...req.body };
      res.json(standards[index]);
    } else {
      res.status(404).json({ message: "Standard not found" });
    }
  });

  app.delete("/api/masters/standards/:id", (req, res) => {
    const id = parseInt(req.params.id);
    standards = standards.filter(s => s.id !== id);
    res.status(204).send();
  });

  // Masters: Sections
  app.get("/api/masters/sections", (req, res) => {
    res.json(sections);
  });

  app.post("/api/masters/sections", (req, res) => {
    const newSection = { id: sections.length + 1, ...req.body, isActive: true };
    sections.push(newSection);
    res.status(201).json(newSection);
  });

  app.put("/api/masters/sections/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = sections.findIndex(s => s.id === id);
    if (index !== -1) {
      sections[index] = { ...sections[index], ...req.body };
      res.json(sections[index]);
    } else {
      res.status(404).json({ message: "Section not found" });
    }
  });

  app.delete("/api/masters/sections/:id", (req, res) => {
    const id = parseInt(req.params.id);
    sections = sections.filter(s => s.id !== id);
    res.status(204).send();
  });

  // Reusable CRUD generator for simple masters
  const createMasterRoutes = (resourceName: string, dataArray: any[]) => {
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
        res.status(404).json({ message: "Item not found" });
      }
    });

    app.delete(`/api/masters/${resourceName}/:id`, (req, res) => {
      const id = parseInt(req.params.id);
      const index = dataArray.findIndex(item => item.id === id);
      if (index !== -1) {
        dataArray.splice(index, 1);
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Item not found" });
      }
    });
  };

  createMasterRoutes("academic-years", academicYears);
  createMasterRoutes("castes", castes);
  createMasterRoutes("sub-castes", subCastes);
  createMasterRoutes("religions", religions);
  createMasterRoutes("states", states);
  createMasterRoutes("cities", cities);
  createMasterRoutes("blood-groups", bloodGroups);
  createMasterRoutes("houses", houses);
  createMasterRoutes("admission-types", admissionTypes);
  createMasterRoutes("roles", roles);

  // Users Management (for Role Assignment)
  app.get("/api/users", (req, res) => {
    res.json(mockUsers.map((u, i) => ({
      id: i + 1,
      fullName: u.name,
      username: u.username,
      role: u.role,
      email: u.email,
      schoolName: u.schoolName
    })));
  });

  app.post("/api/users", (req, res) => {
    const { fullName, username, email, role } = req.body;
    const newUser = {
      name: fullName,
      username: username || `user_${Date.now()}`,
      password: "Password123",
      email,
      role: role || "student",
      schoolId: null,
      schoolName: "System-wide"
    };
    mockUsers.push(newUser);
    res.status(201).json({ id: mockUsers.length, ...newUser });
  });

  app.put("/api/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { fullName, email, role } = req.body;
    if (mockUsers[id - 1]) {
      if (fullName) mockUsers[id - 1].name = fullName;
      if (email) mockUsers[id - 1].email = email;
      if (role) mockUsers[id - 1].role = role;
      res.json({ id, ...mockUsers[id - 1] });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });

  app.put("/api/users/:id/role", (req, res) => {
    const id = parseInt(req.params.id);
    const { role } = req.body;
    if (mockUsers[id - 1]) {
      mockUsers[id - 1].role = role;
      res.json({ success: true, user: mockUsers[id - 1] });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });

  app.delete("/api/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (mockUsers[id - 1]) {
      mockUsers.splice(id - 1, 1);
      res.status(204).send();
    } else {
      res.status(404).json({ message: "User not found" });
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
