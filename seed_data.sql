/*
  ScanID Database Seed Script
  Version: 1.2
  Description: Refined master data seeding with individual existence checks and proper identity management.
*/

-- 1. SCHOOLS
SET IDENTITY_INSERT [dbo].[Schools] ON;
IF NOT EXISTS (SELECT 1 FROM [dbo].[Schools] WHERE [Id] = 1)
    INSERT [dbo].[Schools] ([Id], [Name], [Address], [ContactNumber], [Email], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn]) 
    VALUES (1, N'SCANID PRIMARY SCHOOL', N'MUMBAI, MAHARASHTRA', N'9876543210', N'pri@scanid.com', 1, 0, N'SYSTEM', GETUTCDATE());
IF NOT EXISTS (SELECT 1 FROM [dbo].[Schools] WHERE [Id] = 2)
    INSERT [dbo].[Schools] ([Id], [Name], [Address], [ContactNumber], [Email], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn]) 
    VALUES (2, N'SCANID SECONDARY HIGH SCHOOL', N'PUNE, MAHARASHTRA', N'9876543211', N'sec@scanid.com', 1, 0, N'SYSTEM', GETUTCDATE());
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
    INSERT [dbo].[Users] ([Id], [FullName], [Email], [Username], [PasswordHash], [RoleId], [SchoolId], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn]) 
    VALUES (1, N'System Super Admin', N'superadmin@scanid.com', N'superadmin', N'AQAAAAEAACcQAAAAE...', 1, 1, 1, 0, N'SYSTEM', GETUTCDATE());
IF NOT EXISTS (SELECT 1 FROM [dbo].[Users] WHERE [Id] = 2)
    INSERT [dbo].[Users] ([Id], [FullName], [Email], [Username], [PasswordHash], [RoleId], [SchoolId], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn]) 
    VALUES (2, N'School Admin Mumbai', N'mumbaiadmin@scanid.com', N'mumbaiadmin', N'AQAAAAEAACcQAAAAE...', 2, 1, 1, 0, N'SYSTEM', GETUTCDATE());
IF NOT EXISTS (SELECT 1 FROM [dbo].[Users] WHERE [Id] = 3)
    INSERT [dbo].[Users] ([Id], [FullName], [Email], [Username], [PasswordHash], [RoleId], [SchoolId], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn]) 
    VALUES (3, N'Primary Teacher 01', N'teacher01@scanid.com', N'teacher01', N'AQAAAAEAACcQAAAAE...', 3, 1, 1, 0, N'SYSTEM', GETUTCDATE());
SET IDENTITY_INSERT [dbo].[Users] OFF;
GO

-- 13. TEACHERS
SET IDENTITY_INSERT [dbo].[Teachers] ON;
IF NOT EXISTS (SELECT 1 FROM [dbo].[Teachers] WHERE [Id] = 1)
    INSERT [dbo].[Teachers] ([Id], [UserId], [EmployeeId], [Qualification], [Experience], [Subject], [StandardId], [SectionId], [CreatedBy], [CreatedOn]) 
    VALUES (1, 3, N'EMP001', N'MA B.Ed', N'10 Years', N'Mathematics', 1, 1, N'SYSTEM', GETUTCDATE());
SET IDENTITY_INSERT [dbo].[Teachers] OFF;
GO

-- 14. STUDENTS
SET IDENTITY_INSERT [dbo].[Students] ON;
IF NOT EXISTS (SELECT 1 FROM [dbo].[Students] WHERE [Id] = 1)
    INSERT [dbo].[Students] ([Id], [RegistrationNumber], [FullName], [FirstName], [MiddleName], [LastName], [DateOfBirth], [Gender], [StandardId], [SectionId], [RollNumber], [BloodGroupId], [ReligionId], [CasteId], [SchoolId], [JoiningAcademicYearId], [AdmissionTypeId], [HouseId], [IsActive], [IsDeleted], [CreatedOn]) 
    VALUES (1, N'REG1001', N'Shivansh Sanjay Khopkar', N'Shivansh', N'Sanjay', N'Khopkar', '2018-05-15', N'Male', 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 0, GETUTCDATE());
IF NOT EXISTS (SELECT 1 FROM [dbo].[Students] WHERE [Id] = 2)
    INSERT [dbo].[Students] ([Id], [RegistrationNumber], [FullName], [FirstName], [MiddleName], [LastName], [DateOfBirth], [Gender], [StandardId], [SectionId], [RollNumber], [BloodGroupId], [ReligionId], [CasteId], [SchoolId], [JoiningAcademicYearId], [AdmissionTypeId], [HouseId], [IsActive], [IsDeleted], [CreatedOn]) 
    VALUES (2, N'REG1002', N'Aavya Amit Patil', N'Aavya', N'Amit', N'Patil', '2018-08-20', N'Female', 1, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 0, GETUTCDATE());
SET IDENTITY_INSERT [dbo].[Students] OFF;
GO
