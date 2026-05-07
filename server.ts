import express from "express";
import "dotenv/config";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 5000);

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