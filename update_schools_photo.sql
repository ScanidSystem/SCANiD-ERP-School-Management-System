USE ScanID_DB;
GO

-- Add ProfilePhotoPath to Schools table if it doesn't already exist
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Schools]') AND name = N'ProfilePhotoPath')
BEGIN
    ALTER TABLE [dbo].[Schools] ADD [ProfilePhotoPath] [nvarchar](max) NULL;
END
GO
