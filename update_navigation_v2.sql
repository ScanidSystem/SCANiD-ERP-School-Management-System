/*
  ScanID Implementation: Navigation RBAC Patch v2
  Author: AI Assistant
  Date: 2024-05-24
  Purpose: Extends sidebar menu visibility to Student and Parent roles.
*/

USE ScanID_DB;
GO

-- 1. Ensure all standard roles exist in the database
IF NOT EXISTS (SELECT 1 FROM [dbo].[Roles] WHERE [Name] = 'Student')
    INSERT INTO [dbo].[Roles] ([Name], [Description], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn])
    VALUES (N'Student', N'Student Account', 1, 0, N'SYSTEM', GETUTCDATE());

IF NOT EXISTS (SELECT 1 FROM [dbo].[Roles] WHERE [Name] = 'Parent')
    INSERT INTO [dbo].[Roles] ([Name], [Description], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn])
    VALUES (N'Parent', N'Guardian Account', 1, 0, N'SYSTEM', GETUTCDATE());

-- 2. Variables for IDs
DECLARE @StudentRoleId INT = (SELECT Id FROM [dbo].[Roles] WHERE [Name] = 'Student');
DECLARE @ParentRoleId INT = (SELECT Id FROM [dbo].[Roles] WHERE [Name] = 'Parent');

-- 3. ASSIGN NAVIGATION ROLES FOR STUDENT
IF @StudentRoleId IS NOT NULL
BEGIN
    -- Dashboard
    IF NOT EXISTS (SELECT 1 FROM [dbo].[NavigationRoles] WHERE [NavigationItemId] = 1 AND [RoleId] = @StudentRoleId)
        INSERT INTO [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (1, @StudentRoleId);
        
    -- Communication Hub (Messages)
    IF NOT EXISTS (SELECT 1 FROM [dbo].[NavigationRoles] WHERE [NavigationItemId] = 3000 AND [RoleId] = @StudentRoleId)
        INSERT INTO [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (3000, @StudentRoleId);
    IF NOT EXISTS (SELECT 1 FROM [dbo].[NavigationRoles] WHERE [NavigationItemId] = 32 AND [RoleId] = @StudentRoleId)
        INSERT INTO [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (32, @StudentRoleId);
        
    -- Marks/Exam result
    IF NOT EXISTS (SELECT 1 FROM [dbo].[NavigationRoles] WHERE [NavigationItemId] = 1000 AND [RoleId] = @StudentRoleId)
        INSERT INTO [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (1000, @StudentRoleId);
    IF NOT EXISTS (SELECT 1 FROM [dbo].[NavigationRoles] WHERE [NavigationItemId] = 13 AND [RoleId] = @StudentRoleId)
        INSERT INTO [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (13, @StudentRoleId);

    -- Attendance
    IF NOT EXISTS (SELECT 1 FROM [dbo].[NavigationRoles] WHERE [NavigationItemId] = 12 AND [RoleId] = @StudentRoleId)
        INSERT INTO [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (12, @StudentRoleId);
END

-- 4. ASSIGN NAVIGATION ROLES FOR PARENT
IF @ParentRoleId IS NOT NULL
BEGIN
    -- Dashboard
    IF NOT EXISTS (SELECT 1 FROM [dbo].[NavigationRoles] WHERE [NavigationItemId] = 1 AND [RoleId] = @ParentRoleId)
        INSERT INTO [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (1, @ParentRoleId);
        
    -- Academic Operations (Registry, Attendance, Marks)
    IF NOT EXISTS (SELECT 1 FROM [dbo].[NavigationRoles] WHERE [NavigationItemId] = 1000 AND [RoleId] = @ParentRoleId)
        INSERT INTO [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (1000, @ParentRoleId);
    IF NOT EXISTS (SELECT 1 FROM [dbo].[NavigationRoles] WHERE [NavigationItemId] = 11 AND [RoleId] = @ParentRoleId)
        INSERT INTO [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (11, @ParentRoleId);
    IF NOT EXISTS (SELECT 1 FROM [dbo].[NavigationRoles] WHERE [NavigationItemId] = 12 AND [RoleId] = @ParentRoleId)
        INSERT INTO [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (12, @ParentRoleId);
    IF NOT EXISTS (SELECT 1 FROM [dbo].[NavigationRoles] WHERE [NavigationItemId] = 13 AND [RoleId] = @ParentRoleId)
        INSERT INTO [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (13, @ParentRoleId);
        
    -- Administrative Group (Fees, Messages)
    IF NOT EXISTS (SELECT 1 FROM [dbo].[NavigationRoles] WHERE [NavigationItemId] = 3000 AND [RoleId] = @ParentRoleId)
        INSERT INTO [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (3000, @ParentRoleId);
    IF NOT EXISTS (SELECT 1 FROM [dbo].[NavigationRoles] WHERE [NavigationItemId] = 31 AND [RoleId] = @ParentRoleId)
        INSERT INTO [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (31, @ParentRoleId);
    IF NOT EXISTS (SELECT 1 FROM [dbo].[NavigationRoles] WHERE [NavigationItemId] = 32 AND [RoleId] = @ParentRoleId)
        INSERT INTO [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (32, @ParentRoleId);
END

-- 5. FINAL VERIFICATION: Ensure all defined NavigationItems have at least Admin access
DECLARE @AdminRoleId INT = (SELECT Id FROM [dbo].[Roles] WHERE [Name] = 'Admin');
IF @AdminRoleId IS NOT NULL
BEGIN
    INSERT INTO [dbo].[NavigationRoles] ([NavigationItemId], [RoleId])
    SELECT n.Id, @AdminRoleId
    FROM [dbo].[NavigationItems] n
    WHERE NOT EXISTS (SELECT 1 FROM [dbo].[NavigationRoles] nr WHERE nr.NavigationItemId = n.Id AND nr.RoleId = @AdminRoleId)
    AND n.Id NOT IN (5000); -- Admin doesn't see System Audit by default in this schema
END

PRINT 'Navigation RBAC Mapping successfully patched for all roles.';
GO
