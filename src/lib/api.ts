import axios from "axios";

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export const API_BASE_URL = trimTrailingSlash(import.meta.env.VITE_API_BASE_URL || "/api");

console.log(`[API] Initialized with Base URL: ${API_BASE_URL}`);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Fallback data for preview mode
const mockFallbacks: Record<string, any> = {
  "/stats": {
    totalStudents: 1248,
    totalTeachers: 84,
    feeCollection: "$45,200",
    attendanceRate: "92%",
    performanceTrend: "+2.4%",
  },
  "/students": [
    {
      id: 1,
      registrationNumber: "REG001",
      fullName: "Demo Student (Local Server Offline)",
      standard: "10th",
      section: "A",
      rollNumber: 1,
      address: "Localhost",
    },
  ],
  "/schools": [
    {
      id: 1,
      name: "Preview School (Demo)",
      status: "Active",
      address: "Cloud Preview",
    },
  ],
  "/masters/academic-years": [
    { id: 1, name: "2023-24", isCurrent: false, isActive: true },
    { id: 2, name: "2024-25", isCurrent: true, isActive: true },
  ],
  "/masters/standards": [
    { id: 1, name: "10th Standard", isActive: true },
  ],
  "/masters/sections": [
    { id: 1, name: "A", isActive: true },
  ],
  "/masters/religions": [
    { id: 1, name: "Hindu", isActive: true },
    { id: 2, name: "Muslim", isActive: true },
  ],
  "/masters/blood-groups": [
    { id: 1, name: "A+", isActive: true },
    { id: 2, name: "B+", isActive: true },
  ],
  "/masters/houses": [
    { id: 1, name: "Red House", color: "#ef4444", isActive: true },
  ],
  "/masters/admission-types": [
    { id: 1, name: "Regular", isActive: true },
  ],
  "/masters/castes": [
    { id: 1, name: "General", isActive: true },
  ],
  "/masters/sub-castes": [
    { id: 1, casteId: 1, name: "Sub-Caste 1", isActive: true },
  ],
  "/masters/states": [
    { id: 1, name: "Maharashtra", isActive: true },
  ],
  "/masters/cities": [
    { id: 1, stateId: 1, name: "Mumbai", isActive: true },
  ],
  "/masters/shifts": [
    { id: 1, name: "MORNING", isActive: true },
    { id: 2, name: "AFTERNOON", isActive: true },
  ],
  "/masters/subjects": [
    { id: 1, name: "Mathematics", isActive: true },
    { id: 2, name: "Science", isActive: true },
  ],
  "/masters/exam-types": [
    { id: 1, name: "Unit Test 1", isActive: true },
  ],
  "/masters/designations": [
    { id: 1, name: "Principal", isActive: true },
  ],
  "/masters/occupations": [
    { id: 1, name: "Service", isActive: true },
  ],
  "/masters/sessions": [
    { id: 1, name: "Session A", isActive: true },
  ],
  "/masters/batches": [
    { id: 1, name: "Batch 2024", isActive: true },
  ],
  "/masters/categories": [
    { id: 1, name: "General", isActive: true },
  ],
  "/navigation": [
    { id: 1, title: "Dashboard", icon: "LayoutDashboard", path: "/", parentId: null, sortOrder: 1, roleIds: [1, 2, 3, 4, 5] },
    { id: 2, title: "Academic Operations", icon: "BookOpen", path: null, parentId: null, sortOrder: 2, roleIds: [1, 2, 3, 4, 5] },
    { id: 3, title: "Student Registry", icon: "GraduationCap", path: "/students", parentId: 2, sortOrder: 1, roleIds: [1, 2, 3, 5] },
    { id: 4, title: "Attendance Tracking", icon: "CalendarCheck", path: "/attendance", parentId: 2, sortOrder: 2, roleIds: [1, 2, 3, 4, 5] },
    { id: 5, title: "Examination & Marks", icon: "BarChart3", path: "/marks", parentId: 2, sortOrder: 3, roleIds: [1, 2, 3, 4, 5] },
    
    { id: 6, title: "Staff & HR", icon: "Users", path: null, parentId: null, sortOrder: 3, roleIds: [1, 2] },
    { id: 7, title: "Teacher Catalog", icon: "UserCheck", path: "/teachers", parentId: 6, sortOrder: 1, roleIds: [1, 2] },
    
    { id: 8, title: "Administrative", icon: "ShieldCheck", path: null, parentId: null, sortOrder: 4, roleIds: [1, 2, 3, 4, 5] },
    { id: 9, title: "Fee Management", icon: "CreditCard", path: "/fees", parentId: 8, sortOrder: 1, roleIds: [1, 2, 5] },
    { id: 10, title: "Communication Hub", icon: "MessageSquare", path: "/messages", parentId: 8, sortOrder: 2, roleIds: [1, 2, 3, 4, 5] },
    
    { id: 11, title: "Masters & Config", icon: "Database", path: "/configuration", parentId: null, sortOrder: 5, roleIds: [1, 2] },
    { id: 12, title: "Global Schools", icon: "School", path: "/configuration/schools", parentId: 11, sortOrder: 1, roleIds: [1, 2] },
    { id: 13, title: "Access Control (RBAC)", icon: "ShieldCheck", path: null, parentId: 11, sortOrder: 2, roleIds: [1, 2] },
    { id: 14, title: "Role Master", icon: "Shield", path: "/configuration/role-master", parentId: 13, sortOrder: 1, roleIds: [1, 2] },
    { id: 15, title: "Role Assignment", icon: "UserCheck", path: "/configuration/role-assignment", parentId: 13, sortOrder: 2, roleIds: [1, 2] },
    
    { id: 16, title: "Menu Designer", icon: "Layout", path: null, parentId: 11, sortOrder: 3, roleIds: [1, 2] },
    { id: 17, title: "Navigation Builder", icon: "LayoutGrid", path: "/configuration/navigation", parentId: 16, sortOrder: 1, roleIds: [1, 2] },
    
    { id: 18, title: "Academic Masters", icon: "BookOpen", path: null, parentId: 11, sortOrder: 4, roleIds: [1, 2] },
    { id: 19, title: "Standards & Grades", icon: "Layers", path: "/configuration/standards", parentId: 18, sortOrder: 1, roleIds: [1, 2] },
    { id: 20, title: "Divisions/Sections", icon: "Hash", path: "/configuration/sections", parentId: 18, sortOrder: 2, roleIds: [1, 2] },
    { id: 21, title: "Academic Years", icon: "Calendar", path: "/configuration/academic-years", parentId: 18, sortOrder: 3, roleIds: [1, 2] },
    { id: 22, title: "Subject Registry", icon: "BookOpen", path: "/configuration/subjects", parentId: 18, sortOrder: 4, roleIds: [1, 2] },

    { id: 45, title: "General Masters", icon: "Database", path: null, parentId: 11, sortOrder: 5, roleIds: [1, 2] },
    { id: 451, title: "Religion Master", icon: "Heart", path: "/configuration/religions", parentId: 45, sortOrder: 1, roleIds: [1, 2] },
    { id: 452, title: "Blood Group Master", icon: "Droplets", path: "/configuration/blood-groups", parentId: 45, sortOrder: 2, roleIds: [1, 2] },
    { id: 453, title: "Caste Category", icon: "Users", path: "/configuration/castes", parentId: 45, sortOrder: 3, roleIds: [1, 2] },
    { id: 454, title: "Sub-Caste Master", icon: "UserCircle", path: "/configuration/sub-castes", parentId: 45, sortOrder: 4, roleIds: [1, 2] },
    { id: 455, title: "School House", icon: "Home", path: "/configuration/houses", parentId: 45, sortOrder: 5, roleIds: [1, 2] },
    { id: 456, title: "Admission Types", icon: "UserCheck", path: "/configuration/admission-types", parentId: 45, sortOrder: 6, roleIds: [1, 2] },
    
    { id: 23, title: "System Audit", icon: "Terminal", path: "/system-logs", parentId: null, sortOrder: 6, roleIds: [1] },
  ],
  "/notifications": [
    { id: 1, title: "System Update", message: "New academic module is live.", type: "info", isRead: false, createdAt: new Date().toISOString() },
    { id: 2, title: "Fee Reminder", message: "Late fee applies after 30th May.", type: "warning", isRead: true, createdAt: new Date().toISOString() }
  ],
  "/messages": [
    { id: 1, senderId: 1, receiverId: 2, subject: "Meeting Invitation", content: "Let's discuss the new curriculum.", isRead: false, type: "Direct", createdAt: new Date().toISOString() },
    { id: 2, senderId: 2, receiverId: 1, subject: "Re: Meeting Invitation", content: "Sure, let's meet tomorrow.", isRead: true, type: "Direct", createdAt: new Date().toISOString() }
  ],
  "/auditlogs": [
    { id: 1, userId: "1", type: "Update", tableName: "Students", dateTime: new Date().toISOString(), primaryKey: "1" },
  ],
  "/errorlogs": [
    { id: 1, message: "Demo Error Log", level: "Error", timestamp: new Date().toISOString(), exception: null, properties: "" },
  ],
  "/masters/roles": [
    { id: 1, name: "Super Admin", description: "Full system access", isActive: true },
    { id: 2, name: "Admin", description: "School-level administrative access", isActive: true },
    { id: 3, name: "Teacher", description: "Academic and attendance access", isActive: true },
    { id: 4, name: "Student", description: "Student-level access", isActive: true },
    { id: 5, name: "Parent", description: "Parent-level access", isActive: true },
  ],
  "/users": [
    { id: 1, fullName: "Super Admin", username: "admin", role: "superadmin" },
    { id: 2, fullName: "John Doe", username: "teacher1", role: "teacher" },
  ],
  "/auth/login": {
    token: "demo-token",
    user: {
      id: 1,
      fullName: "Super Admin",
      username: "admin",
      role: "superadmin",
      schoolId: null,
      academicYearId: 2
    }
  }
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isNetworkError = error.message?.includes("Network Error") || 
                           error.code === "ECONNABORTED" || 
                           error.message?.includes("ERR_CONNECTION_REFUSED");
    const isServerError = error.response && error.response.status >= 500;
    const isNotFound = error.response && error.response.status === 404;

    if (isNetworkError || isNotFound || isServerError) {
      const configUrl = error.config?.url || "";
      const urlWithPrefix = configUrl.split("?")[0];
      
      // Better URL parsing to extract the relative path
      let url = urlWithPrefix;
      
      // If the URL starts with the base URL, strip it
      if (API_BASE_URL && url.startsWith(API_BASE_URL)) {
        url = url.substring(API_BASE_URL.length);
      } 
      // Fallback for cases where baseURL might not be exactly matching due to protocol differences etc
      else if (url.includes("/api/")) {
        url = url.substring(url.indexOf("/api/") + 4);
      } else if (url.startsWith("/api")) {
        url = url.substring(4);
      }
      
      // Clean up leading/trailing slashes for matching
      const cleanUrl = "/" + url.replace(/^\/+/, "").replace(/\/+$/, "");
      
      console.warn(
        `Backend connection issue at [${configUrl}]. Using demo fallback data for path: ${cleanUrl}`
      );

      // Try exact match in fallbacks
      let mockKey = Object.keys(mockFallbacks).find(key => 
        cleanUrl === key || cleanUrl === key + "/" || "/" + cleanUrl === key
      );
      
      if (!mockKey) {
        mockKey = Object.keys(mockFallbacks).find(key => cleanUrl.startsWith(key));
      }

      if (mockKey) {
        const mockData = mockFallbacks[mockKey];
        // Wrap in { data: [...] } for specific paths
        const needsDataWrap = cleanUrl.includes("/masters/") || 
                            ["/schools", "/users", "/navigation", "/teachers", "/students", "/notifications", "/messages", "/auditlogs", "/errorlogs"].some(p => cleanUrl.startsWith(p));
        
        const finalResponseData = needsDataWrap ? { data: mockData } : mockData;
          
        return Promise.resolve({ data: finalResponseData });
      }
    }
    return Promise.reject(error);
  },
);

// Generic CRUD operations
export const apiService = {
  // Auth
  login: (credentials: any) => api.post("/auth/login", credentials),
  forgotPassword: (username: string) =>
    api.post("/auth/forgot-password", { username }),

  // Students
  getStudents: (schoolId?: number) =>
    api.get("/students", { params: { schoolId } }),
  getStudentById: (id: number) => api.get(`/students/${id}`),
  createStudent: (data: any) => api.post("/students", data),
  bulkCreateStudents: (data: any[]) => api.post("/students/bulk", data),
  updateStudent: (id: number, data: any) => api.put(`/students/${id}`, data),
  deleteStudent: (id: number) => api.delete(`/students/${id}`),
  uploadStudentPhoto: (id: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post(`/students/${id}/photo`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Marks
  getMarks: (schoolId?: number) => api.get("/marks", { params: { schoolId } }),

  // Schools
  getSchools: () => api.get("/schools"),
  getSchoolById: (id: number) => api.get(`/schools/${id}`),
  createSchool: (data: any) => api.post("/schools", data),
  updateSchool: (id: number, data: any) => api.put(`/schools/${id}`, data),
  deleteSchool: (id: number) => api.delete(`/schools/${id}`),

  // Teachers
  getTeachers: (schoolId?: number) =>
    api.get("/teachers", { params: { schoolId } }),
  createTeacher: (data: any) => api.post("/teachers", data),
  updateTeacher: (id: number, data: any) => api.put(`/teachers/${id}`, data),
  deleteTeacher: (id: number) => api.delete(`/teachers/${id}`),

  // Stats
  getStats: (schoolId?: number) => api.get("/stats", { params: { schoolId } }),

  // Attendance
  getAttendance: (date: string, schoolId?: number) =>
    api.get("/attendance", { params: { date, schoolId } }),
  markAttendance: (data: any) => api.post("/attendance", data),

  // Fees
  getFees: (schoolId?: number) => api.get("/fees", { params: { schoolId } }),

  // System Logs
  getAuditLogs: () => api.get("/auditlogs"),
  getErrorLogs: () => api.get("/errorlogs"),
  clearErrorLogs: () => api.delete("/errorlogs/clear"),
  getFileSystemLogs: () => api.get("/errorlogs/filesystem"),
  getDbScript: () => api.get("/database/script"),
  getSeedScript: () => api.get("/database/seed"),

  // Master Data (Configuration)
  getStandards: () => api.get("/masters/standards"),
  createStandard: (data: any) => api.post("/masters/standards", data),
  updateStandard: (id: number, data: any) => api.put(`/masters/standards/${id}`, data),
  deleteStandard: (id: number) => api.delete(`/masters/standards/${id}`),

  getSections: () => api.get("/masters/sections"),
  createSection: (data: any) => api.post("/masters/sections", data),
  updateSection: (id: number, data: any) => api.put(`/masters/sections/${id}`, data),
  deleteSection: (id: number) => api.delete(`/masters/sections/${id}`),

  getAcademicYears: () => api.get("/masters/academic-years"),
  createAcademicYear: (data: any) => api.post("/masters/academic-years", data),
  updateAcademicYear: (id: number, data: any) => api.put(`/masters/academic-years/${id}`, data),
  deleteAcademicYear: (id: number) => api.delete(`/masters/academic-years/${id}`),

  getCastes: () => api.get("/masters/castes"),
  createCaste: (data: any) => api.post("/masters/castes", data),
  updateCaste: (id: number, data: any) => api.put(`/masters/castes/${id}`, data),
  deleteCaste: (id: number) => api.delete(`/masters/castes/${id}`),

  getSubCastes: () => api.get("/masters/sub-castes"),
  createSubCaste: (data: any) => api.post("/masters/sub-castes", data),
  updateSubCaste: (id: number, data: any) => api.put(`/masters/sub-castes/${id}`, data),
  deleteSubCaste: (id: number) => api.delete(`/masters/sub-castes/${id}`),

  getReligions: () => api.get("/masters/religions"),
  createReligion: (data: any) => api.post("/masters/religions", data),
  updateReligion: (id: number, data: any) => api.put(`/masters/religions/${id}`, data),
  deleteReligion: (id: number) => api.delete(`/masters/religions/${id}`),

  getStates: () => api.get("/masters/states"),
  createState: (data: any) => api.post("/masters/states", data),
  updateState: (id: number, data: any) => api.put(`/masters/states/${id}`, data),
  deleteState: (id: number) => api.delete(`/masters/states/${id}`),

  getCities: () => api.get("/masters/cities"),
  createCity: (data: any) => api.post("/masters/cities", data),
  updateCity: (id: number, data: any) => api.put(`/masters/cities/${id}`, data),
  deleteCity: (id: number) => api.delete(`/masters/cities/${id}`),

  getBloodGroups: () => api.get("/masters/blood-groups"),
  createBloodGroup: (data: any) => api.post("/masters/blood-groups", data),
  updateBloodGroup: (id: number, data: any) => api.put(`/masters/blood-groups/${id}`, data),
  deleteBloodGroup: (id: number) => api.delete(`/masters/blood-groups/${id}`),

  getHouses: () => api.get("/masters/houses"),
  createHouse: (data: any) => api.post("/masters/houses", data),
  updateHouse: (id: number, data: any) => api.put(`/masters/houses/${id}`, data),
  deleteHouse: (id: number) => api.delete(`/masters/houses/${id}`),

  getAdmissionTypes: () => api.get("/masters/admission-types"),
  createAdmissionType: (data: any) => api.post("/masters/admission-types", data),
  updateAdmissionType: (id: number, data: any) => api.put(`/masters/admission-types/${id}`, data),
  deleteAdmissionType: (id: number) => api.delete(`/masters/admission-types/${id}`),

  getCategories: () => api.get("/masters/categories"),
  createCategory: (data: any) => api.post("/masters/categories", data),
  updateCategory: (id: number, data: any) => api.put(`/masters/categories/${id}`, data),
  deleteCategory: (id: number) => api.delete(`/masters/categories/${id}`),

  getSessions: () => api.get("/masters/sessions"),
  createSession: (data: any) => api.post("/masters/sessions", data),
  updateSession: (id: number, data: any) => api.put(`/masters/sessions/${id}`, data),
  deleteSession: (id: number) => api.delete(`/masters/sessions/${id}`),

  getBatches: () => api.get("/masters/batches"),
  createBatch: (data: any) => api.post("/masters/batches", data),
  updateBatch: (id: number, data: any) => api.put(`/masters/batches/${id}`, data),
  deleteBatch: (id: number) => api.delete(`/masters/batches/${id}`),

  getShifts: () => api.get("/masters/shifts"),
  createShift: (data: any) => api.post("/masters/shifts", data),
  updateShift: (id: number, data: any) => api.put(`/masters/shifts/${id}`, data),
  deleteShift: (id: number) => api.delete(`/masters/shifts/${id}`),

  getSubjects: () => api.get("/masters/subjects"),
  createSubject: (data: any) => api.post("/masters/subjects", data),
  updateSubject: (id: number, data: any) => api.put(`/masters/subjects/${id}`, data),
  deleteSubject: (id: number) => api.delete(`/masters/subjects/${id}`),

  getExamTypes: () => api.get("/masters/exam-types"),
  createExamType: (data: any) => api.post("/masters/exam-types", data),
  updateExamType: (id: number, data: any) => api.put(`/masters/exam-types/${id}`, data),
  deleteExamType: (id: number) => api.delete(`/masters/exam-types/${id}`),

  getDesignations: () => api.get("/masters/designations"),
  createDesignation: (data: any) => api.post("/masters/designations", data),
  updateDesignation: (id: number, data: any) => api.put(`/masters/designations/${id}`, data),
  deleteDesignation: (id: number) => api.delete(`/masters/designations/${id}`),

  getOccupations: () => api.get("/masters/occupations"),
  createOccupation: (data: any) => api.post("/masters/occupations", data),
  updateOccupation: (id: number, data: any) => api.put(`/masters/occupations/${id}`, data),
  deleteOccupation: (id: number) => api.delete(`/masters/occupations/${id}`),

  // Roles
  getRoles: () => api.get("/masters/roles"),
  createRole: (data: any) => api.post("/masters/roles", data),
  updateRole: (id: number, data: any) => api.put(`/masters/roles/${id}`, data),
  deleteRole: (id: number) => api.delete(`/masters/roles/${id}`),

  // Navigation (Sidebar)
  getNavigations: (roleId?: number) => api.get("/navigation", { params: { roleId } }),
  createNavigation: (data: any) => api.post("/navigation", data),
  updateNavigation: (id: number, data: any) => api.put(`/navigation/${id}`, data),
  deleteNavigation: (id: number) => api.delete(`/navigation/${id}`),

  // Notifications
  getNotifications: (params?: { userId?: number; role?: string }) => api.get("/notifications", { params }),
  markNotificationRead: (id: number) => api.put(`/notifications/${id}/read`),
  deleteNotification: (id: number) => api.delete(`/notifications/${id}`),

  // Communications
  getMessages: (params?: { userId?: number; type?: string }) => api.get("/messages", { params }),
  getMessageById: (id: number) => api.get(`/messages/${id}`),
  sendMessage: (data: any) => api.post("/messages", data),
  deleteMessage: (id: number) => api.delete(`/messages/${id}`),
  markMessageRead: (id: number) => api.put(`/messages/${id}/read`),

  // Users (for Role Assignment & Management)
  getUsers: () => api.get("/users"),
  createUser: (data: any) => api.post("/users", data),
  updateUser: (id: number, data: any) => api.put(`/users/${id}`, data),
  deleteUser: (id: number) => api.delete(`/users/${id}`),
  updateUserRole: (userId: number, role: string) => api.put(`/users/${userId}/role`, { role }),
};

export default api;
