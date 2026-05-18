-- Incremental update for Teacher photos
-- This adds the necessary column to track physical file paths for employee identification
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Teachers]') AND name = N'ProfilePhotoPath')
BEGIN
    ALTER TABLE [Teachers] ADD [ProfilePhotoPath] NVARCHAR(MAX) NULL;
END
GO
