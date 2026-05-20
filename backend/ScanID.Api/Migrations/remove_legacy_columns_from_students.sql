-- Incremental update for Students table
-- Removing redundant legacy string-based columns to resolve JSON property collisions and streamline data integrity
-- These are replaced by ID-based master relationships (AcademicYearId, StandardId, SectionId, etc.)

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Students]') AND name = N'academicyear')
BEGIN
    ALTER TABLE [Students] DROP COLUMN [academicyear];
END
GO

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

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Students]') AND name = N'house')
BEGIN
    ALTER TABLE [Students] DROP COLUMN [house];
END
GO

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Students]') AND name = N'subcaste')
BEGIN
    ALTER TABLE [Students] DROP COLUMN [subcaste];
END
GO

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Students]') AND name = N'photo')
BEGIN
    -- Binary photo column is being replaced by physical ProfilePhotoPath
    ALTER TABLE [Students] DROP COLUMN [photo];
END
GO

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Students]') AND name = N'CATEGORY')
BEGIN
    ALTER TABLE [Students] DROP COLUMN [CATEGORY];
END
GO

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Students]') AND name = N'admissiontype')
BEGIN
    ALTER TABLE [Students] DROP COLUMN [admissiontype];
END
GO

-- Add CategoryId column if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Students]') AND name = N'CategoryId')
BEGIN
    ALTER TABLE [Students] ADD [CategoryId] INT NULL;
END
GO

-- Create index for CategoryId
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID(N'[Students]') AND name = N'IX_Students_CategoryId')
BEGIN
    CREATE INDEX [IX_Students_CategoryId] ON [Students] ([CategoryId]);
END
GO

-- Add foreign key for CategoryId
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[Students]') AND name = N'FK_Students_Categories_CategoryId')
BEGIN
    ALTER TABLE [Students] WITH CHECK ADD CONSTRAINT [FK_Students_Categories_CategoryId] FOREIGN KEY([CategoryId])
    REFERENCES [Categories] ([Id]);
END
GO
