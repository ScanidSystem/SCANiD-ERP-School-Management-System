USE ScanID_DB;
GO

-- Remove legacy columns from Students table if they exist
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Students]') AND name = N'STD')
BEGIN
    ALTER TABLE [Students] DROP COLUMN [STD];
END
GO

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Students]') AND name = N'DIV')
BEGIN
    ALTER TABLE [Students] DROP COLUMN [DIV];
END
GO

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Students]') AND name = N'ROLLNO')
BEGIN
    ALTER TABLE [Students] DROP COLUMN [ROLLNO];
END
GO

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Students]') AND name = N'BLOODGROUP')
BEGIN
    ALTER TABLE [Students] DROP COLUMN [BLOODGROUP];
END
GO

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Students]') AND name = N'CASTE')
BEGIN
    ALTER TABLE [Students] DROP COLUMN [CASTE];
END
GO

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Students]') AND name = N'RELIGION')
BEGIN
    ALTER TABLE [Students] DROP COLUMN [RELIGION];
END
GO

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Students]') AND name = N'CATEGORY')
BEGIN
    ALTER TABLE [Students] DROP COLUMN [CATEGORY];
END
GO

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Students]') AND name = N'CITY')
BEGIN
    ALTER TABLE [Students] DROP COLUMN [CITY];
END
GO

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Students]') AND name = N'STATE')
BEGIN
    ALTER TABLE [Students] DROP COLUMN [STATE];
END
GO

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Students]') AND name = N'SHIFTNAME')
BEGIN
    ALTER TABLE [Students] DROP COLUMN [SHIFTNAME];
END
GO

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Students]') AND name = N'subcaste')
BEGIN
    ALTER TABLE [Students] DROP COLUMN [subcaste];
END
GO

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Students]') AND name = N'photo')
BEGIN
    ALTER TABLE [Students] DROP COLUMN [photo];
END
GO

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Students]') AND name = N'admissiontype')
BEGIN
    ALTER TABLE [Students] DROP COLUMN [admissiontype];
END
GO

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Students]') AND name = N'academicyear')
BEGIN
    ALTER TABLE [Students] DROP COLUMN [academicyear];
END
GO

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Students]') AND name = N'stdstudying')
BEGIN
    ALTER TABLE [Students] DROP COLUMN [stdstudying];
END
GO

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Students]') AND name = N'house')
BEGIN
    ALTER TABLE [Students] DROP COLUMN [house];
END
GO

-- Add CategoryId link
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Students]') AND name = N'CategoryId')
BEGIN
    ALTER TABLE [Students] ADD [CategoryId] INT NULL;
END
GO

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Students_Categories')
BEGIN
    ALTER TABLE [Students] ADD CONSTRAINT [FK_Students_Categories] FOREIGN KEY([CategoryId]) REFERENCES [Categories] ([Id]);
END
GO
