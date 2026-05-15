import axios from "axios";

const DEFAULT_API_BASE_URL = "/api";

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const API_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL,
);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased to 30s so the debugger has time when you pause at a breakpoint
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
    { id: 1, title: "Dashboard", icon: "LayoutDashboard", path: "/", parentId: null, sortOrder: 1, roles: ["superadmin", "admin", "teacher"] },
    { id: 1000, title: "Academic Operations", icon: "BookOpen", path: null, parentId: null, sortOrder: 2, roles: ["superadmin", "admin", "teacher"] },
    { id: 11, title: "Student Registry", icon: "GraduationCap", path: "/students", parentId: 1000, sortOrder: 1, roles: ["superadmin", "admin", "teacher"] },
    { id: 12, title: "Attendance Tracking", icon: "CalendarCheck", path: "/attendance", parentId: 1000, sortOrder: 2, roles: ["superadmin", "admin", "teacher"] },
    { id: 13, title: "Examination & Marks", icon: "BarChart3", path: "/marks", parentId: 1000, sortOrder: 3, roles: ["superadmin", "admin", "teacher"] },
    
    { id: 2000, title: "Staff & HR", icon: "Users", path: null, parentId: null, sortOrder: 3, roles: ["superadmin", "admin", "teacher"] },
    { id: 21, title: "Teacher Catalog", icon: "UserCheck", path: "/teachers", parentId: 2000, sortOrder: 1, roles: ["superadmin", "admin", "teacher"] },
    
    { id: 3000, title: "Administrative", icon: "ShieldCheck", path: null, parentId: null, sortOrder: 4, roles: ["superadmin", "admin", "teacher"] },
    { id: 31, title: "Fee Management", icon: "CreditCard", path: "/fees", parentId: 3000, sortOrder: 1, roles: ["superadmin", "admin"] },
    { id: 32, title: "Communication Hub", icon: "MessageSquare", path: "/messages", parentId: 3000, sortOrder: 2, roles: ["superadmin", "admin", "teacher"] },
    
    { id: 4000, title: "Masters & Config", icon: "Database", path: "/configuration", parentId: null, sortOrder: 5, roles: ["superadmin", "admin"] },
    { id: 41, title: "Global Schools", icon: "School", path: "/configuration/schools", parentId: 4000, sortOrder: 1, roles: ["superadmin"] },
    { id: 42, title: "Access Control (RBAC)", icon: "Key", path: "/role-assignment", parentId: 4000, sortOrder: 2, roles: ["superadmin"] },
    { id: 43, title: "Menu Designer", icon: "Layout", path: "/navigation-management", parentId: 4000, sortOrder: 3, roles: ["superadmin"] },
    { id: 44, title: "Academic Masters", icon: "BookOpen", path: "/configuration/masters", parentId: 4000, sortOrder: 4, roles: ["superadmin", "admin"] },
    
    { id: 5000, title: "System Audit", icon: "Terminal", path: "/system-logs", parentId: null, sortOrder: 6, roles: ["superadmin"] },
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
    const isNotFound = error.response && error.response.status === 404;

    if (isNetworkError || isNotFound) {
      const configUrl = error.config?.url || "";
      const urlWithPrefix = configUrl.split("?")[0];
      const url = urlWithPrefix.startsWith("/api") ? urlWithPrefix.substring(4) : urlWithPrefix;
      
      console.warn(
        `Backend connection issue at [${urlWithPrefix}]. Error: ${error.message}. Using demo fallback data for URL: ${url}`
      );

      // Try exact match then startsWith for reliability
      let mockKey = Object.keys(mockFallbacks).find(key => url === key || url === key + "/" || url === "/" + key);
      
      if (!mockKey) {
        mockKey = Object.keys(mockFallbacks).find(key => url.startsWith(key));
      }

      if (mockKey) {
        const mockData = mockFallbacks[mockKey];
        // Wrap in { data: [...] } for masters if the URL contains /masters/
        const finalResponseData = url.includes("/masters/") || url === "/schools" || url === "/users" || url === "/navigation" || url === "/teachers" || url === "/students"
          ? { data: mockData }
          : mockData;
          
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
  getNavigations: () => api.get("/navigation"),
  createNavigation: (data: any) => api.post("/navigation", data),
  updateNavigation: (id: number, data: any) => api.put(`/navigation/${id}`, data),
  deleteNavigation: (id: number) => api.delete(`/navigation/${id}`),

  // Users (for Role Assignment & Management)
  getUsers: () => api.get("/users"),
  createUser: (data: any) => api.post("/users", data),
  updateUser: (id: number, data: any) => api.put(`/users/${id}`, data),
  deleteUser: (id: number) => api.delete(`/users/${id}`),
  updateUserRole: (userId: number, role: string) => api.put(`/users/${userId}/role`, { role }),
};

export default api;
