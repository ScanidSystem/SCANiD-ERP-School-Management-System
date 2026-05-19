/*
  DYNAMIC SIDEBAR NAVIGATION UPDATE SCRIPT
  Description: Creates tables for role-based hierarchical navigation if they don't exist.
*/

USE ScanID_DB;
GO

-- 1. Create NavigationItems table
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

-- 2. Create NavigationRoles mapping table
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

-- 3. Base Seed Data for Navigation if empty
IF NOT EXISTS (SELECT 1 FROM [dbo].[NavigationItems])
BEGIN
    SET IDENTITY_INSERT [dbo].[NavigationItems] ON;
    INSERT INTO [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder]) VALUES 
    (1, N'Dashboard', N'LayoutDashboard', N'/', NULL, 1),
    (2, N'Students', N'GraduationCap', N'/students', NULL, 2),
    (3, N'Teachers', N'UserCheck', N'/teachers', NULL, 3),
    (8, N'Masters & Config', N'Database', N'/configuration', NULL, 8);
    SET IDENTITY_INSERT [dbo].[NavigationItems] OFF;

    -- Assign basic roles
    INSERT INTO [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES 
    (1, 1), (1, 2), (1, 3), 
    (2, 1), (2, 2), (2, 3), 
    (3, 1), (3, 2),
    (8, 1);
END
GO
