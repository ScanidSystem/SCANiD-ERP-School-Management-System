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

-- 2. SEED USERS (Passwords are hashes of "Password123")
SET IDENTITY_INSERT [dbo].[Users] ON;
INSERT INTO [dbo].[Users] ([Id], [Username], [PasswordHash], [FullName], [Email], [Role], [SchoolId], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn])
VALUES 
(1, 'superadmin', 'AQAAAAEAACcQAAAAE...', 'Global Admin', 'admin@scanid.com', 'superadmin', NULL, 1, 0, 'system', GETUTCDATE()),
(2, 'schooladmin1', 'AQAAAAEAACcQAAAAE...', 'John Doe', 'john@greenvalley.edu', 'admin', 1, 1, 0, 'system', GETUTCDATE()),
(3, 'teacher1', 'AQAAAAEAACcQAAAAE...', 'Sarah Wilson', 'sarah@greenvalley.edu', 'teacher', 1, 1, 0, 'system', GETUTCDATE()),
(4, 'student1', 'AQAAAAEAACcQAAAAE...', 'James Brown', 'james@student.com', 'student', 1, 1, 0, 'system', GETUTCDATE());
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
INSERT INTO [dbo].[Students] ([Id], [RegistrationNumber], [FirstName], [LastName], [FullName], [SchoolId], [Standard], [Section], [DateOfBirth], [Gender], [RollNumber], [Status], [IsActive])
VALUES 
(1, 'REG/2024/001', 'James', 'Brown', 'James Brown', 1, '10th', 'A', '2008-05-15', 'Male', 1, 'Active', 1),
(2, 'REG/2024/002', 'Emily', 'Davis', 'Emily Davis', 1, '10th', 'A', '2008-11-20', 'Female', 2, 'Active', 1),
(3, 'REG/2024/003', 'Liam', 'Wilson', 'Liam Wilson', 2, '9th', 'B', '2009-02-10', 'Male', 1, 'Active', 1);
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
