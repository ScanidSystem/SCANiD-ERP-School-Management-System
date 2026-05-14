USE ScanID_DB;
GO

-- 1. SEED SCHOOLS
SET IDENTITY_INSERT [dbo].[Schools] ON;
INSERT INTO [dbo].[Schools] ([Id], [Name], [Code], [Address], [Email], [Phone], [TotalStudents], [Status], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn])
VALUES 
(1, 'Green Valley High', 'GVH001', '123 Education Lane, Springfield', 'info@greenvalley.edu', '555-0101', 500, 'Active', 1, 0, 'system', GETUTCDATE()),
(2, 'Oceanic Academy', 'OAC002', '456 Marine Drive, Bayview', 'contact@oceanicacademy.org', '555-0202', 350, 'Active', 1, 0, 'system', GETUTCDATE());
SET IDENTITY_INSERT [dbo].[Schools] OFF;
GO

-- 1.5 SEED ROLES
SET IDENTITY_INSERT [dbo].[Roles] ON;
INSERT INTO [dbo].[Roles] ([Id], [Name], [Description], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn])
VALUES 
(1, 'Super Admin', 'Full system access', 1, 0, 'system', GETUTCDATE()),
(2, 'Admin', 'School-level administrative access', 1, 0, 'system', GETUTCDATE()),
(3, 'Teacher', 'Academic and attendance access', 1, 0, 'system', GETUTCDATE()),
(4, 'Student', 'Student-level access', 1, 0, 'system', GETUTCDATE()),
(5, 'Parent', 'Parent-level access', 1, 0, 'system', GETUTCDATE());
SET IDENTITY_INSERT [dbo].[Roles] OFF;
GO

-- 1.7 SEED MASTER DATA
SET IDENTITY_INSERT [dbo].[Standards] ON;
INSERT INTO [dbo].[Standards] ([Id], [Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn])
VALUES (1, 'UKG', 1, 0, 'system', GETDATE()), 
       (2, '1st', 1, 0, 'system', GETDATE()), 
       (3, '10th', 1, 0, 'system', GETDATE());
SET IDENTITY_INSERT [dbo].[Standards] OFF;
GO

SET IDENTITY_INSERT [dbo].[Sections] ON;
INSERT INTO [dbo].[Sections] ([Id], [Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn])
VALUES (1, 'A', 1, 0, 'system', GETDATE()), 
       (2, 'B', 1, 0, 'system', GETDATE());
SET IDENTITY_INSERT [dbo].[Sections] OFF;
GO

SET IDENTITY_INSERT [dbo].[Religions] ON;
INSERT INTO [dbo].[Religions] ([Id], [Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn])
VALUES (1, 'Hindu', 1, 0, 'system', GETDATE()), 
       (2, 'Muslim', 1, 0, 'system', GETDATE()), 
       (3, 'Christian', 1, 0, 'system', GETDATE());
SET IDENTITY_INSERT [dbo].[Religions] OFF;
GO

SET IDENTITY_INSERT [dbo].[Castes] ON;
INSERT INTO [dbo].[Castes] ([Id], [Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn])
VALUES (1, 'General', 1, 0, 'system', GETDATE()), 
       (2, 'OBC', 1, 0, 'system', GETDATE()), 
       (3, 'SC', 1, 0, 'system', GETDATE());
SET IDENTITY_INSERT [dbo].[Castes] OFF;
GO

SET IDENTITY_INSERT [dbo].[AcademicYears] ON;
INSERT INTO [dbo].[AcademicYears] ([Id], [Name], [IsCurrent], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn])
VALUES (1, '2024-2025', 0, 1, 0, 'system', GETDATE()), 
       (2, '2025-2026', 1, 1, 0, 'system', GETDATE());
SET IDENTITY_INSERT [dbo].[AcademicYears] OFF;
GO

SET IDENTITY_INSERT [dbo].[BloodGroups] ON;
INSERT INTO [dbo].[BloodGroups] ([Id], [Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn])
VALUES (1, 'A+', 1, 0, 'system', GETDATE()), 
       (2, 'O+', 1, 0, 'system', GETDATE()), 
       (3, 'B+', 1, 0, 'system', GETDATE());
SET IDENTITY_INSERT [dbo].[BloodGroups] OFF;
GO

SET IDENTITY_INSERT [dbo].[Houses] ON;
INSERT INTO [dbo].[Houses] ([Id], [Name], [Color], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn])
VALUES (1, 'Red', '#ef4444', 1, 0, 'system', GETDATE()), 
       (2, 'Blue', '#3b82f6', 1, 0, 'system', GETDATE());
SET IDENTITY_INSERT [dbo].[Houses] OFF;
GO

SET IDENTITY_INSERT [dbo].[AdmissionTypes] ON;
INSERT INTO [dbo].[AdmissionTypes] ([Id], [Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn])
VALUES (1, 'Regular', 1, 0, 'system', GETDATE()), 
       (2, 'RTE', 1, 0, 'system', GETDATE());
SET IDENTITY_INSERT [dbo].[AdmissionTypes] OFF;
GO

SET IDENTITY_INSERT [dbo].[Shifts] ON;
INSERT INTO [dbo].[Shifts] ([Id], [Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn])
VALUES (1, 'SHIFT-I-XII', 1, 0, 'system', GETDATE());
SET IDENTITY_INSERT [dbo].[Shifts] OFF;
GO

-- 2. SEED USERS (Plain text password "Password123" for demo compatibility)
SET IDENTITY_INSERT [dbo].[Users] ON;
INSERT INTO [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [RoleId], [Role], [SchoolId], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn])
VALUES 
(1, 'superadmin', 'Password123', 'Global Admin', 'admin@scanid.com', 1, 'superadmin', NULL, 1, 0, 'system', GETUTCDATE()),
(2, 'schooladmin1', 'Password123', 'John Doe', 'john@greenvalley.edu', 2, 'admin', 1, 1, 0, 'system', GETUTCDATE()),
(3, 'teacher1', 'Password123', 'Sarah Wilson', 'sarah@greenvalley.edu', 3, 'teacher', 1, 1, 0, 'system', GETUTCDATE()),
(4, 'student1', 'Password123', 'James Brown', 'james@student.com', 4, 'student', 1, 1, 0, 'system', GETUTCDATE());
SET IDENTITY_INSERT [dbo].[Users] OFF;
GO

-- 3. SEED TEACHERS
SET IDENTITY_INSERT [dbo].[Teachers] ON;
INSERT INTO [dbo].[Teachers] ([Id], [UserId], [SchoolId], [EmployeeId], [Department], [Qualification], [ContactNumber], [Status], [IsActive])
VALUES 
(1, 3, 1, 'EMP001', 'Mathematics', 'M.Sc Mathematics', '555-9876', 'Active', 1);
SET IDENTITY_INSERT [dbo].[Teachers] OFF;
GO

-- 4. SEED STUDENTS
SET IDENTITY_INSERT [dbo].[Students] ON;
INSERT INTO [dbo].[Students] ([Id], [RegistrationNumber], [FullName], [SchoolId], [Status], [RollNumber], [IsActive], [FNAME], [LNAME], [STD], [DIV], [ROLLNO], [GENDER], [DOB], [MOBILE], [ProfilePhotoPath], [StandardId], [SectionId])
VALUES 
(1, 'REG/2024/001', 'James Brown', 1, 'Active', 1, 1, 'James', 'Brown', '10th', 'A', '1', 'Male', '2008-05-15', '555-1234', '/uploads/Green Valley High/10th/A/james_brown.jpg', 3, 1),
(2, 'REG/2024/002', 'Emily Davis', 1, 'Active', 2, 1, 'Emily', 'Davis', '10th', 'A', '2', 'Female', '2008-11-20', '555-5678', NULL, 3, 1),
(3, 'REG/2024/003', 'Liam Wilson', 2, 'Active', 1, 1, 'Liam', 'Wilson', '9th', 'B', '1', 'Male', '2009-02-10', '555-9012', NULL, NULL, 2);
SET IDENTITY_INSERT [dbo].[Students] OFF;
GO

-- 5. SEED ATTENDANCE
INSERT INTO [dbo].[Attendance] ([StudentId], [Date], [Status], [MarkedByUserId], [IsActive])
VALUES 
(1, GETUTCDATE(), 'Present', 3, 1),
(2, GETUTCDATE(), 'Present', 3, 1),
(3, GETUTCDATE(), 'Absent', 3, 1);
GO

-- 6. SEED FEES
INSERT INTO [dbo].[Fees] ([StudentId], [InvoiceNumber], [Type], [Amount], [DueDate], [PaidDate], [Status], [PaymentMethod], [IsActive])
VALUES 
(1, 'INV-001', 'Tuition', 2500.00, '2024-06-01', '2024-05-01', 'Paid', 'Online', 1),
(1, 'INV-002', 'Transport', 500.00, '2024-06-15', NULL, 'Pending', NULL, 1),
(2, 'INV-003', 'Tuition', 2500.00, '2024-06-01', '2024-05-05', 'Paid', 'Cash', 1);
GO

-- 7. SEED MARKS
INSERT INTO [dbo].[Marks] ([StudentId], [Subject], [ExamName], [MarksObtained], [TotalMarks], [Grade], [IsActive])
VALUES 
(1, 'Mathematics', 'Mid-Term', 85, 100, 'A', 1),
(1, 'Science', 'Mid-Term', 78, 100, 'B', 1),
(2, 'Mathematics', 'Mid-Term', 92, 100, 'A+', 1);
GO

-- 8. SEED MESSAGES
INSERT INTO [dbo].[Messages] ([SenderId], [ReceiverId], [Subject], [Content], [IsRead], [Type], [CreatedAt], [IsActive])
VALUES 
(1, 2, 'System Update', 'New attendance tracking feature is now live.', 0, 'Alert', GETUTCDATE(), 1),
(2, 4, 'Fee Reminder', 'Please pay your pending transport fees by June 15.', 0, 'Notification', GETUTCDATE(), 1);
GO

-- 9. AUDIT LOGS
INSERT INTO [dbo].[AuditLogs] ([UserId], [Type], [TableName], [DateTime], [NewValues], [PrimaryKey])
VALUES 
('superadmin', 'Create', 'Schools', GETUTCDATE(), 'Full seed data execution', 'N/A');
GO
