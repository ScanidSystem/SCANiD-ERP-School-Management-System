-- =================================================================================
-- INCREMENTAL DATABASE UPDATE: Convert Students Date Columns to DATETIME Type
-- =================================================================================

-- 1. Safe ALTER of [DateOfBirth] to [datetime] inside [dbo].[Students]
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Students]') AND name = N'DateOfBirth')
BEGIN
    PRINT 'Converting [DateOfBirth] in [dbo].[Students] to DATETIME datatype...';
    ALTER TABLE [dbo].[Students] ALTER COLUMN [DateOfBirth] DATETIME NULL;
END
GO

-- 2. Safe ALTER of [AdmissionDate] to [datetime] inside [dbo].[Students]
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Students]') AND name = N'AdmissionDate')
BEGIN
    PRINT 'Converting [AdmissionDate] in [dbo].[Students] to DATETIME datatype...';
    ALTER TABLE [dbo].[Students] ALTER COLUMN [AdmissionDate] DATETIME NULL;
END
GO

-- 3. Recreate [dbo].[sp_ManageStudent] with DATETIME parameter mappings
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_ManageStudent]') AND type in (N'P', N'PC'))
BEGIN
    DROP PROCEDURE [dbo].[sp_ManageStudent];
END
GO

CREATE PROCEDURE [dbo].[sp_ManageStudent]
    @Action NVARCHAR(50),
    @Id INT = NULL,
    @RegistrationNumber NVARCHAR(100) = NULL,
    @Name NVARCHAR(255) = NULL,
    @FirstName NVARCHAR(100) = NULL,
    @MiddleName NVARCHAR(100) = NULL,
    @LastName NVARCHAR(100) = NULL,
    @SchoolId INT = NULL,
    @StandardId INT = NULL,
    @SectionId INT = NULL,
    @AcademicYearId INT = NULL,
    @RollNumber INT = NULL,
    @GrNo NVARCHAR(100) = NULL,
    @Gender NVARCHAR(50) = NULL,
    @DateOfBirth DATETIME = NULL,
    @CategoryId INT = NULL,
    @ReligionId INT = NULL,
    @CasteId INT = NULL,
    @SubCasteId INT = NULL,
    @Status NVARCHAR(50) = NULL,
    @FatherContactNo NVARCHAR(200) = NULL,
    @Address NVARCHAR(500) = NULL,
    @MotherName NVARCHAR(100) = NULL,
    @AadharCard NVARCHAR(100) = NULL,
    @Rfid NVARCHAR(100) = NULL,
    @ShiftId INT = NULL,
    @BloodGroupId INT = NULL,
    @HouseId INT = NULL,
    @AdmissionTypeId INT = NULL,
    @Sms BIT = 0,
    @UniformId NVARCHAR(500) = NULL,
    @MotherContactNo NVARCHAR(200) = NULL,
    @ProfilePhotoPath NVARCHAR(255) = NULL,
    @SchoolSectionId INT = NULL,
    @AdmissionDate DATETIME = NULL,
    @Email NVARCHAR(255) = NULL,
    @CityId INT = NULL,
    @StateId INT = NULL,
    @IsStateBoard BIT = 0,
    @DigitalUniform BIT = 0,
    @DigitalNotebook BIT = 0,
    @OptedForBus BIT = 0
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON; -- Ensures instant rollback on any fatal SQL runtime errors

    BEGIN TRY
        BEGIN TRANSACTION;

        IF @Action = 'INSERT'
        BEGIN
            INSERT INTO [dbo].[Students] (
                Name, FirstName, MiddleName, LastName, SchoolId, StandardId, SectionId, AcademicYearId, RollNumber, 
                GrNo, Gender, DateOfBirth, CategoryId, ReligionId, CasteId, SubCasteId, Status, FatherContactNo, Address, 
                MotherName, AadharCard, Rfid, ShiftId, BloodGroupId, HouseId, AdmissionTypeId, Sms, UniformId,
                MotherContactNo, ProfilePhotoPath, SchoolSectionId, AdmissionDate, Email, CityId, StateId, IsStateBoard, DigitalUniform, DigitalNotebook, OptedForBus, IsActive, IsDeleted, CreatedOn, ModifiedOn
            ) VALUES (
                @Name, @FirstName, @MiddleName, @LastName, @SchoolId, @StandardId, @SectionId, @AcademicYearId, @RollNumber,
                @GrNo, @Gender, @DateOfBirth, @CategoryId, @ReligionId, @CasteId, @SubCasteId, @Status, @FatherContactNo, @Address,
                @MotherName, @AadharCard, @Rfid, @ShiftId, @BloodGroupId, @HouseId, @AdmissionTypeId, @Sms, @UniformId,
                @MotherContactNo, @ProfilePhotoPath, @SchoolSectionId, @AdmissionDate, @Email, @CityId, @StateId, @IsStateBoard, @DigitalUniform, @DigitalNotebook, @OptedForBus, 1, 0, GETUTCDATE(), GETUTCDATE()
            );
            SELECT SCOPE_IDENTITY();
        END
        ELSE IF @Action = 'UPDATE'
        BEGIN
            UPDATE [dbo].[Students] SET
                Name = ISNULL(@Name, Name),
                FirstName = ISNULL(@FirstName, FirstName),
                MiddleName = ISNULL(@MiddleName, MiddleName),
                LastName = ISNULL(@LastName, LastName),
                SchoolId = @SchoolId,
                StandardId = @StandardId,
                SectionId = @SectionId,
                AcademicYearId = @AcademicYearId,
                RollNumber = ISNULL(@RollNumber, RollNumber),
                GrNo = ISNULL(@GrNo, GrNo),
                Gender = ISNULL(@Gender, Gender),
                DateOfBirth = ISNULL(@DateOfBirth, DateOfBirth),
                CategoryId = @CategoryId,
                ReligionId = @ReligionId,
                CasteId = @CasteId,
                SubCasteId = @SubCasteId,                
                Status = ISNULL(@Status, Status),
                FatherContactNo = ISNULL(@FatherContactNo, FatherContactNo),
                Address = ISNULL(@Address, Address),
                MotherName = ISNULL(@MotherName, MotherName),
                AadharCard = ISNULL(@AadharCard, AadharCard),
                Rfid = ISNULL(@Rfid, Rfid),
                ShiftId = @ShiftId,
                BloodGroupId = @BloodGroupId,
                HouseId = @HouseId,
                AdmissionTypeId = @AdmissionTypeId,
                Sms = ISNULL(@Sms, Sms),
                UniformId = ISNULL(@UniformId, UniformId),
                MotherContactNo = ISNULL(@MotherContactNo, MotherContactNo),
                ProfilePhotoPath = ISNULL(@ProfilePhotoPath, ProfilePhotoPath),
                SchoolSectionId = @SchoolSectionId,
                AdmissionDate = ISNULL(@AdmissionDate, AdmissionDate),
                Email = ISNULL(@Email, Email),
                CityId = @CityId,
                StateId = @StateId,
                IsStateBoard = ISNULL(@IsStateBoard, IsStateBoard),
                DigitalUniform = ISNULL(@DigitalUniform, DigitalUniform),
                DigitalNotebook = ISNULL(@DigitalNotebook, DigitalNotebook),
                OptedForBus = ISNULL(@OptedForBus, OptedForBus),
                ModifiedOn = GETUTCDATE()
            WHERE Id = @Id;
        END
        ELSE IF @Action = 'DELETE'
        BEGIN
            UPDATE [dbo].[Students] SET IsDeleted = 1, IsActive = 0, ModifiedOn = GETUTCDATE() WHERE Id = @Id;
        END

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
        BEGIN
            ROLLBACK TRANSACTION;
        END
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END
GO
