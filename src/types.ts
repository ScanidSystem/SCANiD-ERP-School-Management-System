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

export interface AuditLog {
  id: number;
  userId?: string;
  type?: string;
  tableName?: string;
  dateTime: string;
  oldValues?: string;
  newValues?: string;
  affectedColumns?: string;
  primaryKey?: string;
}

export interface ErrorLog {
  id: number;
  message?: string;
  level?: string;
  timestamp: string;
  exception?: string;
  properties?: string;
}
