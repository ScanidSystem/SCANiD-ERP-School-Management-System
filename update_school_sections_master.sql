-- ==================================================================================
-- Incremental Update Query: Add SchoolSections Master Table and Navigation
-- ==================================================================================

-- 1. Create table SchoolSections if it does not exist
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SchoolSections]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[SchoolSections](
        [Id] [int] IDENTITY(1,1) NOT NULL,
        [Name] [nvarchar](100) NOT NULL,
        [IsActive] [bit] NOT NULL DEFAULT (1),
        [IsDeleted] [bit] NOT NULL DEFAULT (0),
        [CreatedBy] [nvarchar](max) NULL,
        [CreatedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
        [ModifiedBy] [nvarchar](max) NULL,
        [ModifiedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
     CONSTRAINT [PK_SchoolSections] PRIMARY KEY CLUSTERED ([Id] ASC)
    );
END
GO

-- 2. Seed default School Sections
SET IDENTITY_INSERT [dbo].[SchoolSections] ON;
IF NOT EXISTS (SELECT 1 FROM [dbo].[SchoolSections] WHERE [Id] = 1) 
    INSERT [dbo].[SchoolSections] ([Id], [Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) 
    VALUES (1, N'Primary', 1, 0, N'SYSTEM', GETUTCDATE(), N'SYSTEM', GETUTCDATE());
IF NOT EXISTS (SELECT 1 FROM [dbo].[SchoolSections] WHERE [Id] = 2) 
    INSERT [dbo].[SchoolSections] ([Id], [Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) 
    VALUES (2, N'Secondary', 1, 0, N'SYSTEM', GETUTCDATE(), N'SYSTEM', GETUTCDATE());
IF NOT EXISTS (SELECT 1 FROM [dbo].[SchoolSections] WHERE [Id] = 3) 
    INSERT [dbo].[SchoolSections] ([Id], [Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) 
    VALUES (3, N'Higher Secondary', 1, 0, N'SYSTEM', GETUTCDATE(), N'SYSTEM', GETUTCDATE());
SET IDENTITY_INSERT [dbo].[SchoolSections] OFF;
GO

-- 3. Add Navigation Item for School Sections (ID 459) under General Masters (ID 45)
SET IDENTITY_INSERT [dbo].[NavigationItems] ON;
IF NOT EXISTS (SELECT 1 FROM [dbo].[NavigationItems] WHERE [Id] = 459)
    INSERT INTO [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedOn])
    VALUES (459, N'School Sections', N'Layers', N'/configuration/school-sections', 45, 9, 1, GETUTCDATE());
SET IDENTITY_INSERT [dbo].[NavigationItems] OFF;
GO

-- 4. Map RBAC roles (SuperAdmin, Admin) to the new Navigation Item 459
DECLARE @SuperAdminId INT = (SELECT Id FROM [dbo].[Roles] WHERE [Name] = 'SuperAdmin');
DECLARE @AdminId INT = (SELECT Id FROM [dbo].[Roles] WHERE [Name] = 'Admin');

IF @SuperAdminId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM [dbo].[NavigationRoles] WHERE [NavigationItemId] = 459 AND [RoleId] = @SuperAdminId)
    INSERT INTO [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (459, @SuperAdminId);

IF @AdminId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM [dbo].[NavigationRoles] WHERE [NavigationItemId] = 459 AND [RoleId] = @AdminId)
    INSERT INTO [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (459, @AdminId);
GO
