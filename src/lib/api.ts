import axios from 'axios';

const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
