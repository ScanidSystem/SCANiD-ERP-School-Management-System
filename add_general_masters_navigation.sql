/*
  ScanID Implementation: Add General Masters Navigation
  Author: AI Assistant
  Date: 2024-05-18
  Purpose: Adds the "General Masters" section and its sub-items to the NavigationItems table
           and establishes correct RBAC mappings for SuperAdmin and Admin.
*/

USE ScanID_DB;
GO

-- 1. Identify Parent (Masters & Config)
-- Assuming Masters & Config has ID 11 from v3 sequential patch
DECLARE @ParentId INT = 11;
IF NOT EXISTS (SELECT 1 FROM [dbo].[NavigationItems] WHERE [Id] = @ParentId)
BEGIN
    -- Fallback to search by title if ID 11 is not found
    SET @ParentId = (SELECT TOP 1 [Id] FROM [dbo].[NavigationItems] WHERE [Title] = N'Masters & Config');
END

IF @ParentId IS NULL
BEGIN
    PRINT 'Error: Masters & Config parent menu not found.';
    RETURN;
END

-- 2. GET ROLES
DECLARE @SuperAdminId INT = (SELECT Id FROM [dbo].[Roles] WHERE [Name] = 'SuperAdmin');
DECLARE @AdminId INT = (SELECT Id FROM [dbo].[Roles] WHERE [Name] = 'Admin');

-- 3. INSERT NEW ITEMS
SET IDENTITY_INSERT [dbo].[NavigationItems] ON;

-- General Masters Root (under Masters & Config)
-- Using IDs starting from 45 to avoid collisions with 1-23 or generic sequences
IF NOT EXISTS (SELECT 1 FROM [dbo].[NavigationItems] WHERE [Id] = 45)
BEGIN
    INSERT INTO [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedOn])
    VALUES (45, N'General Masters', N'Database', NULL, @ParentId, 5, 1, GETUTCDATE());
END

-- Sub-items of General Masters
IF NOT EXISTS (SELECT 1 FROM [dbo].[NavigationItems] WHERE [Id] = 451)
    INSERT INTO [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedOn])
    VALUES (451, N'Religions', N'Heart', N'/configuration/religions', 45, 1, 1, GETUTCDATE());

IF NOT EXISTS (SELECT 1 FROM [dbo].[NavigationItems] WHERE [Id] = 452)
    INSERT INTO [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedOn])
    VALUES (452, N'Blood Groups', N'Droplets', N'/configuration/blood-groups', 45, 2, 1, GETUTCDATE());

IF NOT EXISTS (SELECT 1 FROM [dbo].[NavigationItems] WHERE [Id] = 453)
    INSERT INTO [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedOn])
    VALUES (453, N'Caste Category', N'Users', N'/configuration/castes', 45, 3, 1, GETUTCDATE());

IF NOT EXISTS (SELECT 1 FROM [dbo].[NavigationItems] WHERE [Id] = 454)
    INSERT INTO [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedOn])
    VALUES (454, N'Sub-Caste', N'UserCircle', N'/configuration/sub-castes', 45, 4, 1, GETUTCDATE());

IF NOT EXISTS (SELECT 1 FROM [dbo].[NavigationItems] WHERE [Id] = 455)
    INSERT INTO [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedOn])
    VALUES (455, N'School House', N'Home', N'/configuration/houses', 45, 5, 1, GETUTCDATE());

IF NOT EXISTS (SELECT 1 FROM [dbo].[NavigationItems] WHERE [Id] = 456)
    INSERT INTO [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedOn])
    VALUES (456, N'Admission Types', N'UserCheck', N'/configuration/admission-types', 45, 6, 1, GETUTCDATE());

SET IDENTITY_INSERT [dbo].[NavigationItems] OFF;

-- 4. INSERT NAVIGATION ROLES (RBAC)
-- Map SuperAdmin and Admin to these new items
INSERT INTO [dbo].[NavigationRoles] ([NavigationItemId], [RoleId])
SELECT n.Id, r.Id
FROM (SELECT 45 AS Id UNION ALL SELECT 451 UNION ALL SELECT 452 UNION ALL SELECT 453 UNION ALL SELECT 454 UNION ALL SELECT 455 UNION ALL SELECT 456) n
CROSS JOIN (SELECT @SuperAdminId AS Id UNION ALL SELECT @AdminId) r
WHERE r.Id IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM [dbo].[NavigationRoles] nr WHERE nr.NavigationItemId = n.Id AND nr.RoleId = r.Id);

-- Staff & HR Sub-items (Ensure Manage Users is present)
IF NOT EXISTS (SELECT 1 FROM [dbo].[NavigationItems] WHERE [Id] = 432)
BEGIN
    DECLARE @StaffParentId INT = (SELECT TOP 1 [Id] FROM [dbo].[NavigationItems] WHERE [Title] = N'Staff & HR');
    IF @StaffParentId IS NOT NULL
    BEGIN
        INSERT INTO [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedOn])
        VALUES (432, N'Manage Users', N'UserPlus', N'/configuration/users', @StaffParentId, 2, 1, GETUTCDATE());
        
        -- RBAC for Manage Users
        INSERT INTO [dbo].[NavigationRoles] ([NavigationItemId], [RoleId])
        SELECT 432, Id FROM [dbo].[Roles] WHERE [Name] IN ('SuperAdmin', 'Admin');
    END
END

PRINT 'General Masters navigation successfully added to database.';
GO
