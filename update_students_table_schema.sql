-- ==================================================================================
-- Incremental Update Query: Revamp Students Table Schema to Industry Standards & Naming Conventions
-- ==================================================================================

USE [ScanID_DB];
GO

-- 1. Create a migration sequence to safeguard or back up existing student records if needed, then perform column renames of core fields.
-- We use standard SP_RENAME to transform the old column names into polished, standard PascalCase.

-- Rename FNAME -> FirstName
IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('[dbo].[Students]') AND name = 'FNAME')
BEGIN
    EXEC sp_rename 'dbo.Students.FNAME', 'FirstName', 'COLUMN';
END
GO

-- Rename MNAME -> MiddleName
IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('[dbo].[Students]') AND name = 'MNAME')
BEGIN
    EXEC sp_rename 'dbo.Students.MNAME', 'MiddleName', 'COLUMN';
END
GO

-- Rename LNAME -> LastName
IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('[dbo].[Students]') AND name = 'LNAME')
BEGIN
    EXEC sp_rename 'dbo.Students.LNAME', 'LastName', 'COLUMN';
END
GO

-- Rename GRNO -> GrNo
IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('[dbo].[Students]') AND name = 'GRNO')
BEGIN
    EXEC sp_rename 'dbo.Students.GRNO', 'GrNo', 'COLUMN';
END
GO

-- Rename GENDER -> Gender
IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('[dbo].[Students]') AND name = 'GENDER')
BEGIN
    EXEC sp_rename 'dbo.Students.GENDER', 'Gender', 'COLUMN';
END
GO

-- Rename DOB -> DateOfBirth
IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('[dbo].[Students]') AND name = 'DOB')
BEGIN
    EXEC sp_rename 'dbo.Students.DOB', 'DateOfBirth', 'COLUMN';
END
GO

-- Rename ADDRESS -> Address
IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('[dbo].[Students]') AND name = 'ADDRESS')
BEGIN
    EXEC sp_rename 'dbo.Students.ADDRESS', 'Address', 'COLUMN';
END
GO

-- Rename MOTHERNAME -> MotherName
IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('[dbo].[Students]') AND name = 'MOTHERNAME')
BEGIN
    EXEC sp_rename 'dbo.Students.MOTHERNAME', 'MotherName', 'COLUMN';
END
GO

-- Rename aadharcard -> AadharCard
IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('[dbo].[Students]') AND name = 'aadharcard')
BEGIN
    EXEC sp_rename 'dbo.Students.aadharcard', 'AadharCard', 'COLUMN';
END
GO

-- Rename uniformid -> UniformId
IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('[dbo].[Students]') AND name = 'uniformid')
BEGIN
    EXEC sp_rename 'dbo.Students.uniformid', 'UniformId', 'COLUMN';
END
GO

-- Rename RFID -> Rfid
IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('[dbo].[Students]') AND name = 'RFID')
BEGIN
    EXEC sp_rename 'dbo.Students.RFID', 'Rfid', 'COLUMN';
END
GO

-- 2. Migrate MOBILE & contact2 column data safely into FatherContactNo & MotherContactNo, then drop old columns.

-- Add FatherContactNo if it doesn't already exist
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('[dbo].[Students]') AND name = 'FatherContactNo')
BEGIN
    ALTER TABLE [dbo].[Students] ADD [FatherContactNo] NVARCHAR(200) NULL;
END
GO

-- Add MotherContactNo if it doesn't already exist
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('[dbo].[Students]') AND name = 'MotherContactNo')
BEGIN
    ALTER TABLE [dbo].[Students] ADD [MotherContactNo] NVARCHAR(200) NULL;
END
GO

-- Copy existing data to FatherContactNo and MotherContactNo
IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('[dbo].[Students]') AND name = 'MOBILE')
BEGIN
    EXEC('UPDATE [dbo].[Students] SET [FatherContactNo] = [MOBILE] WHERE [FatherContactNo] IS NULL;');
END
IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('[dbo].[Students]') AND name = 'contact2')
BEGIN
    EXEC('UPDATE [dbo].[Students] SET [MotherContactNo] = [contact2] WHERE [MotherContactNo] IS NULL;');
END
GO

-- Safely drop MOBILE
IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('[dbo].[Students]') AND name = 'MOBILE')
BEGIN
    ALTER TABLE [dbo].[Students] DROP COLUMN [MOBILE];
END
GO

-- Safely drop contact2
IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('[dbo].[Students]') AND name = 'contact2')
BEGIN
    ALTER TABLE [dbo].[Students] DROP COLUMN [contact2];
END
GO

-- 3. Modify `sms` column to bit type safely and add `IsStateBoard` column as bit type.

-- For `sms`, if it is NVARCHAR or another type, we want to migrate its contents or drop/re-add as BIT.
-- We can add a temporary column, cast old NVARCHAR value, drop the old column, and rename the new one.
IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('[dbo].[Students]') AND name = 'sms')
BEGIN
    -- Check if it is currently BIT. If not, recreate it.
    DECLARE @UserType NVARCHAR(128) = (
        SELECT t.name FROM sys.columns c 
        JOIN sys.types t ON c.user_type_id = t.user_type_id 
        WHERE c.object_id = OBJECT_ID('[dbo].[Students]') AND c.name = 'sms'
    );
    
    IF @UserType <> 'bit'
    BEGIN
        -- Add temporary Sms_bit column
        ALTER TABLE [dbo].[Students] ADD [Sms_bit] BIT NOT NULL DEFAULT (0);
        EXEC('UPDATE [dbo].[Students] SET [Sms_bit] = CASE WHEN [sms] = ''1'' OR LOWER([sms]) = ''true'' THEN 1 ELSE 0 END;');
        
        -- Drop old sms column
        ALTER TABLE [dbo].[Students] DROP COLUMN [sms];
        
        -- Rename Sms_bit -> Sms
        EXEC sp_rename 'dbo.Students.Sms_bit', 'Sms', 'COLUMN';
    END
END
ELSE
BEGIN
    ALTER TABLE [dbo].[Students] ADD [Sms] BIT NOT NULL DEFAULT (0);
END
GO

-- Ensure Sms column stands with PascalCase
IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('[dbo].[Students]') AND name = 'sms')
BEGIN
    EXEC sp_rename 'dbo.Students.sms', 'Sms', 'COLUMN';
END
GO

-- Add `IsStateBoard` checkbox column
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('[dbo].[Students]') AND name = 'IsStateBoard')
BEGIN
    ALTER TABLE [dbo].[Students] ADD [IsStateBoard] BIT NOT NULL DEFAULT (0);
END
GO


-- 4. Rebuild the stored procedures to speak the updated schema.

-- Rebuild dbo.sp_GetStudents
IF OBJECT_ID('dbo.sp_GetStudents', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_GetStudents;
GO
CREATE PROCEDURE dbo.sp_GetStudents
    @SchoolId INT = NULL,
    @AcademicYearId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SELECT s.*, 
           std.Name AS StandardName, 
           sec.Name AS SectionName, 
           ay.Name AS AcademicYearName,
           c.Name AS CityName,
           st.Name AS StateName
    FROM [dbo].[Students] s
    LEFT JOIN [dbo].[Standards] std ON s.StandardId = std.Id
    LEFT JOIN [dbo].[Sections] sec ON s.SectionId = sec.Id
    LEFT JOIN [dbo].[AcademicYears] ay ON s.AcademicYearId = ay.Id
    LEFT JOIN [dbo].[Cities] c ON s.CityId = c.Id
    LEFT JOIN [dbo].[States] st ON s.StateId = st.Id
    WHERE s.IsDeleted = 0
      AND (@SchoolId IS NULL OR s.SchoolId = @SchoolId)
      AND (@AcademicYearId IS NULL OR s.AcademicYearId = @AcademicYearId);
END;
GO

-- Rebuild dbo.sp_GetStudentById
IF OBJECT_ID('dbo.sp_GetStudentById', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_GetStudentById;
GO
CREATE PROCEDURE dbo.sp_GetStudentById
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT s.*, 
           std.Name AS StandardName, 
           sec.Name AS SectionName, 
           ay.Name AS AcademicYearName,
           c.Name AS CityName,
           st.Name AS StateName
    FROM [dbo].[Students] s
    LEFT JOIN [dbo].[Standards] std ON s.StandardId = std.Id
    LEFT JOIN [dbo].[Sections] sec ON s.SectionId = sec.Id
    LEFT JOIN [dbo].[AcademicYears] ay ON s.AcademicYearId = ay.Id
    LEFT JOIN [dbo].[Cities] c ON s.CityId = c.Id
    LEFT JOIN [dbo].[States] st ON s.StateId = st.Id
    WHERE s.Id = @Id AND s.IsDeleted = 0;
END;
GO

-- Rebuild dbo.sp_GetStudentWithPhotoDetails
IF OBJECT_ID('dbo.sp_GetStudentWithPhotoDetails', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_GetStudentWithPhotoDetails;
GO
CREATE PROCEDURE dbo.sp_GetStudentWithPhotoDetails
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT s.*,
           sc.Name AS SchoolName,
           std.Name AS StandardName, 
           sec.Name AS SectionName
    FROM [dbo].[Students] s
    LEFT JOIN [dbo].[Schools] sc ON s.SchoolId = sc.Id
    LEFT JOIN [dbo].[Standards] std ON s.StandardId = std.Id
    LEFT JOIN [dbo].[Sections] sec ON s.SectionId = sec.Id
    WHERE s.Id = @Id AND s.IsDeleted = 0;
END;
GO

-- Rebuild dbo.sp_GetStudentsForExport
IF OBJECT_ID('dbo.sp_GetStudentsForExport', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_GetStudentsForExport;
GO
CREATE PROCEDURE dbo.sp_GetStudentsForExport
    @SchoolId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SELECT s.*,
           std.Name AS StandardName, 
           sec.Name AS SectionName, 
           ay.Name AS AcademicYearName,
           c.Name AS CasteName,
           r.Name AS ReligionName,
           cat.Name AS CategoryName,
           bg.Name AS BloodGroupName,
           h.Name AS HouseName,
           sh.Name AS ShiftName
    FROM [dbo].[Students] s
    LEFT JOIN [dbo].[Standards] std ON s.StandardId = std.Id
    LEFT JOIN [dbo].[Sections] sec ON s.SectionId = sec.Id
    LEFT JOIN [dbo].[AcademicYears] ay ON s.AcademicYearId = ay.Id
    LEFT JOIN [dbo].[Castes] c     ON s.CasteId = c.Id
    LEFT JOIN [dbo].[Religions] r  ON s.ReligionId = r.Id
    LEFT JOIN [dbo].[Categories] cat ON s.CategoryId = cat.Id
    LEFT JOIN [dbo].[BloodGroups] bg ON s.BloodGroupId = bg.Id
    LEFT JOIN [dbo].[Houses] h     ON s.HouseId = h.Id
    LEFT JOIN [dbo].[Shifts] sh    ON s.ShiftId = sh.Id
    WHERE s.IsDeleted = 0
      AND (@SchoolId IS NULL OR s.SchoolId = @SchoolId);
END;
GO

-- Rebuild dbo.sp_ManageStudent
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
    @GrNo NVARCHAR(100) = NULL,
    @Gender NVARCHAR(50) = NULL,
    @DateOfBirth NVARCHAR(50) = NULL,
    @CategoryId INT = NULL,
    @ReligionId INT = NULL,
    @CasteId INT = NULL,
    @Status NVARCHAR(50) = NULL,
    @FatherContactNo NVARCHAR(200) = NULL,
    @Address NVARCHAR(500) = NULL,
    @MotherName NVARCHAR(100) = NULL,
    @AadharCard NVARCHAR(100) = NULL,
    @Rfid NVARCHAR(100) = NULL,
    @ShiftId INT = NULL,
    @BloodGroupId INT = NULL,
    @HouseId INT = NULL,
    @Sms BIT = 0,
    @UniformId NVARCHAR(500) = NULL,
    @MotherContactNo NVARCHAR(200) = NULL,
    @ProfilePhotoPath NVARCHAR(255) = NULL,
    @SchoolSection NVARCHAR(100) = NULL,
    @AdmissionDate NVARCHAR(200) = NULL,
    @Email NVARCHAR(255) = NULL,
    @CityId INT = NULL,
    @StateId INT = NULL,
    @IsStateBoard BIT = 0
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

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
                GrNo, Gender, DateOfBirth, CategoryId, ReligionId, CasteId, Status, FatherContactNo, Address, 
                MotherName, AadharCard, Rfid, ShiftId, BloodGroupId, HouseId, Sms, UniformId,
                MotherContactNo, ProfilePhotoPath, SchoolSection, AdmissionDate, Email, CityId, StateId, IsStateBoard, IsActive, IsDeleted, CreatedOn, ModifiedOn
            ) VALUES (
                @RegistrationNumber, @Name, @SchoolId, @StandardId, @SectionId, @AcademicYearId, @RollNumber,
                @GrNo, @Gender, @DateOfBirth, @CategoryId, @ReligionId, @CasteId, @Status, @FatherContactNo, @Address,
                @MotherName, @AadharCard, @Rfid, @ShiftId, @BloodGroupId, @HouseId, @Sms, @UniformId,
                @MotherContactNo, @ProfilePhotoPath, @SchoolSection, @AdmissionDate, @Email, @CityId, @StateId, @IsStateBoard, 1, 0, GETUTCDATE(), GETUTCDATE()
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
                GrNo = ISNULL(@GrNo, GrNo),
                Gender = ISNULL(@Gender, Gender),
                DateOfBirth = ISNULL(@DateOfBirth, DateOfBirth),
                CategoryId = ISNULL(@CategoryId, CategoryId),
                ReligionId = ISNULL(@ReligionId, ReligionId),
                CasteId = ISNULL(@CasteId, CasteId),
                Status = ISNULL(@Status, Status),
                FatherContactNo = ISNULL(@FatherContactNo, FatherContactNo),
                Address = ISNULL(@Address, Address),
                MotherName = ISNULL(@MotherName, MotherName),
                AadharCard = ISNULL(@AadharCard, AadharCard),
                Rfid = ISNULL(@Rfid, Rfid),
                ShiftId = ISNULL(@ShiftId, ShiftId),
                BloodGroupId = ISNULL(@BloodGroupId, BloodGroupId),
                HouseId = ISNULL(@HouseId, HouseId),
                Sms = ISNULL(@Sms, Sms),
                UniformId = ISNULL(@UniformId, UniformId),
                MotherContactNo = ISNULL(@MotherContactNo, MotherContactNo),
                ProfilePhotoPath = ISNULL(@ProfilePhotoPath, ProfilePhotoPath),
                SchoolSection = ISNULL(@SchoolSection, SchoolSection),
                AdmissionDate = ISNULL(@AdmissionDate, AdmissionDate),
                Email = ISNULL(@Email, Email),
                CityId = ISNULL(@CityId, CityId),
                StateId = ISNULL(@StateId, StateId),
                IsStateBoard = ISNULL(@IsStateBoard, IsStateBoard),
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
        END
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO
