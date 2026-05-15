/*
  INCREMENTAL DATABASE UPDATE SCRIPT
  Description: Adds missing columns to Teachers and Students tables to match the latest application requirements.
*/

USE ScanID_DB;
GO

-- 1. Updates for Teachers Table
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Teachers]') AND name = N'Experience')
BEGIN
    ALTER TABLE [dbo].[Teachers] ADD [Experience] [nvarchar](100) NULL;
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Teachers]') AND name = N'Subject')
BEGIN
    ALTER TABLE [dbo].[Teachers] ADD [Subject] [nvarchar](200) NULL;
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Teachers]') AND name = N'StandardId')
BEGIN
    ALTER TABLE [dbo].[Teachers] ADD [StandardId] [int] NULL;
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Teachers]') AND name = N'SectionId')
BEGIN
    ALTER TABLE [dbo].[Teachers] ADD [SectionId] [int] NULL;
END

-- Ensure ContactNumber exists (some older versions might have missed it)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Teachers]') AND name = N'ContactNumber')
BEGIN
    ALTER TABLE [dbo].[Teachers] ADD [ContactNumber] [nvarchar](max) NULL;
END

-- 2. Updates for Students Table (Standardizing column names)
-- Instead of renaming (which might break existing scripts), we add the new names if they don't exist
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Students]') AND name = N'FirstName')
BEGIN
    ALTER TABLE [dbo].[Students] ADD [FirstName] [nvarchar](200) NULL;
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Students]') AND name = N'MiddleName')
BEGIN
    ALTER TABLE [dbo].[Students] ADD [MiddleName] [nvarchar](200) NULL;
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Students]') AND name = N'LastName')
BEGIN
    ALTER TABLE [dbo].[Students] ADD [LastName] [nvarchar](200) NULL;
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Students]') AND name = N'DateOfBirth')
BEGIN
    ALTER TABLE [dbo].[Students] ADD [DateOfBirth] [nvarchar](200) NULL;
END

-- Sync legacy data to new columns if they were just added
UPDATE [dbo].[Students] SET [FirstName] = [FNAME] WHERE [FirstName] IS NULL AND [FNAME] IS NOT NULL;
UPDATE [dbo].[Students] SET [MiddleName] = [MNAME] WHERE [MiddleName] IS NULL AND [MNAME] IS NOT NULL;
UPDATE [dbo].[Students] SET [LastName] = [LNAME] WHERE [LastName] IS NULL AND [LNAME] IS NOT NULL;
UPDATE [dbo].[Students] SET [DateOfBirth] = [DOB] WHERE [DateOfBirth] IS NULL AND [DOB] IS NOT NULL;

GO
