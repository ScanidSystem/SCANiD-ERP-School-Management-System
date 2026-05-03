export type Role = "superadmin" | "admin" | "teacher" | "parent" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  schoolId?: string;
  schoolName?: string;
  academicYearId?: string;
  academicYearName?: string;
  academicYear?: string;
}
