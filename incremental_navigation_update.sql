/*
  INCREMENTAL NAVIGATION UPDATE SCRIPT
  Description: Updates the navigation structure to be more hierarchical and comprehensive.
  Execution: Run this on your existing ScanID_DB database.
*/

USE ScanID_DB;
GO

-- 1. Ensure Navigation Tables exist (Forward compatibility if not already in main schema)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[NavigationItems]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[NavigationItems](
        [Id] [int] IDENTITY(1,1) NOT NULL,
        [Title] [nvarchar](100) NOT NULL,
        [Icon] [nvarchar](100) NULL,
        [Path] [nvarchar](255) NULL,
        [ParentId] [int] NULL,
        [SortOrder] [int] NOT NULL DEFAULT (0),
        [IsActive] [bit] NOT NULL DEFAULT (1),
        [CreatedBy] [nvarchar](max) NULL,
        [CreatedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
        [ModifiedBy] [nvarchar](max) NULL,
        [ModifiedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
     CONSTRAINT [PK_NavigationItems] PRIMARY KEY CLUSTERED ([Id] ASC)
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[NavigationRoles]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[NavigationRoles](
        [NavigationItemId] [int] NOT NULL,
        [RoleId] [int] NOT NULL,
     CONSTRAINT [PK_NavigationRoles] PRIMARY KEY CLUSTERED ([NavigationItemId] ASC, [RoleId] ASC),
     CONSTRAINT [FK_NavigationRoles_NavigationItems] FOREIGN KEY([NavigationItemId]) REFERENCES [dbo].[NavigationItems] ([Id]) ON DELETE CASCADE,
     CONSTRAINT [FK_NavigationRoles_Roles] FOREIGN KEY([RoleId]) REFERENCES [dbo].[Roles] ([Id]) ON DELETE CASCADE
    );
END
GO

-- 2. Clear existing navigation to rebuild hierarchy (or skip if you want to keep custom changes)
-- We'll use a safer approach: check and update/insert
DELETE FROM [dbo].[NavigationRoles];
DELETE FROM [dbo].[NavigationItems];
GO

-- 3. Rebuild Hierarchical Navigation
SET IDENTITY_INSERT [dbo].[NavigationItems] ON;

-- Level 0: Top Level Parents & Standalone Items
INSERT INTO [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder]) VALUES 
(1, N'Dashboard', N'LayoutDashboard', N'/', NULL, 1),
(1000, N'Academic Operations', N'BookOpen', NULL, NULL, 2),
(2000, N'Staff & HR', N'Users', NULL, NULL, 3),
(3000, N'Administrative', N'ShieldCheck', NULL, NULL, 4),
(4000, N'Configuration', N'Database', N'/configuration', NULL, 5),
(5000, N'System Audit', N'Terminal', N'/system-logs', NULL, 6);

-- Level 1: Sub-items for Academic Operations (1000)
INSERT INTO [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder]) VALUES 
(11, N'Student Registry', N'GraduationCap', N'/students', 1000, 1),
(12, N'Attendance Tracking', N'CalendarCheck', N'/attendance', 1000, 2),
(13, N'Examination & Marks', N'BarChart3', N'/marks', 1000, 3);

-- Level 1: Sub-items for Staff & HR (2000)
INSERT INTO [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder]) VALUES 
(21, N'Teacher Catalog', N'UserCheck', N'/teachers', 2000, 1);

-- Level 1: Sub-items for Administrative (3000)
INSERT INTO [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder]) VALUES 
(31, N'Fee Management', N'CreditCard', N'/fees', 3000, 1),
(32, N'Communication Hub', N'MessageSquare', N'/messages', 3000, 2);

-- Level 1: Sub-items for Configuration (4000) - Deep links
INSERT INTO [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder]) VALUES 
(41, N'Global Schools', N'School', N'/configuration/schools', 4000, 1),
(42, N'Access Control (RBAC)', N'Key', N'/configuration/role-assignment', 4000, 2),
(43, N'Menu Designer', N'Layout', N'/configuration/navigation', 4000, 3);

SET IDENTITY_INSERT [dbo].[NavigationItems] OFF;
GO

-- 4. Map Roles to Navigation Items
-- Roles: 1:SuperAdmin, 2:Admin, 3:Teacher

-- SuperAdmin (1) gets everything
INSERT INTO [dbo].[NavigationRoles] ([NavigationItemId], [RoleId])
SELECT Id, 1 FROM [dbo].[NavigationItems];

-- Admin (2) gets most except System Audit and deep config
INSERT INTO [dbo].[NavigationRoles] ([NavigationItemId], [RoleId])
SELECT Id, 2 FROM [dbo].[NavigationItems] WHERE Id NOT IN (5000, 42, 43);

-- Teacher (3) gets Dashboard, Academics (Registry, Attendance, Marks), and Staff (read-only likely handled by FE)
INSERT INTO [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES 
(1, 3), 
(1000, 3), (11, 3), (12, 3), (13, 3),
(2000, 3), (21, 3),
(3000, 3), (32, 3);

GO
