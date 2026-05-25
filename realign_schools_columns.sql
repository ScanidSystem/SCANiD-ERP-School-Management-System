-- ==================================================================================
-- Incremental Update Script: Aligns school table audit columns to the absolute end.
-- Author: SCANiD Database Sync Engine
-- Date: 2026-05-25
-- Description: Drops foreign keys on the Schools table, renames the existing table,
--              re-creates the Schools table with audit columns at the absolute end,
--              migrates the records with Identity Insert enabled to preserve IDs,
--              and restores all referencing foreign key constraints.
-- ==================================================================================

BEGIN TRANSACTION;

BEGIN TRY
    PRINT 'Starting database realignment for [dbo].[Schools]...';

    -- -----------------------------------------------------------------------------
    -- 1. DROP REFERENCING FOREIGN KEYS
    -- -----------------------------------------------------------------------------
    PRINT 'Dropping referencing foreign key constraints...';
    
    IF OBJECT_ID('dbo.FK_Users_Schools_SchoolId', 'F') IS NOT NULL
    BEGIN
        ALTER TABLE [dbo].[Users] DROP CONSTRAINT [FK_Users_Schools_SchoolId];
        PRINT 'dropped: FK_Users_Schools_SchoolId';
    END

    IF OBJECT_ID('dbo.FK_Teachers_Schools_SchoolId', 'F') IS NOT NULL
    BEGIN
        ALTER TABLE [dbo].[Teachers] DROP CONSTRAINT [FK_Teachers_Schools_SchoolId];
        PRINT 'dropped: FK_Teachers_Schools_SchoolId';
    END

    IF OBJECT_ID('dbo.FK_Students_Schools_SchoolId', 'F') IS NOT NULL
    BEGIN
        ALTER TABLE [dbo].[Students] DROP CONSTRAINT [FK_Students_Schools_SchoolId];
        PRINT 'dropped: FK_Students_Schools_SchoolId';
    END

    -- -----------------------------------------------------------------------------
    -- 2. RENAME ORIGINAL TABLE TO TEMPORARY
    -- -----------------------------------------------------------------------------
    PRINT 'Renaming existing [dbo].[Schools] to [dbo].[Schools_Temp]...';
    
    IF OBJECT_ID('dbo.Schools', 'U') IS NOT NULL
    BEGIN
        EXEC sp_rename 'dbo.Schools', 'Schools_Temp';
        PRINT 'Renamed [dbo].[Schools] to [dbo].[Schools_Temp].';
    END
    ELSE
    BEGIN
        -- If Schools table does not exist, throw exception to abort transaction safely
        THROW 50001, 'Error: The target table [dbo].[Schools] does not exist!', 1;
    END

    -- -----------------------------------------------------------------------------
    -- 3. CREATE NEW ALIGNED TABLE STRUCTURE WITH AUDIT COLUMNS AT ABSOLUTE END
    -- -----------------------------------------------------------------------------
    PRINT 'Creating new aligned [dbo].[Schools] table...';
    
    CREATE TABLE [dbo].[Schools](
        [Id] [int] IDENTITY(1,1) NOT NULL,
        [Name] [nvarchar](max) NOT NULL,
        [Code] [nvarchar](max) NULL,
        [Address] [nvarchar](max) NULL,
        [Email] [nvarchar](max) NULL,
        [Phone] [nvarchar](max) NULL,
        [TotalStudents] [int] NOT NULL CONSTRAINT [DF_Schools_TotalStudents] DEFAULT (0),
        [ProfilePhotoPath] [nvarchar](max) NULL,
        [Status] [nvarchar](max) NOT NULL CONSTRAINT [DF_Schools_Status] DEFAULT (N'Active'),
        
        -- Legacy custom systems parameters
        [ShortName] [nvarchar](100) NULL,
        [CityId] [int] NULL,
        [StateId] [int] NULL,
        [Pincode] [nvarchar](100) NULL,
        [SMSLimit] [int] NULL,
        [TotalSMSSent] [int] NULL,
        [SMSBalance] [int] NULL,
        [EnableSMS] [bit] NULL,
        [EnablePresenteeSMS] [bit] NULL,
        [AutomaticBirthdaySMS] [bit] NULL,
        [EnableWhatsapp] [bit] NULL,
        [WebsiteUrl] [nvarchar](500) NULL,
        [SMSSenderID] [nvarchar](100) NULL,
        [BusNumbers] [nvarchar](max) NULL,
        [SCANiDContact] [nvarchar](100) NULL,
        [SCANiDEmail] [nvarchar](255) NULL,
        [InChargeContact] [nvarchar](100) NULL,
        
        -- Auditing parameters aligned strictly to the absolute end of the table
        [IsActive] [bit] NOT NULL CONSTRAINT [DF_Schools_IsActive] DEFAULT (1),
        [IsDeleted] [bit] NOT NULL CONSTRAINT [DF_Schools_IsDeleted] DEFAULT (0),
        [CreatedBy] [nvarchar](max) NULL,
        [CreatedOn] [datetime2](7) NOT NULL CONSTRAINT [DF_Schools_CreatedOn] DEFAULT (GETUTCDATE()),
        [ModifiedBy] [nvarchar](max) NULL,
        [ModifiedOn] [datetime2](7) NOT NULL CONSTRAINT [DF_Schools_ModifiedOn] DEFAULT (GETUTCDATE()),
        
        CONSTRAINT [PK_Schools] PRIMARY KEY CLUSTERED ([Id] ASC)
    );
    PRINT 'Table [dbo].[Schools] recreated successfully with aligned columns.';

    -- -----------------------------------------------------------------------------
    -- 4. COPY HISTORICAL RECORDS PRESERVING ORIGINAL IDENTITY KEYS
    -- -----------------------------------------------------------------------------
    PRINT 'Migrating data from [dbo].[Schools_Temp] to [dbo].[Schools]...';
    
    -- Enable Identity Insert to preserve the exact same auto-increment ID keys
    SET IDENTITY_INSERT [dbo].[Schools] ON;

    INSERT INTO [dbo].[Schools] (
        Id, Name, Code, Address, Email, Phone, TotalStudents, ProfilePhotoPath, Status,
        ShortName, CityId, StateId, Pincode, SMSLimit, TotalSMSSent, SMSBalance, EnableSMS,
        EnablePresenteeSMS, AutomaticBirthdaySMS, EnableWhatsapp, WebsiteUrl, SMSSenderID, BusNumbers,
        SCANiDContact, SCANiDEmail, InChargeContact,
        IsActive, IsDeleted, CreatedBy, CreatedOn, ModifiedBy, ModifiedOn
    )
    SELECT 
        Id, Name, Code, Address, Email, Phone, ISNULL(TotalStudents, 0), ProfilePhotoPath, ISNULL(Status, 'Active'),
        ShortName, CityId, StateId, Pincode, SMSLimit, TotalSMSSent, SMSBalance, EnableSMS,
        EnablePresenteeSMS, AutomaticBirthdaySMS, EnableWhatsapp, WebsiteUrl, SMSSenderID, BusNumbers,
        SCANiDContact, SCANiDEmail, InChargeContact,
        ISNULL(IsActive, 1), ISNULL(IsDeleted, 0), CreatedBy, ISNULL(CreatedOn, GETUTCDATE()), ModifiedBy, ISNULL(ModifiedOn, GETUTCDATE())
    FROM [dbo].[Schools_Temp];

    -- Turn Identity Insert off once the sync is completed
    SET IDENTITY_INSERT [dbo].[Schools] OFF;
    PRINT 'Data migration completed successfully.';

    -- -----------------------------------------------------------------------------
    -- 5. RE-ESTABLISH THE FOREIGN KEYS
    -- -----------------------------------------------------------------------------
    PRINT 'Restoring foreign key constraints targeting [dbo].[Schools]...';

    ALTER TABLE [dbo].[Users] WITH CHECK ADD CONSTRAINT [FK_Users_Schools_SchoolId] 
        FOREIGN KEY([SchoolId]) REFERENCES [dbo].[Schools] ([Id]);
    PRINT 'restored: FK_Users_Schools_SchoolId';

    ALTER TABLE [dbo].[Teachers] WITH CHECK ADD CONSTRAINT [FK_Teachers_Schools_SchoolId] 
        FOREIGN KEY([SchoolId]) REFERENCES [dbo].[Schools] ([Id]);
    PRINT 'restored: FK_Teachers_Schools_SchoolId';

    ALTER TABLE [dbo].[Students] WITH CHECK ADD CONSTRAINT [FK_Students_Schools_SchoolId] 
        FOREIGN KEY([SchoolId]) REFERENCES [dbo].[Schools] ([Id]) ON DELETE CASCADE;
    PRINT 'restored: FK_Students_Schools_SchoolId';

    -- -----------------------------------------------------------------------------
    -- 6. REMOVE OLD TEMPORARY RECORDS DEFINITIVELY
    -- -----------------------------------------------------------------------------
    PRINT 'Cleaning up temporary table...';
    IF OBJECT_ID('dbo.Schools_Temp', 'U') IS NOT NULL
    BEGIN
        DROP TABLE [dbo].[Schools_Temp];
        PRINT 'dropped: [dbo].[Schools_Temp]';
    END

    -- Confirm transaction on successful operations block
    COMMIT TRANSACTION;
    PRINT 'TRANSACTION COMMITTED: The alignment has succeeded perfectly.';

END TRY
BEGIN CATCH
    -- Rollback everything on failure
    IF @@TRANCOUNT > 0
    BEGIN
        ROLLBACK TRANSACTION;
        PRINT 'TRANSACTION ROLLED BACK: Error occurred during execution. Changes reverted.';
    END

    -- Error details
    DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
    DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
    DECLARE @ErrorState INT = ERROR_STATE();

    RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
END CATCH;
GO
