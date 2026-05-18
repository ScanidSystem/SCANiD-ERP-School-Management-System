import express from "express";
// Import cors middleware for cross-origin requests
import cors from "cors";
import "dotenv/config";
import { createServer as createViteServer } from "vite";
import path from "path";
import http from "http";

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  // Enforce port 3000 for standard environment routing
const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // Mock data arrays for basic management
  let schools = [
    { id: 1, name: "SCANID PRIMARY SCHOOL", code: "SPS001", address: "MUMBAI, MAHARASHTRA", email: "pri@scanid.com", phone: "9876543210", totalStudents: 450, status: "Active" },
    { id: 2, name: "SCANID SECONDARY HIGH SCHOOL", code: "SSHS002", address: "PUNE, MAHARASHTRA", email: "sec@scanid.com", phone: "9876543211", totalStudents: 620, status: "Active" }
  ];

  let teachers = [
    { 
      id: 1, 
      userId: 3, 
      schoolId: 1, 
      employeeId: "EMP001", 
      department: "Mathematics",
      qualification: "MA B.Ed",
      experience: "5+ Years",
      subject: "Mathematics",
      standardId: 1,
      sectionId: 1,
      contactNumber: "9876543210",
      status: "Active",
      user: { id: 3, fullName: "Primary Teacher 01", email: "teacher01@scanid.com" } 
    }
  ];

  let students = [
    { 
      id: 1, 
      grno: "1001", 
      registrationNumber: "REG1001",
      fullName: "Shivansh Sanjay Khopkar", 
      firstName: "Shivansh",
      lastName: "Khopkar",
      dateOfBirth: "2018-04-27",
      standard: "1st", 
      section: "A", 
      rollNumber: 1, 
      gender: "Male",
      schoolId: 1,
      standardId: 1,
      sectionId: 1,
      attendance: "95%",
      performance: "Excellent",
      FNAME: "Shivansh",
      MNAME: "Sanjay",
      LNAME: "Khopkar",
      DOB: "2018-04-27",
      MOBILE: "9823674019",
      MOTHERNAME: "Sanjana Khopkar"
    },
    { 
      id: 2, 
      grno: "1002", 
      registrationNumber: "REG1002",
      fullName: "Aavya Amit Patil", 
      firstName: "Aavya",
      lastName: "Patil",
      dateOfBirth: "2018-08-20",
      standard: "1st", 
      section: "A", 
      rollNumber: 2, 
      gender: "Female",
      schoolId: 1,
      standardId: 1,
      sectionId: 1,
      attendance: "92%",
      performance: "Good",
      FNAME: "Aavya",
      MNAME: "Amit",
      LNAME: "Patil",
      DOB: "2018-08-20",
      MOBILE: "8888941563",
      MOTHERNAME: "Amita Patil"
    }
  ];

  let auditLogs = [
    { id: 1, userId: "1", type: "Update", tableName: "Students", dateTime: new Date().toISOString(), primaryKey: "1" },
    { id: 2, userId: "1", type: "Create", tableName: "Attendance", dateTime: new Date().toISOString(), primaryKey: "50" }
  ];

  let errorLogs: any[] = [
    { id: 1, message: "Database connection timeout", level: "Error", timestamp: new Date(Date.now() - 7200000).toISOString(), exception: "SqlException", properties: "Path: /api/students" },
    { id: 2, message: "Invalid session", level: "Warning", timestamp: new Date(Date.now() - 3600000).toISOString(), exception: null, properties: "User: 5" }
  ];
  
  // Master Data Mock Arrays
  let standards = [{ id: 1, name: "1st" }, { id: 2, name: "2nd" }, { id: 3, name: "3rd" }, { id: 4, name: "4th" }, { id: 5, name: "5th" }, { id: 6, name: "LKG" }, { id: 7, name: "UKG" }];
  let sections = [{ id: 1, name: "A" }, { id: 2, name: "B" }, { id: 3, name: "C" }];
  let academicYears = [{ id: 1, name: "2024-2025", isCurrent: false }, { id: 2, name: "2025-2026", isCurrent: true }];
  let castes = [{ id: 1, name: "OPEN" }, { id: 2, name: "OBC" }, { id: 3, name: "SC" }, { id: 4, name: "ST" }];
  let subCastes = [{ id: 1, casteId: 2, name: "General" }, { id: 2, casteId: 2, name: "Kunbi" }];
  let religions = [{ id: 1, name: "HINDU" }, { id: 2, name: "MUSLIM" }, { id: 3, name: "CHRISTIAN" }, { id: 4, name: "SIKH" }];
  let states = [{ id: 1, name: "Maharashtra" }];
  let cities = [{ id: 1, stateId: 1, name: "Mumbai" }];
  let bloodGroups = [{ id: 1, name: "A+" }, { id: 2, name: "B+" }, { id: 3, name: "O+" }, { id: 4, name: "AB+" }];
  let houses = [{ id: 1, name: "RED", color: "#EF4444" }, { id: 2, name: "BLUE", color: "#3B82F6" }, { id: 3, name: "GREEN", color: "#10B981" }, { id: 4, name: "YELLOW", color: "#F59E0B" }];
  let admissionTypes = [{ id: 1, name: "REGULAR" }, { id: 2, name: "RTE" }, { id: 3, name: "STAFF CHILD" }];
  let categories = [{ id: 1, name: "General" }];
  let sessions = [{ id: 1, name: "Morning" }];
  let batches = [{ id: 1, name: "Batch A" }];
  let shifts = [{ id: 1, name: "MORNING" }, { id: 2, name: "AFTERNOON" }];
  let subjects = [{ id: 1, name: "Mathematics" }, { id: 2, name: "Science" }];
  let examTypes = [{ id: 1, name: "Mid-Term" }, { id: 2, name: "Final" }];
  let designations = [{ id: 1, name: "Principal" }, { id: 2, name: "Teacher" }];
  let occupations = [{ id: 1, name: "Service" }, { id: 2, name: "Business" }];
  let roles = [{ id: 1, name: "superadmin" }, { id: 2, name: "admin" }, { id: 3, name: "teacher" }];

  let attendance = [
    { id: 1, studentId: 1, date: new Date().toISOString().split('T')[0], status: "Present" },
    { id: 2, studentId: 2, date: new Date().toISOString().split('T')[0], status: "Absent" }
  ];

  let notifications = [
    { id: 1, title: "System Update", message: "New academic module is live.", type: "info", isRead: false, createdAt: new Date().toISOString() },
    { id: 2, title: "Fee Reminder", message: "Late fee applies after 30th May.", type: "warning", isRead: true, createdAt: new Date().toISOString() }
  ];

  let messages = [
    { id: 1, senderId: 1, receiverId: 2, subject: "Meeting Invitation", content: "Let's discuss the new curriculum.", isRead: false, type: "Direct", createdAt: new Date().toISOString() },
    { id: 2, senderId: 2, receiverId: 1, subject: "Re: Meeting Invitation", content: "Sure, let's meet tomorrow.", isRead: true, type: "Direct", createdAt: new Date().toISOString() }
  ];

  let navigationItems = [
    // IDs: SuperAdmin=1, Admin=2, Teacher=3, Student=4, Parent=5, All=0
    // Root level items
    { id: 1, title: "Dashboard", icon: "LayoutDashboard", path: "/", parentId: null, sortOrder: 1, roleIds: [1, 2, 3, 4, 5] },
    
    // Academic Operations Group (2)
    { id: 2, title: "Academic Operations", icon: "BookOpen", path: null, parentId: null, sortOrder: 2, roleIds: [1, 2, 3, 4, 5] },
    { id: 3, title: "Student Registry", icon: "GraduationCap", path: "/students", parentId: 2, sortOrder: 1, roleIds: [1, 2, 3, 5] },
    { id: 4, title: "Attendance Tracking", icon: "CalendarCheck", path: "/attendance", parentId: 2, sortOrder: 2, roleIds: [1, 2, 3, 4, 5] },
    { id: 5, title: "Examination & Marks", icon: "BarChart3", path: "/marks", parentId: 2, sortOrder: 3, roleIds: [1, 2, 3, 4, 5] },
    
    // Staff & HR Group (6)
    { id: 6, title: "Staff & HR", icon: "Users", path: null, parentId: null, sortOrder: 3, roleIds: [1, 2] },
    { id: 7, title: "Teacher Catalog", icon: "UserCheck", path: "/teachers", parentId: 6, sortOrder: 1, roleIds: [1, 2] },
    { id: 432, title: "Manage Users", icon: "UserPlus", path: "/configuration/users", parentId: 6, sortOrder: 2, roleIds: [1, 2] },
    
    // Administrative Group (8)
    { id: 8, title: "Administrative", icon: "ShieldCheck", path: null, parentId: null, sortOrder: 4, roleIds: [1, 2, 3, 4, 5] },
    { id: 9, title: "Fee Management", icon: "CreditCard", path: "/fees", parentId: 8, sortOrder: 1, roleIds: [1, 2, 5] },
    { id: 10, title: "Communication Hub", icon: "MessageSquare", path: "/messages", parentId: 8, sortOrder: 2, roleIds: [1, 2, 3, 4, 5] },
    
    // Masters & Config Group (11)
    { id: 11, title: "Masters & Config", icon: "Database", path: "/configuration", parentId: null, sortOrder: 5, roleIds: [1, 2] },
    { id: 12, title: "Global Schools", icon: "School", path: "/configuration/schools", parentId: 11, sortOrder: 1, roleIds: [1, 2] },
    
    // RBAC Sub-group (13)
    { id: 13, title: "Access Control (RBAC)", icon: "Key", path: null, parentId: 11, sortOrder: 2, roleIds: [1, 2] },
    { id: 14, title: "Role Master", icon: "Shield", path: "/configuration/role-master", parentId: 13, sortOrder: 1, roleIds: [1, 2] },
    { id: 15, title: "Role Assignment", icon: "UserCheck", path: "/configuration/role-assignment", parentId: 13, sortOrder: 2, roleIds: [1, 2] },
    
    // Menu Designer Sub-group (16)
    { id: 16, title: "Menu Designer", icon: "Layout", path: null, parentId: 11, sortOrder: 3, roleIds: [1, 2] },
    { id: 17, title: "Navigation Builder", icon: "LayoutGrid", path: "/configuration/navigation", parentId: 16, sortOrder: 1, roleIds: [1, 2] },
    
    // Academic Masters Sub-group (18)
    { id: 18, title: "Academic Masters", icon: "BookOpen", path: null, parentId: 11, sortOrder: 4, roleIds: [1, 2] },
    { id: 19, title: "Standards & Grades", icon: "Layers", path: "/configuration/standards", parentId: 18, sortOrder: 1, roleIds: [1, 2] },
    { id: 20, title: "Divisions/Sections", icon: "Hash", path: "/configuration/sections", parentId: 18, sortOrder: 2, roleIds: [1, 2] },
    { id: 21, title: "Academic Years", icon: "Calendar", path: "/configuration/academic-years", parentId: 18, sortOrder: 3, roleIds: [1, 2] },
    { id: 22, title: "Subject Registry", icon: "BookOpen", path: "/configuration/subjects", parentId: 18, sortOrder: 4, roleIds: [1, 2] },
    
    // General Masters Sub-group (45)
    { id: 45, title: "General Masters", icon: "Database", path: null, parentId: 11, sortOrder: 5, roleIds: [1, 2] },
    { id: 451, title: "Religion Master", icon: "Heart", path: "/configuration/religions", parentId: 45, sortOrder: 1, roleIds: [1, 2] },
    { id: 452, title: "Blood Group Master", icon: "Droplets", path: "/configuration/blood-groups", parentId: 45, sortOrder: 2, roleIds: [1, 2] },
    { id: 453, title: "Caste Category", icon: "Users", path: "/configuration/castes", parentId: 45, sortOrder: 3, roleIds: [1, 2] },
    { id: 454, title: "Sub-Caste Master", icon: "UserCircle", path: "/configuration/sub-castes", parentId: 45, sortOrder: 4, roleIds: [1, 2] },
    { id: 455, title: "School House", icon: "Home", path: "/configuration/houses", parentId: 45, sortOrder: 5, roleIds: [1, 2] },
    { id: 456, title: "Admission Types", icon: "UserCheck", path: "/configuration/admission-types", parentId: 45, sortOrder: 6, roleIds: [1, 2] },

    // System Audit (23)
    { id: 23, title: "System Audit", icon: "Terminal", path: "/system-logs", parentId: null, sortOrder: 6, roleIds: [1] },
  ];

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
    "sections": sections,
    // Add variations for different frontend names
    "standardsMaster": standards,
    "sectionsMaster": sections,
    "schools": schools,
    "academicyears": academicYears,
    "bloodgroups": bloodGroups,
    "subcastes": subCastes,
    "admissiontypes": admissionTypes
  };

  // Users
  let users = [
    { id: 1, fullName: "Global Admin", username: "superadmin", email: "admin@scanid.com", role: "superadmin", status: "Active" },
    { id: 2, fullName: "Teacher One", username: "teacher01", email: "teacher01@scanid.com", role: "teacher", status: "Active" }
  ];

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "SCANID Dev Server is running." });
  });

  // Audit Logs
  app.get("/api/auditlogs", (req, res) => res.json({ data: auditLogs }));

  // Error Logs
  app.get("/api/errorlogs", (req, res) => res.json({ data: errorLogs }));
  app.get("/api/errorlogs/filesystem", (req, res) => res.json({ data: errorLogs }));
  app.delete("/api/errorlogs/clear", (req, res) => {
    errorLogs = [];
    res.status(204).send();
  });

  // Common Logs
  app.get("/api/applogs", (req, res) => res.json({ data: { content: "Log stream started...\n[INFO] SCANID System Initialized\n[INFO] Connected to In-Memory DB\n[DEBUG] Vite Middleware Mounted" } }));
  app.get("/api/database/schema", (req, res) => res.json({ data: { schema: "Mock In-Memory DB", tables: Object.keys(mastersMap) } }));
  app.get("/api/database/script", (req, res) => res.json({ data: { content: "-- Mock SQL Server Schema --\nCREATE TABLE Students (\n  Id INT PRIMARY KEY IDENTITY,\n  GRNO NVARCHAR(50),\n  FullName NVARCHAR(200)\n);" } }));
  app.get("/api/database/seed", (req, res) => res.json({ data: { content: "-- Mock Seed Script --\nINSERT INTO Schools (Name) VALUES ('SCANID PRIMARY');\nINSERT INTO Roles (Name) VALUES ('SuperAdmin');" } }));

  // Auth
  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "superadmin" && password === "Password123") {
      res.json({
        id: "1",
        name: "Global Admin",
        email: "admin@scanid.com",
        role: "superadmin",
        roleId: 1,
        schoolName: "System-wide",
        schoolId: "1"
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });

  // Schools
  app.get("/api/schools", (req, res) => res.json({ data: schools }));
  app.post("/api/schools", (req, res) => {
    const newItem = { id: schools.length + 1, ...req.body };
    schools.push(newItem);
    res.status(201).json({ data: newItem });
  });

  // Students
  app.get("/api/students", (req, res) => {
    const schoolId = req.query.schoolId ? parseInt(req.query.schoolId as string) : null;
    let filtered = students;
    if (schoolId) {
      filtered = students.filter(s => s.schoolId === schoolId);
    }
    res.json({ data: filtered });
  });

  app.post("/api/students", (req, res) => {
    const newStudent = {
      id: students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1,
      grno: req.body.GRNO || req.body.registrationNumber || `REG-${Date.now()}`,
      fullName: req.body.fullName || `${req.body.FNAME || ""} ${req.body.LNAME || ""}`.trim(),
      ...req.body
    };
    students.push(newStudent);
    res.status(201).json({ data: newStudent });
  });

  app.post("/api/students/bulk", (req, res) => {
    const newItems = (req.body || []).map((s: any, idx: number) => ({
      id: students.length + idx + 1,
      ...s
    }));
    students = [...students, ...newItems];
    res.status(201).json({ success: true, count: newItems.length });
  });

  app.put("/api/students/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
      students[index] = { ...students[index], ...req.body, id };
      res.json({ data: students[index] });
    } else {
      res.status(404).json({ message: "Student not found" });
    }
  });

  app.delete("/api/students/:id", (req, res) => {
    const id = parseInt(req.params.id);
    students = students.filter(s => s.id !== id);
    res.json({ success: true });
  });

  app.post("/api/students/:id/photo", (req, res) => {
    res.json({ data: { path: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + req.params.id } });
  });

  // Attendance
  app.get("/api/attendance", (req, res) => {
    const date = req.query.date as string;
    let filtered = attendance;
    if (date) {
      filtered = attendance.filter(a => a.date === date);
    }
    res.json({ data: filtered });
  });

  app.post("/api/attendance", (req, res) => {
    const records = Array.isArray(req.body) ? req.body : [req.body];
    records.forEach(record => {
      const existingIdx = attendance.findIndex(a => a.studentId === record.studentId && a.date === record.date);
      if (existingIdx !== -1) {
        attendance[existingIdx] = { ...attendance[existingIdx], ...record };
      } else {
        attendance.push({ id: attendance.length + 1, ...record });
      }
    });
    res.json({ success: true });
  });

  // Stats
  app.get("/api/stats", (req, res) => {
    res.json({
      data: {
        totalStudents: students.length,
        totalSchools: schools.length,
        activeAttendance: "92%",
        averagePerformance: "88%",
        recentAnnouncements: [
          { id: 1, title: "Exam Schedule Released", date: "2024-05-15", category: "Exam" },
          { id: 2, title: "Annual Sports Day", date: "2024-06-01", category: "Sports" }
        ],
        upcomingEvents: [
          { id: 1, title: "Science Fair", date: "2024-05-20", type: "Exhibition" },
          { id: 2, title: "Teacher Training", date: "2024-05-25", type: "Workshop" }
        ],
        attendanceTrend: [
          { name: "Mon", present: 450, absent: 20 },
          { name: "Tue", present: 440, absent: 30 },
          { name: "Wed", present: 460, absent: 10 },
          { name: "Thu", present: 455, absent: 15 },
          { name: "Fri", present: 448, absent: 22 }
        ],
        performanceData: [
          { name: "Math", score: 85 },
          { name: "Science", score: 78 },
          { name: "English", score: 82 },
          { name: "History", score: 75 }
        ]
      }
    });
  });

  // Other Placeholders
  app.get("/api/marks", (req, res) => res.json({ data: [] }));
  app.get("/api/teachers", (req, res) => {
    const schoolId = req.query.schoolId ? parseInt(req.query.schoolId as string) : null;
    let filtered = teachers;
    if (schoolId) {
      filtered = teachers.filter(t => t.schoolId === schoolId);
    }
    res.json({ data: filtered });
  });

  app.post("/api/teachers", (req, res) => {
    const newItem = {
      id: teachers.length > 0 ? Math.max(...teachers.map(t => t.id)) + 1 : 1,
      ...req.body
    };
    teachers.push(newItem);
    res.status(201).json({ data: newItem });
  });

  app.put("/api/teachers/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = teachers.findIndex(t => t.id === id);
    if (index !== -1) {
      teachers[index] = { ...teachers[index], ...req.body };
      res.json({ data: teachers[index] });
    } else {
      res.status(404).json({ message: "Teacher not found" });
    }
  });

  app.delete("/api/teachers/:id", (req, res) => {
    const id = parseInt(req.params.id);
    teachers = teachers.filter(t => t.id !== id);
    res.status(204).send();
  });
  app.get("/api/fees", (req, res) => res.json({ data: [] }));

  // Generic Master Routes
  Object.keys(mastersMap).forEach(resourceName => {
    const dataArray = mastersMap[resourceName];
    
    app.get(`/api/masters/${resourceName}`, (req, res) => res.json({ data: dataArray }));
    
    app.post(`/api/masters/${resourceName}`, (req, res) => {
      const newItem = { id: dataArray.length + 1, ...req.body, isActive: true };
      dataArray.push(newItem);
      res.status(201).json({ data: newItem });
    });

    app.put(`/api/masters/${resourceName}/:id`, (req, res) => {
      const id = parseInt(req.params.id);
      const index = dataArray.findIndex(item => item.id === id);
      if (index !== -1) {
        dataArray[index] = { ...dataArray[index], ...req.body };
        res.json({ data: dataArray[index] });
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
  app.get("/api/users", (req, res) => res.json({ data: users }));
  app.post("/api/users", (req, res) => {
    const newItem = { id: users.length + 1, ...req.body, status: "Active" };
    users.push(newItem);
    res.status(201).json({ data: newItem });
  });
  app.put("/api/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...req.body };
      res.json({ data: users[index] });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  });
  app.delete("/api/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    users = users.filter(u => u.id !== id);
    res.status(204).send();
  });
  app.put("/api/users/:id/role", (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index].role = req.body.role;
      res.json({ success: true, data: users[index] });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  });

  // Notifications
  app.get("/api/notifications", (req, res) => res.json({ data: notifications }));
  app.get("/api/notifications/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const notif = notifications.find(n => n.id === id);
    if (notif) res.json({ data: notif });
    else res.status(404).json({ message: "Notification not found" });
  });
  app.put("/api/notifications/:id/read", (req, res) => {
    const id = parseInt(req.params.id);
    const index = notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      notifications[index].isRead = true;
      res.json({ data: notifications[index] });
    } else {
      res.status(404).json({ message: "Notification not found" });
    }
  });
  app.delete("/api/notifications/:id", (req, res) => {
    const id = parseInt(req.params.id);
    notifications = notifications.filter(n => n.id !== id);
    res.status(204).send();
  });

  // Messages (Communication Hub)
  app.get("/api/messages", (req, res) => res.json({ data: messages }));
  app.post("/api/messages", (req, res) => {
    const newMessage = {
      id: messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1,
      senderId: req.body.senderId || 1,
      createdAt: new Date().toISOString(),
      isRead: false,
      ...req.body
    };
    messages.push(newMessage);
    res.status(201).json({ data: newMessage });
  });
  app.put("/api/messages/:id/read", (req, res) => {
    const id = parseInt(req.params.id);
    const index = messages.findIndex(m => m.id === id);
    if (index !== -1) {
      messages[index].isRead = true;
      res.json({ data: messages[index] });
    } else {
      res.status(404).json({ message: "Message not found" });
    }
  });

  // Navigation Items
  app.get("/api/navigation", (req, res) => {
    const roleId = req.query.roleId ? parseInt(req.query.roleId as string) : null;
    let filtered = navigationItems;
    if (roleId !== null) {
      // IDs: SuperAdmin=1 bypasses filter or matched directly
      if (roleId !== 1) {
        filtered = navigationItems.filter(item => 
          Array.isArray(item.roleIds) && (item.roleIds.includes(roleId) || item.roleIds.includes(0))
        );
      }
    }
    res.json({ data: filtered });
  });

  app.post("/api/navigation", (req, res) => {
    const newItem = { 
      id: navigationItems.length > 0 ? Math.max(...navigationItems.map(n => n.id)) + 1 : 1, 
      ...req.body,
      roles: Array.isArray(req.body.roles) ? req.body.roles : ["superadmin"]
    };
    navigationItems.push(newItem);
    res.status(201).json({ data: newItem });
  });

  app.put("/api/navigation/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = navigationItems.findIndex(n => n.id === id);
    if (index !== -1) {
      navigationItems[index] = { ...navigationItems[index], ...req.body };
      res.json({ data: navigationItems[index] });
    } else {
      res.status(404).json({ message: "Navigation item not found" });
    }
  });

  app.delete("/api/navigation/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = navigationItems.findIndex(n => n.id === id);
    if (index !== -1) {
      navigationItems.splice(index, 1);
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Navigation item not found" });
    }
  });

  // Base API Route
  app.get("/api", (req, res) => {
    res.json({
      status: "online",
      name: "SCANID ERP API",
      endpoints: [
        "/api/health", 
        "/api/stats", 
        "/api/students", 
        "/api/schools", 
        "/api/teachers", 
        "/api/users",
        "/api/attendance",
        "/api/notifications",
        "/api/messages",
        "/api/masters/*"
      ]
    });
  });

  // API Fail-safe catch-all (Must be BEFORE static/vite)
  app.all("/api/*", (req, res) => {
    console.warn(`[404] API Route Not Found: ${req.method} ${req.url}`);
    res.status(404).json({ 
      error: "API Endpoint Not Found", 
      message: `The route ${req.url} is not implemented in this mock server.`,
      availableEnpoints: "/api"
    });
  });

  // File serving and Vite
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: { server: httpServer }
      },
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

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log("\n" + "=".repeat(60));
    console.log(`🚀 SCANID ERP SYSTEM DEPLOYED SUCCESSFULLY`);
    console.log(`🌐 Application URL: http://localhost:${PORT}`);
    console.log(`📡 Backend API:      http://localhost:${PORT}/api`);
    console.log("=".repeat(60) + "\n");
    console.log(`[INFO] Unified Server: Serving React Frontend and Express API`);
    console.log(`[HINT] Use http://localhost:${PORT} to access the application.`);
  }).on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.error(`\n❌ [FATAL] Port ${PORT} is already in use by another process.`);
      console.error(`Please stop the application already running on port ${PORT} and try again.`);
      console.error(`If you are a developer, ensure no other "npm run dev" or backend process is active on this port.\n`);
      process.exit(1);
    } else {
      console.error("Server start error:", err);
    }
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
