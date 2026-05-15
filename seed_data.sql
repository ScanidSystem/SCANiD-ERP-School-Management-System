/*
  ScanID Database Seed Script
  Version: 1.2
  Description: Refined master data seeding with individual existence checks and proper identity management.
*/

-- 1. SCHOOLS
SET IDENTITY_INSERT [dbo].[Schools] ON;
IF NOT EXISTS (SELECT 1 FROM [dbo].[Schools] WHERE [Id] = 1)
    INSERT [dbo].[Schools] ([Id], [Name], [Address], [Phone], [Email], [TotalStudents], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn]) 
    VALUES (1, N'SCANID PRIMARY SCHOOL', N'MUMBAI, MAHARASHTRA', N'9876543210', N'pri@scanid.com', 0, 1, 0, N'SYSTEM', GETUTCDATE());
IF NOT EXISTS (SELECT 1 FROM [dbo].[Schools] WHERE [Id] = 2)
    INSERT [dbo].[Schools] ([Id], [Name], [Address], [Phone], [Email], [TotalStudents], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn]) 
    VALUES (2, N'SCANID SECONDARY HIGH SCHOOL', N'PUNE, MAHARASHTRA', N'9876543211', N'sec@scanid.com', 0, 1, 0, N'SYSTEM', GETUTCDATE());
SET IDENTITY_INSERT [dbo].[Schools] OFF;
GO

-- 2. ROLES
SET IDENTITY_INSERT [dbo].[Roles] ON;
IF NOT EXISTS (SELECT 1 FROM [dbo].[Roles] WHERE [Id] = 1)
    INSERT [dbo].[Roles] ([Id], [Name], [Description], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn]) 
    VALUES (1, N'SuperAdmin', N'Global System Administrator', 1, 0, N'SYSTEM', GETUTCDATE());
IF NOT EXISTS (SELECT 1 FROM [dbo].[Roles] WHERE [Id] = 2)
    INSERT [dbo].[Roles] ([Id], [Name], [Description], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn]) 
    VALUES (2, N'Admin', N'School Level Administrator', 1, 0, N'SYSTEM', GETUTCDATE());
IF NOT EXISTS (SELECT 1 FROM [dbo].[Roles] WHERE [Id] = 3)
    INSERT [dbo].[Roles] ([Id], [Name], [Description], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn]) 
    VALUES (3, N'Teacher', N'Teaching Staff', 1, 0, N'SYSTEM', GETUTCDATE());
IF NOT EXISTS (SELECT 1 FROM [dbo].[Roles] WHERE [Id] = 4)
    INSERT [dbo].[Roles] ([Id], [Name], [Description], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn]) 
    VALUES (4, N'Student', N'Student Account', 1, 0, N'SYSTEM', GETUTCDATE());
IF NOT EXISTS (SELECT 1 FROM [dbo].[Roles] WHERE [Id] = 5)
    INSERT [dbo].[Roles] ([Id], [Name], [Description], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn]) 
    VALUES (5, N'Parent', N'Guardian Account', 1, 0, N'SYSTEM', GETUTCDATE());
SET IDENTITY_INSERT [dbo].[Roles] OFF;
GO

-- 3. STANDARDS (Grade Levels)
SET IDENTITY_INSERT [dbo].[Standards] ON;
IF NOT EXISTS (SELECT 1 FROM [dbo].[Standards] WHERE [Id] = 1) INSERT [dbo].[Standards] ([Id], [Name], [IsActive], [IsDeleted]) VALUES (1, N'1st', 1, 0);
IF NOT EXISTS (SELECT 1 FROM [dbo].[Standards] WHERE [Id] = 2) INSERT [dbo].[Standards] ([Id], [Name], [IsActive], [IsDeleted]) VALUES (2, N'2nd', 1, 0);
IF NOT EXISTS (SELECT 1 FROM [dbo].[Standards] WHERE [Id] = 3) INSERT [dbo].[Standards] ([Id], [Name], [IsActive], [IsDeleted]) VALUES (3, N'3rd', 1, 0);
IF NOT EXISTS (SELECT 1 FROM [dbo].[Standards] WHERE [Id] = 4) INSERT [dbo].[Standards] ([Id], [Name], [IsActive], [IsDeleted]) VALUES (4, N'4th', 1, 0);
IF NOT EXISTS (SELECT 1 FROM [dbo].[Standards] WHERE [Id] = 5) INSERT [dbo].[Standards] ([Id], [Name], [IsActive], [IsDeleted]) VALUES (5, N'5th', 1, 0);
IF NOT EXISTS (SELECT 1 FROM [dbo].[Standards] WHERE [Id] = 6) INSERT [dbo].[Standards] ([Id], [Name], [IsActive], [IsDeleted]) VALUES (6, N'LKG', 1, 0);
IF NOT EXISTS (SELECT 1 FROM [dbo].[Standards] WHERE [Id] = 7) INSERT [dbo].[Standards] ([Id], [Name], [IsActive], [IsDeleted]) VALUES (7, N'UKG', 1, 0);
SET IDENTITY_INSERT [dbo].[Standards] OFF;
GO

-- 4. SECTIONS (Divisions)
SET IDENTITY_INSERT [dbo].[Sections] ON;
IF NOT EXISTS (SELECT 1 FROM [dbo].[Sections] WHERE [Id] = 1) INSERT [dbo].[Sections] ([Id], [Name], [IsActive], [IsDeleted]) VALUES (1, N'A', 1, 0);
IF NOT EXISTS (SELECT 1 FROM [dbo].[Sections] WHERE [Id] = 2) INSERT [dbo].[Sections] ([Id], [Name], [IsActive], [IsDeleted]) VALUES (2, N'B', 1, 0);
IF NOT EXISTS (SELECT 1 FROM [dbo].[Sections] WHERE [Id] = 3) INSERT [dbo].[Sections] ([Id], [Name], [IsActive], [IsDeleted]) VALUES (3, N'C', 1, 0);
SET IDENTITY_INSERT [dbo].[Sections] OFF;
GO

-- 5. RELIGIONS
SET IDENTITY_INSERT [dbo].[Religions] ON;
IF NOT EXISTS (SELECT 1 FROM [dbo].[Religions] WHERE [Id] = 1) INSERT [dbo].[Religions] ([Id], [Name], [IsActive], [IsDeleted]) VALUES (1, N'HINDU', 1, 0);
IF NOT EXISTS (SELECT 1 FROM [dbo].[Religions] WHERE [Id] = 2) INSERT [dbo].[Religions] ([Id], [Name], [IsActive], [IsDeleted]) VALUES (2, N'MUSLIM', 1, 0);
IF NOT EXISTS (SELECT 1 FROM [dbo].[Religions] WHERE [Id] = 3) INSERT [dbo].[Religions] ([Id], [Name], [IsActive], [IsDeleted]) VALUES (3, N'CHRISTIAN', 1, 0);
IF NOT EXISTS (SELECT 1 FROM [dbo].[Religions] WHERE [Id] = 4) INSERT [dbo].[Religions] ([Id], [Name], [IsActive], [IsDeleted]) VALUES (4, N'SIKH', 1, 0);
SET IDENTITY_INSERT [dbo].[Religions] OFF;
GO

-- 6. CASTES
SET IDENTITY_INSERT [dbo].[Castes] ON;
IF NOT EXISTS (SELECT 1 FROM [dbo].[Castes] WHERE [Id] = 1) INSERT [dbo].[Castes] ([Id], [Name], [IsActive], [IsDeleted]) VALUES (1, N'OPEN', 1, 0);
IF NOT EXISTS (SELECT 1 FROM [dbo].[Castes] WHERE [Id] = 2) INSERT [dbo].[Castes] ([Id], [Name], [IsActive], [IsDeleted]) VALUES (2, N'OBC', 1, 0);
IF NOT EXISTS (SELECT 1 FROM [dbo].[Castes] WHERE [Id] = 3) INSERT [dbo].[Castes] ([Id], [Name], [IsActive], [IsDeleted]) VALUES (3, N'SC', 1, 0);
IF NOT EXISTS (SELECT 1 FROM [dbo].[Castes] WHERE [Id] = 4) INSERT [dbo].[Castes] ([Id], [Name], [IsActive], [IsDeleted]) VALUES (4, N'ST', 1, 0);
SET IDENTITY_INSERT [dbo].[Castes] OFF;
GO

-- 7. ACADEMIC YEARS
SET IDENTITY_INSERT [dbo].[AcademicYears] ON;
IF NOT EXISTS (SELECT 1 FROM [dbo].[AcademicYears] WHERE [Id] = 1) INSERT [dbo].[AcademicYears] ([Id], [Name], [IsCurrent], [IsActive], [IsDeleted]) VALUES (1, N'2024-2025', 0, 1, 0);
IF NOT EXISTS (SELECT 1 FROM [dbo].[AcademicYears] WHERE [Id] = 2) INSERT [dbo].[AcademicYears] ([Id], [Name], [IsCurrent], [IsActive], [IsDeleted]) VALUES (2, N'2025-2026', 1, 1, 0);
SET IDENTITY_INSERT [dbo].[AcademicYears] OFF;
GO

-- 8. BLOOD GROUPS
SET IDENTITY_INSERT [dbo].[BloodGroups] ON;
IF NOT EXISTS (SELECT 1 FROM [dbo].[BloodGroups] WHERE [Id] = 1) INSERT [dbo].[BloodGroups] ([Id], [Name], [IsActive], [IsDeleted]) VALUES (1, N'A+', 1, 0);
IF NOT EXISTS (SELECT 1 FROM [dbo].[BloodGroups] WHERE [Id] = 2) INSERT [dbo].[BloodGroups] ([Id], [Name], [IsActive], [IsDeleted]) VALUES (2, N'B+', 1, 0);
IF NOT EXISTS (SELECT 1 FROM [dbo].[BloodGroups] WHERE [Id] = 3) INSERT [dbo].[BloodGroups] ([Id], [Name], [IsActive], [IsDeleted]) VALUES (3, N'O+', 1, 0);
IF NOT EXISTS (SELECT 1 FROM [dbo].[BloodGroups] WHERE [Id] = 4) INSERT [dbo].[BloodGroups] ([Id], [Name], [IsActive], [IsDeleted]) VALUES (4, N'AB+', 1, 0);
SET IDENTITY_INSERT [dbo].[BloodGroups] OFF;
GO

-- 9. HOUSES
SET IDENTITY_INSERT [dbo].[Houses] ON;
IF NOT EXISTS (SELECT 1 FROM [dbo].[Houses] WHERE [Id] = 1) INSERT [dbo].[Houses] ([Id], [Name], [Color], [IsActive], [IsDeleted]) VALUES (1, N'RED', N'#EF4444', 1, 0);
IF NOT EXISTS (SELECT 1 FROM [dbo].[Houses] WHERE [Id] = 2) INSERT [dbo].[Houses] ([Id], [Name], [Color], [IsActive], [IsDeleted]) VALUES (2, N'BLUE', N'#3B82F6', 1, 0);
IF NOT EXISTS (SELECT 1 FROM [dbo].[Houses] WHERE [Id] = 3) INSERT [dbo].[Houses] ([Id], [Name], [Color], [IsActive], [IsDeleted]) VALUES (3, N'GREEN', N'#10B981', 1, 0);
IF NOT EXISTS (SELECT 1 FROM [dbo].[Houses] WHERE [Id] = 4) INSERT [dbo].[Houses] ([Id], [Name], [Color], [IsActive], [IsDeleted]) VALUES (4, N'YELLOW', N'#F59E0B', 1, 0);
SET IDENTITY_INSERT [dbo].[Houses] OFF;
GO

-- 10. ADMISSION TYPES
SET IDENTITY_INSERT [dbo].[AdmissionTypes] ON;
IF NOT EXISTS (SELECT 1 FROM [dbo].[AdmissionTypes] WHERE [Id] = 1) INSERT [dbo].[AdmissionTypes] ([Id], [Name], [IsActive], [IsDeleted]) VALUES (1, N'REGULAR', 1, 0);
IF NOT EXISTS (SELECT 1 FROM [dbo].[AdmissionTypes] WHERE [Id] = 2) INSERT [dbo].[AdmissionTypes] ([Id], [Name], [IsActive], [IsDeleted]) VALUES (2, N'RTE', 1, 0);
IF NOT EXISTS (SELECT 1 FROM [dbo].[AdmissionTypes] WHERE [Id] = 3) INSERT [dbo].[AdmissionTypes] ([Id], [Name], [IsActive], [IsDeleted]) VALUES (3, N'STAFF CHILD', 1, 0);
SET IDENTITY_INSERT [dbo].[AdmissionTypes] OFF;
GO

-- 11. SHIFTS
SET IDENTITY_INSERT [dbo].[Shifts] ON;
IF NOT EXISTS (SELECT 1 FROM [dbo].[Shifts] WHERE [Id] = 1) INSERT [dbo].[Shifts] ([Id], [Name], [IsActive], [IsDeleted]) VALUES (1, N'MORNING', 1, 0);
IF NOT EXISTS (SELECT 1 FROM [dbo].[Shifts] WHERE [Id] = 2) INSERT [dbo].[Shifts] ([Id], [Name], [IsActive], [IsDeleted]) VALUES (2, N'AFTERNOON', 1, 0);
SET IDENTITY_INSERT [dbo].[Shifts] OFF;
GO

-- 12. USERS (Core Identities)
SET IDENTITY_INSERT [dbo].[Users] ON;
IF NOT EXISTS (SELECT 1 FROM [dbo].[Users] WHERE [Id] = 1)
    INSERT [dbo].[Users] ([Id], [FullName], [Email], [Username], [PasswordHash], [RoleId], [Role], [SchoolId], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn]) 
    VALUES (1, N'Super Admin', N'superadmin@scanid.com', N'superadmin', N'AQAAAAEAACcQAAAAE...', 1, 'superadmin', 1, 1, 0, N'SYSTEM', GETUTCDATE());
IF NOT EXISTS (SELECT 1 FROM [dbo].[Users] WHERE [Id] = 2)
    INSERT [dbo].[Users] ([Id], [FullName], [Email], [Username], [PasswordHash], [RoleId], [Role], [SchoolId], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn]) 
    VALUES (2, N'Admin', N'admin@scanid.com', N'adminuser', N'AQAAAAEAACcQAAAAE...', 2, 'admin', 1, 1, 0, N'SYSTEM', GETUTCDATE());
IF NOT EXISTS (SELECT 1 FROM [dbo].[Users] WHERE [Id] = 3)
    INSERT [dbo].[Users] ([Id], [FullName], [Email], [Username], [PasswordHash], [RoleId], [Role], [SchoolId], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn]) 
    VALUES (3, N'Teacher', N'teacher@scanid.com', N'teacher', N'AQAAAAEAACcQAAAAE...', 3, 'teacher', 1, 1, 0, N'SYSTEM', GETUTCDATE());
IF NOT EXISTS (SELECT 1 FROM [dbo].[Users] WHERE [Id] = 6)
    INSERT [dbo].[Users] ([Id], [FullName], [Email], [Username], [PasswordHash], [RoleId], [Role], [SchoolId], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn]) 
    VALUES (6, N'Parent', N'parent@scanid.com', N'parent', N'AQAAAAEAACcQAAAAE...', 5, 'parent', 1, 1, 0, N'SYSTEM', GETUTCDATE());
IF NOT EXISTS (SELECT 1 FROM [dbo].[Users] WHERE [Id] = 7)
    INSERT [dbo].[Users] ([Id], [FullName], [Email], [Username], [PasswordHash], [RoleId], [Role], [SchoolId], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn]) 
    VALUES (7, N'Student', N'student@scanid.com', N'student', N'AQAAAAEAACcQAAAAE...', 4, 'student', 1, 1, 0, N'SYSTEM', GETUTCDATE());
SET IDENTITY_INSERT [dbo].[Users] OFF;
GO

-- 13. TEACHERS
SET IDENTITY_INSERT [dbo].[Teachers] ON;
IF NOT EXISTS (SELECT 1 FROM [dbo].[Teachers] WHERE [Id] = 1)
    INSERT [dbo].[Teachers] ([Id], [UserId], [SchoolId], [EmployeeId], [Qualification], [Experience], [Subject], [StandardId], [SectionId], [ContactNumber], [CreatedBy], [CreatedOn]) 
    VALUES (1, 3, 1, N'EMP001', N'MA B.Ed', N'5+ Years', N'Mathematics', 1, 1, N'9876543210', N'SYSTEM', GETUTCDATE());
SET IDENTITY_INSERT [dbo].[Teachers] OFF;
GO

-- 14. STUDENTS
SET IDENTITY_INSERT [dbo].[Students] ON;
IF NOT EXISTS (SELECT 1 FROM [dbo].[Students] WHERE [Id] = 1)
    INSERT [dbo].[Students] ([Id], [RegistrationNumber], [FullName], [FirstName], [LastName], [DateOfBirth], [Gender], [StandardId], [SectionId], [RollNumber], [BloodGroupId], [ReligionId], [CasteId], [SchoolId], [AdmissionTypeId], [HouseId], [IsActive], [IsDeleted], [CreatedOn], [STD], [DIV], [ROLLNO]) 
    VALUES (1, N'REG1001', N'Shivansh Sanjay Khopkar', N'Shivansh', N'Khopkar', N'2015-05-20', N'Male', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, GETUTCDATE(), N'1st', N'A', N'1');
IF NOT EXISTS (SELECT 1 FROM [dbo].[Students] WHERE [Id] = 2)
    INSERT [dbo].[Students] ([Id], [RegistrationNumber], [FullName], [FirstName], [LastName], [DateOfBirth], [Gender], [StandardId], [SectionId], [RollNumber], [BloodGroupId], [ReligionId], [CasteId], [SchoolId], [AdmissionTypeId], [HouseId], [IsActive], [IsDeleted], [CreatedOn], [STD], [DIV], [ROLLNO]) 
    VALUES (2, N'REG1002', N'Aavya Amit Patil', N'Aavya', N'Patil', N'2015-08-15', N'Female', 1, 1, 2, 2, 1, 2, 1, 1, 2, 1, 0, GETUTCDATE(), N'1st', N'A', N'2');
SET IDENTITY_INSERT [dbo].[Students] OFF;
GO

-- 15. NAVIGATION (Hierarchical structure)
SET IDENTITY_INSERT [dbo].[NavigationItems] ON;
IF NOT EXISTS (SELECT 1 FROM [dbo].[NavigationItems] WHERE [Id] = 1)
BEGIN
    INSERT INTO [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder]) VALUES 
    (1, N'Dashboard', N'LayoutDashboard', N'/', NULL, 1),
    (1000, N'Academic Operations', N'BookOpen', NULL, NULL, 2),
    (2000, N'Staff & HR', N'Users', NULL, NULL, 3),
    (3000, N'Administrative', N'ShieldCheck', NULL, NULL, 4),
    (4000, N'Configuration', N'Database', N'/configuration', NULL, 5),
    (5000, N'System Audit', N'Terminal', N'/system-logs', NULL, 6);

    -- Sub-items for Academic Operations (1000)
    INSERT INTO [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder]) VALUES 
    (11, N'Student Registry', N'GraduationCap', N'/students', 1000, 1),
    (12, N'Attendance Tracking', N'CalendarCheck', N'/attendance', 1000, 2),
    (13, N'Examination & Marks', N'BarChart3', N'/marks', 1000, 3);

    -- Sub-items for Staff & HR (2000)
    INSERT INTO [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder]) VALUES 
    (21, N'Teacher Catalog', N'UserCheck', N'/teachers', 2000, 1);

    -- Sub-items for Administrative (3000)
    INSERT INTO [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder]) VALUES 
    (31, N'Fee Management', N'CreditCard', N'/fees', 3000, 1),
    (32, N'Communication Hub', N'MessageSquare', N'/messages', 3000, 2);

    -- Sub-items for Configuration (4000)
    INSERT INTO [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder]) VALUES 
    (41, N'Global Schools', N'School', N'/configuration/schools', 4000, 1),
    (42, N'Access Control (RBAC)', N'Key', N'/configuration/role-assignment', 4000, 2),
    (43, N'Menu Designer', N'Layout', N'/configuration/navigation', 4000, 3);
END
SET IDENTITY_INSERT [dbo].[NavigationItems] OFF;

-- Mapping Roles (Dynamic Lookup)
IF NOT EXISTS (SELECT 1 FROM [dbo].[NavigationRoles])
BEGIN
    DECLARE @SRoleId INT = (SELECT Id FROM [dbo].[Roles] WHERE [Name] = 'SuperAdmin');
    DECLARE @ARoleId INT = (SELECT Id FROM [dbo].[Roles] WHERE [Name] = 'Admin');
    DECLARE @TRoleId INT = (SELECT Id FROM [dbo].[Roles] WHERE [Name] = 'Teacher');

    -- SuperAdmin gets everything
    IF @SRoleId IS NOT NULL
        INSERT INTO [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) SELECT Id, @SRoleId FROM [dbo].[NavigationItems];

    -- Admin gets most except System Audit and deep config
    IF @ARoleId IS NOT NULL
        INSERT INTO [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) SELECT Id, @ARoleId FROM [dbo].[NavigationItems] WHERE Id NOT IN (5000, 42, 43);

    -- Teacher gets critical operational items
    IF @TRoleId IS NOT NULL
        INSERT INTO [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES 
        (1, @TRoleId), (1000, @TRoleId), (11, @TRoleId), (12, @TRoleId), (13, @TRoleId), (2000, @TRoleId), (21, @TRoleId), (3000, @TRoleId), (32, @TRoleId);
END
GO
