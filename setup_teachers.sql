-- ========================================================
-- DATABASE UPDATE SCRIPT: Teachers Table & Sample Data
-- ========================================================

-- 1. Ensure Teachers table has the ContactNumber column
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Teachers]') AND name = N'ContactNumber')
BEGIN
    PRINT 'Adding ContactNumber column to Teachers table...';
    ALTER TABLE [dbo].[Teachers] ADD [ContactNumber] NVARCHAR(MAX) NULL;
END
ELSE
BEGIN
    PRINT 'ContactNumber column already exists in Teachers table.';
END
GO

-- Ensure Students table has the ContactNumber column (Common mismatch)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Students]') AND name = N'ContactNumber')
BEGIN
    PRINT 'Adding ContactNumber column to Students table...';
    ALTER TABLE [dbo].[Students] ADD [ContactNumber] NVARCHAR(MAX) NULL;
END
GO

-- 2. Seed Sample Schools (if not exists)
IF NOT EXISTS (SELECT 1 FROM Schools WHERE Id = 1)
BEGIN
    PRINT 'Seeding sample School...';
    SET IDENTITY_INSERT Schools ON;
    INSERT INTO Schools (Id, Name, Code, Address, Email, TotalStudents, Status, CreatedAt)
    VALUES (1, 'ScanID Excellence Academy', 'SEA001', '456 Innovation Drive, Tech City', 'admin@scanid.edu', 1200, 'Active', GETUTCDATE());
    SET IDENTITY_INSERT Schools OFF;
END
GO

-- 3. Seed Sample Users & Teachers
PRINT 'Checking and seeding Sample Teachers...';

-- Teacher: Sarah Johnson
IF NOT EXISTS (SELECT 1 FROM Users WHERE Username = 'sarah_t')
BEGIN
    INSERT INTO Users (Username, PasswordHash, FullName, Email, Role, SchoolId)
    VALUES ('sarah_t', 'admin123', 'Sarah Johnson', 'sarah.j@school.com', 'teacher', 1);
    
    DECLARE @Uid1 INT = SCOPE_IDENTITY();
    INSERT INTO Teachers (UserId, SchoolId, EmployeeId, Department, Qualification, ContactNumber, Status)
    VALUES (@Uid1, 1, 'TCH-2024-001', 'Mathematics', 'PhD in Pure Mathematics', '+1-555-0101', 'Active');
    PRINT 'Teacher Sarah Johnson added.';
END

-- Teacher: Mark Thompson
IF NOT EXISTS (SELECT 1 FROM Users WHERE Username = 'mark_t')
BEGIN
    INSERT INTO Users (Username, PasswordHash, FullName, Email, Role, SchoolId)
    VALUES ('mark_t', 'admin123', 'Mark Thompson', 'mark.t@school.com', 'teacher', 1);
    
    DECLARE @Uid2 INT = SCOPE_IDENTITY();
    INSERT INTO Teachers (UserId, SchoolId, EmployeeId, Department, Qualification, ContactNumber, Status)
    VALUES (@Uid2, 1, 'TCH-2024-002', 'Science', 'MSc Physics', '+1-555-0102', 'Active');
    PRINT 'Teacher Mark Thompson added.';
END

-- Teacher: Elena Rodriguez
IF NOT EXISTS (SELECT 1 FROM Users WHERE Username = 'elena_t')
BEGIN
    INSERT INTO Users (Username, PasswordHash, FullName, Email, Role, SchoolId)
    VALUES ('elena_t', 'admin123', 'Elena Rodriguez', 'elena.r@school.com', 'teacher', 1);
    
    DECLARE @Uid3 INT = SCOPE_IDENTITY();
    INSERT INTO Teachers (UserId, SchoolId, EmployeeId, Department, Qualification, ContactNumber, Status)
    VALUES (@Uid3, 1, 'TCH-2024-003', 'Languages', 'MA in Linguistics', '+1-555-0103', 'Active');
    PRINT 'Teacher Elena Rodriguez added.';
END

PRINT 'Database update and seeding completed successfully.';
GO
