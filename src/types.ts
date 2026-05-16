export type Role = string; // More flexible for dynamic roles from DB

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  username?: string;
  isActive?: boolean;
  schoolId?: string;
  schoolName?: string;
  academicYearId?: string;
  academicYearName?: string;
  academicYear?: string;
}

export interface Notification {
  id: number;
  userId?: number;
  roleId?: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
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
