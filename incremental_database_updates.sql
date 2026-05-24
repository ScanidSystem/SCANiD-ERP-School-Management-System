-- =========================================================================
-- SYSTEM INCREMENTAL UPDATE SCRIPT
-- Purpose: Ensures the presence of SchoolSections, States, and Cities master tables
-- Date: May 23, 2026
-- =========================================================================

-- 1. States table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[States]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[States](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [Name] [nvarchar](100) NOT NULL,
    [IsActive] [bit] NOT NULL CONSTRAINT [DF_States_IsActive] DEFAULT (1),
    [IsDeleted] [bit] NOT NULL CONSTRAINT [DF_States_IsDeleted] DEFAULT (0),
    [CreatedBy] [nvarchar](max) NULL,
    [CreatedOn] [datetime2](7) NOT NULL CONSTRAINT [DF_States_CreatedOn] DEFAULT (GETUTCDATE()),
    [ModifiedBy] [nvarchar](max) NULL,
    [ModifiedOn] [datetime2](7) NOT NULL CONSTRAINT [DF_States_ModifiedOn] DEFAULT (GETUTCDATE()),
 CONSTRAINT [PK_States] PRIMARY KEY CLUSTERED ([Id] ASC)
);

-- Seed Initial States
INSERT INTO [dbo].[States] ([Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn])
VALUES 
(N'MAHARASHTRA', 1, 0, N'SYSTEM', GETUTCDATE(), N'SYSTEM', GETUTCDATE()),
(N'DELHI', 1, 0, N'SYSTEM', GETUTCDATE(), N'SYSTEM', GETUTCDATE()),
(N'KARNATAKA', 1, 0, N'SYSTEM', GETUTCDATE(), N'SYSTEM', GETUTCDATE());
END;
GO

-- 2. Cities table (includes FK safety checks)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Cities]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Cities](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [StateId] [int] NOT NULL,
    [Name] [nvarchar](100) NOT NULL,
    [IsActive] [bit] NOT NULL CONSTRAINT [DF_Cities_IsActive] DEFAULT (1),
    [IsDeleted] [bit] NOT NULL CONSTRAINT [DF_Cities_IsDeleted] DEFAULT (0),
    [CreatedBy] [nvarchar](max) NULL,
    [CreatedOn] [datetime2](7) NOT NULL CONSTRAINT [DF_Cities_CreatedOn] DEFAULT (GETUTCDATE()),
    [ModifiedBy] [nvarchar](max) NULL,
    [ModifiedOn] [datetime2](7) NOT NULL CONSTRAINT [DF_Cities_ModifiedOn] DEFAULT (GETUTCDATE()),
 CONSTRAINT [PK_Cities] PRIMARY KEY CLUSTERED ([Id] ASC),
 CONSTRAINT [FK_Cities_States] FOREIGN KEY([StateId]) REFERENCES [dbo].[States] ([Id])
);

-- Seed Initial Cities
INSERT INTO [dbo].[Cities] ([StateId], [Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn])
VALUES 
(1, N'Mumbai', 1, 0, N'SYSTEM', GETUTCDATE(), N'SYSTEM', GETUTCDATE()),
(1, N'Pune', 1, 0, N'SYSTEM', GETUTCDATE(), N'SYSTEM', GETUTCDATE()),
(2, N'New Delhi', 1, 0, N'SYSTEM', GETUTCDATE(), N'SYSTEM', GETUTCDATE());
END;
GO

-- 3. SchoolSections table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SchoolSections]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[SchoolSections](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [Name] [nvarchar](100) NOT NULL,
    [IsActive] [bit] NOT NULL CONSTRAINT [DF_SchoolSections_IsActive] DEFAULT (1),
    [IsDeleted] [bit] NOT NULL CONSTRAINT [DF_SchoolSections_IsDeleted] DEFAULT (0),
    [CreatedBy] [nvarchar](max) NULL,
    [CreatedOn] [datetime2](7) NOT NULL CONSTRAINT [DF_SchoolSections_CreatedOn] DEFAULT (GETUTCDATE()),
    [ModifiedBy] [nvarchar](max) NULL,
    [ModifiedOn] [datetime2](7) NOT NULL CONSTRAINT [DF_SchoolSections_ModifiedOn] DEFAULT (GETUTCDATE()),
 CONSTRAINT [PK_SchoolSections] PRIMARY KEY CLUSTERED ([Id] ASC)
);

-- Seed Initial School Sections
INSERT INTO [dbo].[SchoolSections] ([Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn])
VALUES 
(N'Primary', 1, 0, N'SYSTEM', GETUTCDATE(), N'SYSTEM', GETUTCDATE()),
(N'Secondary', 1, 0, N'SYSTEM', GETUTCDATE(), N'SYSTEM', GETUTCDATE()),
(N'Higher Secondary', 1, 0, N'SYSTEM', GETUTCDATE(), N'SYSTEM', GETUTCDATE());
END;
GO

-- 4. Add DigitalUniform and DigitalNotebook fields to Students table
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Students]') AND type in (N'U'))
BEGIN
    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Students]') AND name = 'DigitalUniform')
    BEGIN
        ALTER TABLE [dbo].[Students] ADD [DigitalUniform] [bit] NOT NULL CONSTRAINT [DF_Students_DigitalUniform] DEFAULT (0);
    END;

    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Students]') AND name = 'DigitalNotebook')
    BEGIN
        ALTER TABLE [dbo].[Students] ADD [DigitalNotebook] [bit] NOT NULL CONSTRAINT [DF_Students_DigitalNotebook] DEFAULT (0);
    END;
END;
GO

-- 5. Recreate execution wrapper to support Digital features in sp_ManageStudent
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
    @SchoolSectionId INT = NULL,
    @AdmissionDate NVARCHAR(200) = NULL,
    @Email NVARCHAR(255) = NULL,
    @CityId INT = NULL,
    @StateId INT = NULL,
    @IsStateBoard BIT = 0,
    @DigitalUniform BIT = 0,
    @DigitalNotebook BIT = 0
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
                MotherContactNo, ProfilePhotoPath, SchoolSectionId, AdmissionDate, Email, CityId, StateId, IsStateBoard, DigitalUniform, DigitalNotebook, IsActive, IsDeleted, CreatedOn, ModifiedOn
            ) VALUES (
                @RegistrationNumber, @Name, @SchoolId, @StandardId, @SectionId, @AcademicYearId, @RollNumber,
                @GrNo, @Gender, @DateOfBirth, @CategoryId, @ReligionId, @CasteId, @Status, @FatherContactNo, @Address,
                @MotherName, @AadharCard, @Rfid, @ShiftId, @BloodGroupId, @HouseId, @Sms, @UniformId,
                @MotherContactNo, @ProfilePhotoPath, @SchoolSectionId, @AdmissionDate, @Email, @CityId, @StateId, @IsStateBoard, @DigitalUniform, @DigitalNotebook, 1, 0, GETUTCDATE(), GETUTCDATE()
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
                SchoolSectionId = ISNULL(@SchoolSectionId, SchoolSectionId),
                AdmissionDate = ISNULL(@AdmissionDate, AdmissionDate),
                Email = ISNULL(@Email, Email),
                CityId = ISNULL(@CityId, CityId),
                StateId = ISNULL(@StateId, StateId),
                IsStateBoard = ISNULL(@IsStateBoard, IsStateBoard),
                DigitalUniform = ISNULL(@DigitalUniform, DigitalUniform),
                DigitalNotebook = ISNULL(@DigitalNotebook, DigitalNotebook),
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
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

