-- Final cross-consistency name fixing script
USE ScanID_DB;
GO

-- Rename FullName to Name in Users table
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND name = 'FullName')
BEGIN
    EXEC sp_rename 'dbo.Users.FullName', 'Name', 'COLUMN';
END
GO

-- Rename FullName to Name in Students table
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Students]') AND name = 'FullName')
BEGIN
    EXEC sp_rename 'dbo.Students.FullName', 'Name', 'COLUMN';
END
GO
