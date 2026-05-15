/*
  UPDATE USER ACCOUNTS SCRIPT
  Description: Adds the requested user types of Super Admin, Admin, Teacher, Parent, and Student.
  Password: Use 'Password123' for all these accounts.
  Execution: Run this on your existing ScanID_DB database.
*/

USE ScanID_DB;
GO

-- Identity Insert for Users table
SET IDENTITY_INSERT [dbo].[Users] ON;

-- 1. Super Admin (Mapped to superadmin)
IF EXISTS (SELECT 1 FROM [dbo].[Users] WHERE [Username] = 'superadmin')
    UPDATE [dbo].[Users] SET [FullName] = N'Super Admin' WHERE [Username] = 'superadmin';
ELSE
    INSERT INTO [dbo].[Users] ([Id], [FullName], [Email], [Username], [PasswordHash], [RoleId], [SchoolId], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn]) 
    VALUES (1, N'Super Admin', N'superadmin@scanid.com', N'superadmin', N'AQAAAAEAACcQAAAAE...', 1, 1, 1, 0, N'SYSTEM', GETUTCDATE());

-- 2. Admin (Mapped to mumbaiadmin or adminuser)
IF EXISTS (SELECT 1 FROM [dbo].[Users] WHERE [Username] = 'mumbaiadmin')
    UPDATE [dbo].[Users] SET [FullName] = N'Admin', [Username] = 'adminuser' WHERE [Username] = 'mumbaiadmin';
ELSE IF NOT EXISTS (SELECT 1 FROM [dbo].[Users] WHERE [Username] = 'adminuser')
    INSERT INTO [dbo].[Users] ([Id], [FullName], [Email], [Username], [PasswordHash], [RoleId], [SchoolId], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn]) 
    VALUES (4, N'Admin', N'admin@scanid.com', N'adminuser', N'AQAAAAEAACcQAAAAE...', 2, 1, 1, 0, N'SYSTEM', GETUTCDATE());

-- 3. Teacher (Mapped to teacher01 or teacher)
IF EXISTS (SELECT 1 FROM [dbo].[Users] WHERE [Username] = 'teacher01')
    UPDATE [dbo].[Users] SET [FullName] = N'Teacher', [Username] = 'teacher' WHERE [Username] = 'teacher01';
ELSE IF NOT EXISTS (SELECT 1 FROM [dbo].[Users] WHERE [Username] = 'teacher')
    INSERT INTO [dbo].[Users] ([Id], [FullName], [Email], [Username], [PasswordHash], [RoleId], [SchoolId], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn]) 
    VALUES (5, N'Teacher', N'teacher@scanid.com', N'teacher', N'AQAAAAEAACcQAAAAE...', 3, 1, 1, 0, N'SYSTEM', GETUTCDATE());

-- 4. Parent
IF NOT EXISTS (SELECT 1 FROM [dbo].[Users] WHERE [Username] = 'parent')
    INSERT INTO [dbo].[Users] ([Id], [FullName], [Email], [Username], [PasswordHash], [RoleId], [SchoolId], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn]) 
    VALUES (6, N'Parent', N'parent@scanid.com', N'parent', N'AQAAAAEAACcQAAAAE...', 5, 1, 1, 0, N'SYSTEM', GETUTCDATE());

-- 5. Student
IF NOT EXISTS (SELECT 1 FROM [dbo].[Users] WHERE [Username] = 'student')
    INSERT INTO [dbo].[Users] ([Id], [FullName], [Email], [Username], [PasswordHash], [RoleId], [SchoolId], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn]) 
    VALUES (7, N'Student', N'student@scanid.com', N'student', N'AQAAAAEAACcQAAAAE...', 4, 1, 1, 0, N'SYSTEM', GETUTCDATE());

SET IDENTITY_INSERT [dbo].[Users] OFF;
GO

PRINT 'User accounts updated successfully. Use "Password123" to login.';
GO
