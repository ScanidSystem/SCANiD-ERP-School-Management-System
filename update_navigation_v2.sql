/*
  ScanID Navigation Update Script v2
  Description: Updates navigation items to include deep hierarchy for Masters and Configuration.
*/

-- 1. CLEANUP PREVIOUS NAVIGATION
DELETE FROM [dbo].[NavigationRoles];
DELETE FROM [dbo].[NavigationItems];
GO

-- 2. INSERT CORE NAVIGATION ITEMS
SET IDENTITY_INSERT [dbo].[NavigationItems] ON;

-- Root level items
INSERT INTO [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive]) VALUES 
(1, N'Dashboard', N'LayoutDashboard', N'/', NULL, 1, 1),
(1000, N'Academic Operations', N'BookOpen', NULL, NULL, 2, 1),
(2000, N'Staff & HR', N'Users', NULL, NULL, 3, 1),
(3000, N'Administrative', N'ShieldCheck', NULL, NULL, 4, 1),
(4000, N'Masters & Config', N'Database', N'/configuration', NULL, 5, 1),
(5000, N'System Audit', N'Terminal', N'/system-logs', NULL, 6, 1);

-- Sub-items for Academic Operations (1000)
INSERT INTO [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive]) VALUES 
(11, N'Student Registry', N'GraduationCap', N'/students', 1000, 1, 1),
(12, N'Attendance Tracking', N'CalendarCheck', N'/attendance', 1000, 2, 1),
(13, N'Examination & Marks', N'BarChart3', N'/marks', 1000, 3, 1);

-- Sub-items for Staff & HR (2000)
INSERT INTO [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive]) VALUES 
(21, N'Teacher Catalog', N'UserCheck', N'/teachers', 2000, 1, 1);

-- Sub-items for Administrative (3000)
INSERT INTO [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive]) VALUES 
(31, N'Fee Management', N'CreditCard', N'/fees', 3000, 1, 1),
(32, N'Communication Hub', N'MessageSquare', N'/messages', 3000, 2, 1);

-- Sub-items for Masters & Config (4000)
INSERT INTO [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive]) VALUES 
(41, N'Global Schools', N'School', N'/configuration/schools', 4000, 1, 1),
(42, N'Access Control (RBAC)', N'ShieldCheck', NULL, 4000, 2, 1),
(43, N'Menu Designer', N'Layout', NULL, 4000, 3, 1),
(44, N'Academic Masters', N'BookOpen', NULL, 4000, 4, 1);

-- Sub-sub-items for Access Control (42)
INSERT INTO [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive]) VALUES 
(421, N'Role Master', N'Shield', N'/configuration/role-master', 42, 1, 1),
(422, N'Role Assignment', N'UserCheck', N'/configuration/role-assignment', 42, 2, 1);

-- Sub-sub-items for Menu Designer (43)
INSERT INTO [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive]) VALUES 
(431, N'Navigation Builder', N'LayoutGrid', N'/configuration/navigation', 43, 1, 1);

-- Sub-sub-items for Academic Masters (44)
INSERT INTO [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive]) VALUES 
(441, N'Standards & Grades', N'Layers', N'/configuration/standards', 44, 1, 1),
(442, N'Divisions/Sections', N'Hash', N'/configuration/sections', 44, 2, 1),
(443, N'Academic Years', N'Calendar', N'/configuration/academic-years', 44, 3, 1),
(444, N'Subject Registry', N'BookOpen', N'/configuration/subjects', 44, 4, 1);

SET IDENTITY_INSERT [dbo].[NavigationItems] OFF;
GO

-- 3. MAP ROLES
-- Get Role IDs
DECLARE @SuperAdminId INT = (SELECT Id FROM [dbo].[Roles] WHERE [Name] = 'SuperAdmin');
DECLARE @AdminId INT = (SELECT Id FROM [dbo].[Roles] WHERE [Name] = 'Admin');
DECLARE @TeacherId INT = (SELECT Id FROM [dbo].[Roles] WHERE [Name] = 'Teacher');

-- SuperAdmin gets everything
IF @SuperAdminId IS NOT NULL
    INSERT INTO [dbo].[NavigationRoles] ([NavigationItemId], [RoleId])
    SELECT Id, @SuperAdminId FROM [dbo].[NavigationItems];

-- Admin permissions
IF @AdminId IS NOT NULL
BEGIN
    INSERT INTO [dbo].[NavigationRoles] ([NavigationItemId], [RoleId])
    SELECT Id, @AdminId FROM [dbo].[NavigationItems] 
    WHERE Id NOT IN (5000, 41, 42, 421, 422, 43, 431); -- Exclude system logs, schools management, and deep RBAC/Menu
END

-- Teacher permissions
IF @TeacherId IS NOT NULL
BEGIN
    INSERT INTO [dbo].[NavigationRoles] ([NavigationItemId], [RoleId])
    SELECT Id, @TeacherId FROM [dbo].[NavigationItems] 
    WHERE Id IN (1, 1000, 11, 12, 13, 2000, 21, 3000, 32); -- Dashboard, Operations, Staff, Messaging
END
GO
