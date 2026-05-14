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
INSERT INTO [dbo].[Standards] ([Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn])
VALUES ('UKG', 1, 0, 'system', GETDATE()), ('1st', 1, 0, 'system', GETDATE()), ('10th', 1, 0, 'system', GETDATE());

INSERT INTO [dbo].[Sections] ([Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn])
VALUES ('A', 1, 0, 'system', GETDATE()), ('B', 1, 0, 'system', GETDATE());

INSERT INTO [dbo].[Religions] ([Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn])
VALUES ('Hindu', 1, 0, 'system', GETDATE()), ('Muslim', 1, 0, 'system', GETDATE()), ('Christian', 1, 0, 'system', GETDATE());

INSERT INTO [dbo].[Castes] ([Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn])
VALUES ('General', 1, 0, 'system', GETDATE()), ('OBC', 1, 0, 'system', GETDATE()), ('SC', 1, 0, 'system', GETDATE());

INSERT INTO [dbo].[AcademicYears] ([Name], [IsCurrent], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn])
VALUES ('2024-2025', 0, 1, 0, 'system', GETDATE()), ('2025-2026', 1, 1, 0, 'system', GETDATE());

INSERT INTO [dbo].[BloodGroups] ([Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn])
VALUES ('A+', 1, 0, 'system', GETDATE()), ('O+', 1, 0, 'system', GETDATE()), ('B+', 1, 0, 'system', GETDATE());

INSERT INTO [dbo].[Houses] ([Name], [Color], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn])
VALUES ('Red', '#ef4444', 1, 0, 'system', GETDATE()), ('Blue', '#3b82f6', 1, 0, 'system', GETDATE());

INSERT INTO [dbo].[AdmissionTypes] ([Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn])
VALUES ('Regular', 1, 0, 'system', GETDATE()), ('RTE', 1, 0, 'system', GETDATE());

INSERT INTO [dbo].[Shifts] ([Name], [StartTime], [EndTime], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn])
VALUES ('SHIFT-I-XII', '08:00', '14:00', 1, 0, 'system', GETDATE());

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
