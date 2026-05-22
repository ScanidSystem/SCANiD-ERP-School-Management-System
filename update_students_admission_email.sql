-- ==================================================================================
-- Incremental Update Query: Add Admissions, SchoolSection, Email, and Location Columns
-- to Students table and update sp_ManageStudent stored procedure to support them.
-- ==================================================================================

-- 1. Add columns to [dbo].[Students] table if they do not exist
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Students]') AND name = N'SchoolSection')
    ALTER TABLE [dbo].[Students] ADD [SchoolSection] [nvarchar](100) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Students]') AND name = N'AdmissionDate')
    ALTER TABLE [dbo].[Students] ADD [AdmissionDate] [nvarchar](200) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Students]') AND name = N'Email')
    ALTER TABLE [dbo].[Students] ADD [Email] [nvarchar](255) NULL;
GO

-- 2. Fully parameterize and recreate sp_ManageStudent stored procedure to securely map new properties
IF OBJECT_ID('dbo.sp_ManageStudent', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_ManageStudent;
GO

CREATE PROCEDURE dbo.sp_ManageStudent
    @Action NVARCHAR(10), -- 'INSERT', 'UPDATE', 'DELETE', 'PHOTO'
    @Id INT = NULL,
    @RegistrationNumber NVARCHAR(100) = NULL,
    @Name NVARCHAR(100) = NULL,
    @SchoolId INT = NULL,
    @StandardId INT = NULL,
    @SectionId INT = NULL,
    @AcademicYearId INT = NULL,
    @RollNumber INT = NULL,
    @GRNO NVARCHAR(100) = NULL,
    @GENDER NVARCHAR(50) = NULL,
    @DOB NVARCHAR(50) = NULL,
    @CategoryId INT = NULL,
    @ReligionId INT = NULL,
    @CasteId INT = NULL,
    @Status NVARCHAR(50) = NULL,
    @MOBILE NVARCHAR(50) = NULL,
    @ADDRESS NVARCHAR(500) = NULL,
    @MOTHERNAME NVARCHAR(100) = NULL,
    @aadharcard NVARCHAR(100) = NULL,
    @RFID NVARCHAR(100) = NULL,
    @ShiftId INT = NULL,
    @BloodGroupId INT = NULL,
    @HouseId INT = NULL,
    @sms NVARCHAR(10) = NULL,
    @uniformid NVARCHAR(500) = NULL,
    @contact2 NVARCHAR(255) = NULL,
    @ProfilePhotoPath NVARCHAR(255) = NULL,
    @SchoolSection NVARCHAR(100) = NULL,
    @AdmissionDate NVARCHAR(200) = NULL,
    @Email NVARCHAR(255) = NULL,
    @CityId INT = NULL,
    @StateId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON; -- Ensures instant rollback on any fatal SQL runtime errors

    BEGIN TRY
        BEGIN TRANSACTION;

        IF @Action = 'INSERT'
        BEGIN
            IF @RegistrationNumber IS NULL
            BEGIN
                SET @RegistrationNumber = 'REG-' + UPPER(LEFT(REPLACE(CAST(NEWID() as NVARCHAR(36)), '-', ''), 8));
            END

            INSERT INTO [dbo].[Students] (
                RegistrationNumber, Name, SchoolId, StandardId, SectionId, AcademicYearId, RollNumber, 
                GRNO, GENDER, DOB, CategoryId, ReligionId, CasteId, Status, MOBILE, ADDRESS, 
                MOTHERNAME, aadharcard, RFID, ShiftId, BloodGroupId, HouseId, sms, uniformid,
                contact2, ProfilePhotoPath, SchoolSection, AdmissionDate, Email, CityId, StateId, IsActive, IsDeleted, CreatedOn, ModifiedOn
            ) VALUES (
                @RegistrationNumber, @Name, @SchoolId, @StandardId, @SectionId, @AcademicYearId, @RollNumber,
                @GRNO, @GENDER, @DOB, @CategoryId, @ReligionId, @CasteId, @Status, @MOBILE, @ADDRESS,
                @MOTHERNAME, @aadharcard, @RFID, @ShiftId, @BloodGroupId, @HouseId, @sms, @uniformid,
                @contact2, @ProfilePhotoPath, @SchoolSection, @AdmissionDate, @Email, @CityId, @StateId, 1, 0, GETUTCDATE(), GETUTCDATE()
            );
            SELECT SCOPE_IDENTITY();
        END
        ELSE IF @Action = 'UPDATE'
        BEGIN
            UPDATE [dbo].[Students] SET
                RegistrationNumber = ISNULL(@RegistrationNumber, RegistrationNumber),
                Name = ISNULL(@Name, Name),
                SchoolId = ISNULL(@SchoolId, SchoolId),
                StandardId = ISNULL(@StandardId, StandardId),
                SectionId = ISNULL(@SectionId, SectionId),
                AcademicYearId = ISNULL(@AcademicYearId, AcademicYearId),
                RollNumber = ISNULL(@RollNumber, RollNumber),
                GRNO = ISNULL(@GRNO, GRNO),
                GENDER = ISNULL(@GENDER, GENDER),
                DOB = ISNULL(@DOB, DOB),
                CategoryId = ISNULL(@CategoryId, CategoryId),
                ReligionId = ISNULL(@ReligionId, ReligionId),
                CasteId = ISNULL(@CasteId, CasteId),
                Status = ISNULL(@Status, Status),
                MOBILE = ISNULL(@MOBILE, MOBILE),
                ADDRESS = ISNULL(@ADDRESS, ADDRESS),
                MOTHERNAME = ISNULL(@MOTHERNAME, MOTHERNAME),
                aadharcard = ISNULL(@aadharcard, aadharcard),
                RFID = ISNULL(@RFID, RFID),
                ShiftId = ISNULL(@ShiftId, ShiftId),
                BloodGroupId = ISNULL(@BloodGroupId, BloodGroupId),
                HouseId = ISNULL(@HouseId, HouseId),
                sms = ISNULL(@sms, sms),
                uniformid = ISNULL(@uniformid, uniformid),
                contact2 = ISNULL(@contact2, contact2),
                ProfilePhotoPath = ISNULL(@ProfilePhotoPath, ProfilePhotoPath),
                SchoolSection = ISNULL(@SchoolSection, SchoolSection),
                AdmissionDate = ISNULL(@AdmissionDate, AdmissionDate),
                Email = ISNULL(@Email, Email),
                CityId = ISNULL(@CityId, CityId),
                StateId = ISNULL(@StateId, StateId),
                ModifiedOn = GETUTCDATE()
            WHERE Id = @Id;
        END
        ELSE IF @Action = 'DELETE'
        BEGIN
            UPDATE [dbo].[Students] SET IsDeleted = 1, IsActive = 0, ModifiedOn = GETUTCDATE() WHERE Id = @Id;
        END
        ELSE IF @Action = 'PHOTO'
        BEGIN
            UPDATE [dbo].[Students] SET ProfilePhotoPath = @ProfilePhotoPath, ModifiedOn = GETUTCDATE() WHERE Id = @Id;
        END

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
        BEGIN
            ROLLBACK TRANSACTION;
        END;

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO
