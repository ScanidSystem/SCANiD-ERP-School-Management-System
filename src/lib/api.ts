import axios from 'axios';

const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 2000, // Short timeout to trigger fallback quickly
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fallback data for preview mode
const mockFallbacks: Record<string, any> = {
  '/stats': {
    totalStudents: 1248,
    totalTeachers: 84,
    feeCollection: "$45,200",
    attendanceRate: "92%",
    performanceTrend: "+2.4%"
  },
  '/students': [
    { id: 1, registrationNumber: "REG001", fullName: "Demo Student (Local Server Offline)", standard: "10th", section: "A", rollNumber: 1, address: "Localhost" }
  ],
  '/schools': [
    { id: 1, name: "Preview School (Demo)", status: "Active", address: "Cloud Preview" }
  ]
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.message === "Network Error" || error.code === "ECONNABORTED") {
      console.warn("Backend not detected at " + API_BASE_URL + ". Using demo fallback data.");
      const url = error.config.url.split('?')[0];
      if (mockFallbacks[url]) {
        return Promise.resolve({ data: mockFallbacks[url] });
      }
    }
    return Promise.reject(error);
  }
);

// Generic CRUD operations
export const apiService = {
  // Auth
  login: (credentials: any) => api.post('/auth/login', credentials),

  // Students
  getStudents: (schoolId?: number) => api.get('/students', { params: { schoolId } }),
  getStudentById: (id: number) => api.get(`/students/${id}`),
  createStudent: (data: any) => api.post('/students', data),
  updateStudent: (id: number, data: any) => api.put(`/students/${id}`, data),
  deleteStudent: (id: number) => api.delete(`/students/${id}`),

  // Marks
  getMarks: (schoolId?: number) => api.get('/marks', { params: { schoolId } }),
  
  // Schools
  getSchools: () => api.get('/schools'),
  getSchoolById: (id: number) => api.get(`/schools/${id}`),

  // Teachers
  getTeachers: (schoolId?: number) => api.get('/teachers', { params: { schoolId } }),
  createTeacher: (data: any) => api.post('/teachers', data),
  
  // Stats
  getStats: (schoolId?: number) => api.get('/stats', { params: { schoolId } }),
  
  // Attendance
  getAttendance: (date: string, schoolId?: number) => api.get('/attendance', { params: { date, schoolId } }),
  markAttendance: (data: any) => api.post('/attendance', data),

  // Fees
  getFees: (schoolId?: number) => api.get('/fees', { params: { schoolId } }),
};

export default api;
