-- ==================================================================================
-- Incremental Update Query: Drop legacy columns from [dbo].[Students] table and
-- recreate the sp_ManageStudent stored procedure to support the streamlined schema.
-- ==================================================================================

-- 1. Drop unnecessary columns from Students table if they exist
DECLARE @drop_sql NVARCHAR(MAX) = '';

SELECT @drop_sql += 'ALTER TABLE [dbo].[Students] DROP COLUMN [' + COLUMN_NAME + ']; '
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Students' AND TABLE_SCHEMA = 'dbo'
AND COLUMN_NAME IN (
    'STUDENTID', 'PIN', 'FATHERNAME', 'EMAIL', 'DOA', 'CARDID', 'VALIDFROM', 'VALIDTO', 
    'saralid', 'bankname', 'bankacc', 'cid', 'fingerid', 'freeshiptype', 'otp', 
    'subjects', 'placeofbirth', 'birthtaluka', 'birthdistrict', 'birthstate', 
    'birthcountry', 'mothertongue', 'Nationality', 'Lastschool', 'Progress', 
    'DateofLeaving', 'Reasonforleaving', 'LCNo', 'conduct', 'remark', 'dobwords', 
    'admissionstd', 'accountname', 'IQLD', 'schoolsection', 'leftstatus', 
    'feesinstallment', 'stdstudyingInWords', 'EntryDate', 'PEN_No', 'apaar_id',
    'FirstName', 'MiddleName', 'LastName', 'DateOfBirth', 'ispromoted'
);

IF @drop_sql <> ''
BEGIN
    EXEC sp_executesql @drop_sql;
    PRINT 'Cleaned students schema: dropped legacy/unused columns.';
END
ELSE
BEGIN
    PRINT 'Cleaned students schema: no legacy/unused columns found to drop.';
END
GO

-- 2. Ensure active columns exist (sms, uniformid, contact2)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Students]') AND name = N'sms')
    ALTER TABLE [dbo].[Students] ADD [sms] [nvarchar](10) NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Students]') AND name = N'uniformid')
    ALTER TABLE [dbo].[Students] ADD [uniformid] [nvarchar](500) NULL;
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Students]') AND name = N'contact2')
    ALTER TABLE [dbo].[Students] ADD [contact2] [nvarchar](255) NULL;
GO

-- 3. Recreate the sp_ManageStudent stored procedure with our pruned parameter layout and robust transaction handling
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
    @ProfilePhotoPath NVARCHAR(255) = NULL
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
                contact2, ProfilePhotoPath, IsActive, IsDeleted, CreatedOn, ModifiedOn
            ) VALUES (
                @RegistrationNumber, @Name, @SchoolId, @StandardId, @SectionId, @AcademicYearId, @RollNumber,
                @GRNO, @GENDER, @DOB, @CategoryId, @ReligionId, @CasteId, @Status, @MOBILE, @ADDRESS,
                @MOTHERNAME, @aadharcard, @RFID, @ShiftId, @BloodGroupId, @HouseId, @sms, @uniformid,
                @contact2, @ProfilePhotoPath, 1, 0, GETUTCDATE(), GETUTCDATE()
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

        -- Reraise database errors back safely to EF Core logic
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO
