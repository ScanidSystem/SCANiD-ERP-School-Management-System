-- ==================================================================================
-- Incremental Update Query: Add Legacy School Information Fields to Schools table
-- and recreate sp_GetSchools and sp_ManageSchool stored procedures.
-- ==================================================================================

-- 1. Add columns to [dbo].[Schools] table if they do not exist
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Schools]') AND name = N'ShortName')
    ALTER TABLE [dbo].[Schools] ADD [ShortName] [nvarchar](100) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Schools]') AND name = N'CityId')
    ALTER TABLE [dbo].[Schools] ADD [CityId] [int] NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Schools]') AND name = N'StateId')
    ALTER TABLE [dbo].[Schools] ADD [StateId] [int] NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Schools]') AND name = N'Pincode')
    ALTER TABLE [dbo].[Schools] ADD [Pincode] [nvarchar](100) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Schools]') AND name = N'SMSLimit')
    ALTER TABLE [dbo].[Schools] ADD [SMSLimit] [int] NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Schools]') AND name = N'TotalSMSSent')
    ALTER TABLE [dbo].[Schools] ADD [TotalSMSSent] [int] NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Schools]') AND name = N'SMSBalance')
    ALTER TABLE [dbo].[Schools] ADD [SMSBalance] [int] NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Schools]') AND name = N'EnableSMS')
    ALTER TABLE [dbo].[Schools] ADD [EnableSMS] [bit] NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Schools]') AND name = N'EnablePresenteeSMS')
    ALTER TABLE [dbo].[Schools] ADD [EnablePresenteeSMS] [bit] NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Schools]') AND name = N'AutomaticBirthdaySMS')
    ALTER TABLE [dbo].[Schools] ADD [AutomaticBirthdaySMS] [bit] NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Schools]') AND name = N'EnableWhatsapp')
    ALTER TABLE [dbo].[Schools] ADD [EnableWhatsapp] [bit] NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Schools]') AND name = N'WebsiteUrl')
    ALTER TABLE [dbo].[Schools] ADD [WebsiteUrl] [nvarchar](500) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Schools]') AND name = N'SMSSenderID')
    ALTER TABLE [dbo].[Schools] ADD [SMSSenderID] [nvarchar](100) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Schools]') AND name = N'BusNumbers')
    ALTER TABLE [dbo].[Schools] ADD [BusNumbers] [nvarchar](max) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Schools]') AND name = N'SCANiDContact')
    ALTER TABLE [dbo].[Schools] ADD [SCANiDContact] [nvarchar](100) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Schools]') AND name = N'SCANiDEmail')
    ALTER TABLE [dbo].[Schools] ADD [SCANiDEmail] [nvarchar](255) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Schools]') AND name = N'InChargeContact')
    ALTER TABLE [dbo].[Schools] ADD [InChargeContact] [nvarchar](100) NULL;
GO

-- 2. Fully parameterize and recreate sp_GetSchools stored procedure
IF OBJECT_ID('dbo.sp_GetSchools', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_GetSchools;
GO
CREATE PROCEDURE dbo.sp_GetSchools
AS
BEGIN
    SET NOCOUNT ON;
    SELECT s.*, 
           c.Name AS CityName, 
           st.Name AS StateName
    FROM [dbo].[Schools] s
    LEFT JOIN [dbo].[Cities] c ON s.CityId = c.Id
    LEFT JOIN [dbo].[States] st ON s.StateId = st.Id
    WHERE s.IsDeleted = 0;
END;
GO

-- 3. Fully parameterize and recreate sp_ManageSchool stored procedure
IF OBJECT_ID('dbo.sp_ManageSchool', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_ManageSchool;
GO
CREATE PROCEDURE dbo.sp_ManageSchool
    @Action NVARCHAR(10), -- 'INSERT', 'UPDATE', 'DELETE'
    @Id INT = NULL,
    @Name NVARCHAR(100) = NULL,
    @LogoPath NVARCHAR(255) = NULL,
    @Address NVARCHAR(255) = NULL,
    @ContactNumber NVARCHAR(50) = NULL,
    @Email NVARCHAR(100) = NULL,
    @CreatedBy NVARCHAR(100) = NULL,
    @ShortName NVARCHAR(100) = NULL,
    @CityId INT = NULL,
    @StateId INT = NULL,
    @Pincode NVARCHAR(100) = NULL,
    @SMSLimit INT = NULL,
    @TotalSMSSent INT = NULL,
    @SMSBalance INT = NULL,
    @EnableSMS BIT = NULL,
    @EnablePresenteeSMS BIT = NULL,
    @AutomaticBirthdaySMS BIT = NULL,
    @EnableWhatsapp BIT = NULL,
    @WebsiteUrl NVARCHAR(500) = NULL,
    @SMSSenderID NVARCHAR(100) = NULL,
    @BusNumbers NVARCHAR(MAX) = NULL,
    @SCANiDContact NVARCHAR(100) = NULL,
    @SCANiDEmail NVARCHAR(255) = NULL,
    @InChargeContact NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    IF @Action = 'INSERT'
    BEGIN
        INSERT INTO [dbo].[Schools] (
            Name, ProfilePhotoPath, Address, Phone, Email,
            ShortName, CityId, StateId, Pincode, SMSLimit, TotalSMSSent, SMSBalance, EnableSMS,
            EnablePresenteeSMS, AutomaticBirthdaySMS, EnableWhatsapp, WebsiteUrl, SMSSenderID, BusNumbers,
            SCANiDContact, SCANiDEmail, InChargeContact,
            IsActive, IsDeleted, CreatedOn, ModifiedOn, CreatedBy
        ) VALUES (
            @Name, @LogoPath, @Address, @ContactNumber, @Email,
            @ShortName, @CityId, @StateId, @Pincode, @SMSLimit, @TotalSMSSent, @SMSBalance, @EnableSMS,
            @EnablePresenteeSMS, @AutomaticBirthdaySMS, @EnableWhatsapp, @WebsiteUrl, @SMSSenderID, @BusNumbers,
            @SCANiDContact, @SCANiDEmail, @InChargeContact,
            1, 0, GETUTCDATE(), GETUTCDATE(), @CreatedBy
        );
        SELECT SCOPE_IDENTITY();
    END
    ELSE IF @Action = 'UPDATE'
    BEGIN
        UPDATE [dbo].[Schools] SET
            Name = ISNULL(@Name, Name),
            ProfilePhotoPath = ISNULL(@LogoPath, ProfilePhotoPath),
            Address = ISNULL(@Address, Address),
            Phone = ISNULL(@ContactNumber, Phone),
            Email = ISNULL(@Email, Email),
            ShortName = ISNULL(@ShortName, ShortName),
            CityId = ISNULL(@CityId, CityId),
            StateId = ISNULL(@StateId, StateId),
            Pincode = ISNULL(@Pincode, Pincode),
            SMSLimit = ISNULL(@SMSLimit, SMSLimit),
            TotalSMSSent = ISNULL(@TotalSMSSent, TotalSMSSent),
            SMSBalance = ISNULL(@SMSBalance, SMSBalance),
            EnableSMS = ISNULL(@EnableSMS, EnableSMS),
            EnablePresenteeSMS = ISNULL(@EnablePresenteeSMS, EnablePresenteeSMS),
            AutomaticBirthdaySMS = ISNULL(@AutomaticBirthdaySMS, AutomaticBirthdaySMS),
            EnableWhatsapp = ISNULL(@EnableWhatsapp, EnableWhatsapp),
            WebsiteUrl = ISNULL(@WebsiteUrl, WebsiteUrl),
            SMSSenderID = ISNULL(@SMSSenderID, SMSSenderID),
            BusNumbers = ISNULL(@BusNumbers, BusNumbers),
            SCANiDContact = ISNULL(@SCANiDContact, SCANiDContact),
            SCANiDEmail = ISNULL(@SCANiDEmail, SCANiDEmail),
            InChargeContact = ISNULL(@InChargeContact, InChargeContact),
            ModifiedOn = GETUTCDATE()
        WHERE Id = @Id;
    END
    ELSE IF @Action = 'DELETE'
    BEGIN
        UPDATE [dbo].[Schools] SET IsDeleted = 1, IsActive = 0, ModifiedOn = GETUTCDATE() WHERE Id = @Id;
    END
END;
GO
