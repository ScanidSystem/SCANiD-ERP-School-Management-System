/*
  ScanID Navigation Master Update Script v3
  Description: Normalizes Navigation IDs to sequence and implements requested role permissions.
*/

-- 1. CLEANUP
DELETE FROM [dbo].[NavigationRoles];
DELETE FROM [dbo].[NavigationItems];
GO

-- 2. INSERT SEQUENTIAL NAVIGATION ITEMS
SET IDENTITY_INSERT [dbo].[NavigationItems] ON;

-- Root Items
INSERT INTO [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive]) VALUES 
(1, N'Dashboard', N'LayoutDashboard', N'/', NULL, 1, 1),
(2, N'Academic Operations', N'BookOpen', NULL, NULL, 2, 1),
(3, N'Staff & HR', N'Users', NULL, NULL, 3, 1),
(4, N'Administrative', N'ShieldCheck', NULL, NULL, 4, 1),
(5, N'Masters & Config', N'Database', N'/configuration', NULL, 5, 1),
(6, N'System Audit', N'Terminal', N'/system-logs', NULL, 6, 1);

-- Sub-items for Academic Operations (2)
INSERT INTO [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive]) VALUES 
(7, N'Student Registry', N'GraduationCap', N'/students', 2, 1, 1),
(8, N'Attendance Tracking', N'CalendarCheck', N'/attendance', 2, 2, 1),
(9, N'Examination & Marks', N'BarChart3', N'/marks', 2, 3, 1);

-- Sub-items for Staff & HR (3)
INSERT INTO [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive]) VALUES 
(10, N'Teacher Catalog', N'UserCheck', N'/teachers', 3, 1, 1);

-- Sub-items for Administrative (4)
INSERT INTO [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive]) VALUES 
(11, N'Fee Management', N'CreditCard', N'/fees', 4, 1, 1),
(12, N'Communication Hub', N'MessageSquare', N'/messages', 4, 2, 1);

-- Sub-items for Masters & Config (5)
INSERT INTO [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive]) VALUES 
(13, N'Global Schools', N'School', N'/configuration/schools', 5, 1, 1),
(14, N'Access Control (RBAC)', N'ShieldCheck', NULL, 5, 2, 1),
(15, N'Menu Designer', N'Layout', NULL, 5, 3, 1),
(16, N'Academic Masters', N'BookOpen', NULL, 5, 4, 1);

-- Sub-sub-items for Access Control (14)
INSERT INTO [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive]) VALUES 
(17, N'Role Master', N'Shield', N'/configuration/role-master', 14, 1, 1),
(18, N'Role Assignment', N'UserCheck', N'/configuration/role-assignment', 14, 2, 1);

-- Sub-sub-items for Menu Designer (15)
INSERT INTO [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive]) VALUES 
(19, N'Navigation Builder', N'LayoutGrid', N'/configuration/navigation', 15, 1, 1);

-- Sub-sub-items for Academic Masters (16)
INSERT INTO [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive]) VALUES 
(20, N'Standards & Grades', N'Layers', N'/configuration/standards', 16, 1, 1),
(21, N'Divisions/Sections', N'Hash', N'/configuration/sections', 16, 2, 1),
(22, N'Academic Years', N'Calendar', N'/configuration/academic-years', 16, 3, 1),
(23, N'Subject Registry', N'BookOpen', N'/configuration/subjects', 16, 4, 1);

SET IDENTITY_INSERT [dbo].[NavigationItems] OFF;
GO

-- 3. ROLE PERMISSIONS
DECLARE @SuperAdminId INT = (SELECT Id FROM [dbo].[Roles] WHERE [Name] = 'SuperAdmin' OR [Name] = 'Super Admin');
DECLARE @AdminId INT = (SELECT Id FROM [dbo].[Roles] WHERE [Name] = 'Admin');
DECLARE @TeacherId INT = (SELECT Id FROM [dbo].[Roles] WHERE [Name] = 'Teacher');
DECLARE @ParentId INT = (SELECT Id FROM [dbo].[Roles] WHERE [Name] = 'Parent');

-- SuperAdmin & Admin: Everything (1-23)
IF @SuperAdminId IS NOT NULL
    INSERT INTO [dbo].[NavigationRoles] ([NavigationItemId], [RoleId])
    SELECT Id, @SuperAdminId FROM [dbo].[NavigationItems];

IF @AdminId IS NOT NULL
    INSERT INTO [dbo].[NavigationRoles] ([NavigationItemId], [RoleId])
    SELECT Id, @AdminId FROM [dbo].[NavigationItems];

-- Teacher: Dashboard, Operations, Registry, Attendance, Marks, Communication Hub
IF @TeacherId IS NOT NULL
BEGIN
    INSERT INTO [dbo].[NavigationRoles] ([NavigationItemId], [RoleId])
    VALUES 
    (1, @TeacherId), (2, @TeacherId), (7, @TeacherId), 
    (8, @TeacherId), (9, @TeacherId), (12, @TeacherId);
END

-- Parent: Dashboard, Communication Hub
IF @ParentId IS NOT NULL
BEGIN
    INSERT INTO [dbo].[NavigationRoles] ([NavigationItemId], [RoleId])
    VALUES (1, @ParentId), (12, @ParentId);
END
GO
