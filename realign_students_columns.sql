-- =========================================================================
-- RE-ALIGN STUDENTS TABLE COLUMNS AND AUDIT TRAIL FIELDS
-- Description:
--   Moves [OptedForBus] immediately after [DigitalNotebook] and ensures
--   all Audit Trail columns ([IsActive], [IsDeleted], [CreatedBy], [CreatedOn],
--   [ModifiedBy], [ModifiedOn]) are placed at the very end of the Students table.
--   Safely recreates the table, copies data, restores all FK indexes,
--   and rebuilds the [sp_ManageStudent] stored procedure.
-- =========================================================================

BEGIN TRANSACTION;
BEGIN TRY

    PRINT 'Dropping external foreign key constraints referencing Students...';

    -- Drop constraints of other tables pointing to Students
    IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Attendance_Students_StudentId')
        ALTER TABLE [dbo].[Attendance] DROP CONSTRAINT [FK_Attendance_Students_StudentId];

    IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Fees_Students_StudentId')
        ALTER TABLE [dbo].[Fees] DROP CONSTRAINT [FK_Fees_Students_StudentId];

    IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Marks_Students_StudentId')
        ALTER TABLE [dbo].[Marks] DROP CONSTRAINT [FK_Marks_Students_StudentId];

    PRINT 'Dropping Students table internal constraints...';

    -- Drop internal student table constraints
    IF OBJECT_ID('dbo.sp_ManageStudent', 'P') IS NOT NULL 
        DROP PROCEDURE dbo.sp_ManageStudent;

    IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Students_Schools_SchoolId')
        ALTER TABLE [dbo].[Students] DROP CONSTRAINT [FK_Students_Schools_SchoolId];

    IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Students_Standards')
        ALTER TABLE [dbo].[Students] DROP CONSTRAINT [FK_Students_Standards];

    IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Students_Sections')
        ALTER TABLE [dbo].[Students] DROP CONSTRAINT [FK_Students_Sections];

    IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Students_AcademicYears')
        ALTER TABLE [dbo].[Students] DROP CONSTRAINT [FK_Students_AcademicYears];

    IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Students_Castes')
        ALTER TABLE [dbo].[Students] DROP CONSTRAINT [FK_Students_Castes];

    IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Students_SubCastes')
        ALTER TABLE [dbo].[Students] DROP CONSTRAINT [FK_Students_SubCastes];

    IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Students_Religions')
        ALTER TABLE [dbo].[Students] DROP CONSTRAINT [FK_Students_Religions];

    IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Students_BloodGroups')
        ALTER TABLE [dbo].[Students] DROP CONSTRAINT [FK_Students_BloodGroups];

    IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Students_Houses')
        ALTER TABLE [dbo].[Students] DROP CONSTRAINT [FK_Students_Houses];

    IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Students_AdmissionTypes')
        ALTER TABLE [dbo].[Students] DROP CONSTRAINT [FK_Students_AdmissionTypes];

    IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Students_Cities')
        ALTER TABLE [dbo].[Students] DROP CONSTRAINT [FK_Students_Cities];

    IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Students_States')
        ALTER TABLE [dbo].[Students] DROP CONSTRAINT [FK_Students_States];

    IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Students_Categories')
        ALTER TABLE [dbo].[Students] DROP CONSTRAINT [FK_Students_Categories];

    IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Students_SchoolSections')
        ALTER TABLE [dbo].[Students] DROP CONSTRAINT [FK_Students_SchoolSections];

    -- Drop indexes
    IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Students_School_Academics_Filters' AND object_id = OBJECT_ID('dbo.Students'))
        DROP INDEX [IX_Students_School_Academics_Filters] ON [dbo].[Students];

    IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Students_Name_Search' AND object_id = OBJECT_ID('dbo.Students'))
        DROP INDEX [IX_Students_Name_Search] ON [dbo].[Students];

    PRINT 'Creating new Students table layout...';

    -- Create new Students table with correct column order (OptedForBus after DigitalNotebook, and Audit trails at the end)
    CREATE TABLE [dbo].[Students_New](
        [Id] [int] IDENTITY(1,1) NOT NULL,
        [Name] [nvarchar](255) NOT NULL,
        [SchoolId] [int] NOT NULL,
        [Status] [nvarchar](50) NOT NULL DEFAULT (N'Active'),
        [RollNumber] [int] NOT NULL,
        [GrNo] [nvarchar](100) NULL,
        [FirstName] [nvarchar](200) NULL,
        [MiddleName] [nvarchar](200) NULL,
        [LastName] [nvarchar](200) NULL,
        [Gender] [nvarchar](10) NULL,
        [DateOfBirth] [nvarchar](200) NULL,
        [Address] [nvarchar](500) NULL,
        [MotherName] [nvarchar](200) NULL,
        [FatherContactNo] [nvarchar](200) NULL,
        [MotherContactNo] [nvarchar](200) NULL,
        [AadharCard] [nvarchar](100) NULL,
        [UniformId] [nvarchar](500) NULL,
        [Rfid] [nvarchar](100) NULL,
        [SchoolSectionId] [int] NULL,
        [AdmissionDate] [nvarchar](200) NULL,
        [Email] [nvarchar](255) NULL,
        [StandardId] [int] NULL,
        [SectionId] [int] NULL,
        [AcademicYearId] [int] NULL,
        [CasteId] [int] NULL,
        [SubCasteId] [int] NULL,
        [ReligionId] [int] NULL,
        [BloodGroupId] [int] NULL,
        [HouseId] [int] NULL,
        [AdmissionTypeId] [int] NULL,
        [CityId] [int] NULL,
        [StateId] [int] NULL,
        [ShiftId] [int] NULL,
        [CategoryId] [int] NULL,
        [Sms] [bit] NOT NULL DEFAULT ((0)),
        [IsStateBoard] [bit] NOT NULL DEFAULT ((0)),
        [ProfilePhotoPath] [nvarchar](500) NULL,
        [DigitalUniform] [bit] NOT NULL DEFAULT ((0)),
        [DigitalNotebook] [bit] NOT NULL DEFAULT ((0)),
        [OptedForBus] [bit] NOT NULL DEFAULT ((0)),
        [IsActive] [bit] NOT NULL DEFAULT ((1)),
        [IsDeleted] [bit] NOT NULL DEFAULT ((0)),
        [CreatedBy] [nvarchar](max) NULL,
        [CreatedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
        [ModifiedBy] [nvarchar](max) NULL,
        [ModifiedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
     CONSTRAINT [PK_Students_New] PRIMARY KEY CLUSTERED ([Id] ASC)
    );

    PRINT 'Copying data...';

    -- Copy data from original Students table to the temporary one
    SET IDENTITY_INSERT [dbo].[Students_New] ON;
    
    INSERT INTO [dbo].[Students_New] (
        [Id], [Name], [SchoolId], [Status], [RollNumber], [GrNo], [FirstName], [MiddleName], [LastName],
        [Gender], [DateOfBirth], [Address], [MotherName], [FatherContactNo], [MotherContactNo], [AadharCard],
        [UniformId], [Rfid], [SchoolSectionId], [AdmissionDate], [Email], [StandardId], [SectionId], [AcademicYearId],
        [CasteId], [SubCasteId], [ReligionId], [BloodGroupId], [HouseId], [AdmissionTypeId], [CityId], [StateId],
        [ShiftId], [CategoryId], [Sms], [IsStateBoard], [ProfilePhotoPath], [DigitalUniform], [DigitalNotebook],
        [OptedForBus], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]
    )
    SELECT 
        [Id], [Name], [SchoolId], [Status], [RollNumber], [GrNo], [FirstName], [MiddleName], [LastName],
        [Gender], [DateOfBirth], [Address], [MotherName], [FatherContactNo], [MotherContactNo], [AadharCard],
        [UniformId], [Rfid], [SchoolSectionId], [AdmissionDate], [Email], [StandardId], [SectionId], [AcademicYearId],
        [CasteId], [SubCasteId], [ReligionId], [BloodGroupId], [HouseId], [AdmissionTypeId], [CityId], [StateId],
        [ShiftId], [CategoryId], [Sms], [IsStateBoard], [ProfilePhotoPath], [DigitalUniform], [DigitalNotebook],
        ISNULL([OptedForBus], 0), [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]
    FROM [dbo].[Students];

    SET IDENTITY_INSERT [dbo].[Students_New] OFF;

    PRINT 'Replacing old table with new aligned table...';

    -- Drop original table [dbo].[Students]
    DROP TABLE [dbo].[Students];

    -- Rename the [Students_New] table to [Students]
    EXEC sp_rename 'dbo.Students_New', 'Students';

    -- Add Primary Key naming back to PK_Students
    EXEC sp_rename 'dbo.PK_Students_New', 'PK_Students', 'OBJECT';

    PRINT 'Recreating Students internal foreign keys...';

    -- Recreate and add all foreign key constraints
    ALTER TABLE [dbo].[Students] ADD CONSTRAINT [FK_Students_Schools_SchoolId] FOREIGN KEY([SchoolId]) REFERENCES [dbo].[Schools] ([Id]) ON DELETE CASCADE;
    ALTER TABLE [dbo].[Students] ADD CONSTRAINT [FK_Students_Standards] FOREIGN KEY([StandardId]) REFERENCES [dbo].[Standards] ([Id]);
    ALTER TABLE [dbo].[Students] ADD CONSTRAINT [FK_Students_Sections] FOREIGN KEY([SectionId]) REFERENCES [dbo].[Sections] ([Id]);
    ALTER TABLE [dbo].[Students] ADD CONSTRAINT [FK_Students_AcademicYears] FOREIGN KEY([AcademicYearId]) REFERENCES [dbo].[AcademicYears] ([Id]);
    ALTER TABLE [dbo].[Students] ADD CONSTRAINT [FK_Students_Castes] FOREIGN KEY([CasteId]) REFERENCES [dbo].[Castes] ([Id]);
    ALTER TABLE [dbo].[Students] ADD CONSTRAINT [FK_Students_SubCastes] FOREIGN KEY([SubCasteId]) REFERENCES [dbo].[SubCastes] ([Id]);
    ALTER TABLE [dbo].[Students] ADD CONSTRAINT [FK_Students_Religions] FOREIGN KEY([ReligionId]) REFERENCES [dbo].[Religions] ([Id]);
    ALTER TABLE [dbo].[Students] ADD CONSTRAINT [FK_Students_BloodGroups] FOREIGN KEY([BloodGroupId]) REFERENCES [dbo].[BloodGroups] ([Id]);
    ALTER TABLE [dbo].[Students] ADD CONSTRAINT [FK_Students_Houses] FOREIGN KEY([HouseId]) REFERENCES [dbo].[Houses] ([Id]);
    ALTER TABLE [dbo].[Students] ADD CONSTRAINT [FK_Students_AdmissionTypes] FOREIGN KEY([AdmissionTypeId]) REFERENCES [dbo].[AdmissionTypes] ([Id]);
    ALTER TABLE [dbo].[Students] ADD CONSTRAINT [FK_Students_Cities] FOREIGN KEY([CityId]) REFERENCES [dbo].[Cities] ([Id]);
    ALTER TABLE [dbo].[Students] ADD CONSTRAINT [FK_Students_States] FOREIGN KEY([StateId]) REFERENCES [dbo].[States] ([Id]);
    ALTER TABLE [dbo].[Students] ADD CONSTRAINT [FK_Students_Categories] FOREIGN KEY([CategoryId]) REFERENCES [dbo].[Categories] ([Id]);
    ALTER TABLE [dbo].[Students] ADD CONSTRAINT [FK_Students_SchoolSections] FOREIGN KEY([SchoolSectionId]) REFERENCES [dbo].[SchoolSections] ([Id]);

    PRINT 'Recreating indexes...';

    -- Re-create NONCLUSTERED Indexes
    CREATE NONCLUSTERED INDEX [IX_Students_School_Academics_Filters] 
    ON [dbo].[Students] ([SchoolId], [AcademicYearId], [StandardId], [SectionId], [IsDeleted])
    INCLUDE ([Id], [Name], [RollNumber], [GrNo]);

    CREATE NONCLUSTERED INDEX [IX_Students_Name_Search] 
    ON [dbo].[Students] ([GrNo], [RollNumber])
    INCLUDE ([Name]);

    PRINT 'Recreating external foreign key constraints pointing to Students...';

    -- Re-establish external relationships
    ALTER TABLE [dbo].[Attendance] ADD CONSTRAINT [FK_Attendance_Students_StudentId] FOREIGN KEY([StudentId]) REFERENCES [dbo].[Students] ([Id]) ON DELETE CASCADE;
    ALTER TABLE [dbo].[Fees] ADD CONSTRAINT [FK_Fees_Students_StudentId] FOREIGN KEY([StudentId]) REFERENCES [dbo].[Students] ([Id]) ON DELETE CASCADE;
    ALTER TABLE [dbo].[Marks] ADD CONSTRAINT [FK_Marks_Students_StudentId] FOREIGN KEY([StudentId]) REFERENCES [dbo].[Students] ([Id]) ON DELETE CASCADE;

    COMMIT TRANSACTION;
    PRINT 'SUCCESS: Table [dbo].[Students] columns realigned correctly and all relationships restored!';

END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;

    DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
    RAISERROR(@ErrMsg, 16, 1);
END CATCH;
GO

-- 11. Recreate sp_ManageStudent Stored Procedure
IF OBJECT_ID('dbo.sp_ManageStudent', 'P') IS NOT NULL 
    DROP PROCEDURE dbo.sp_ManageStudent;
GO

CREATE PROCEDURE dbo.sp_ManageStudent
    @Action NVARCHAR(10), -- 'INSERT', 'UPDATE', 'DELETE', 'PHOTO'
    @Id INT = NULL,
    @Name NVARCHAR(100) = NULL,
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
    @DateOfBirth NVARCHAR(50) = NULL,
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
    @AdmissionDate NVARCHAR(200) = NULL,
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
    SET XACT_ABORT ON;

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
                Name = @Name,
                FirstName = @FirstName,
                MiddleName = @MiddleName,
                LastName = @LastName,
                SchoolId = @SchoolId,
                StandardId = @StandardId,
                SectionId = @SectionId,
                AcademicYearId = @AcademicYearId,
                RollNumber = @RollNumber,
                GrNo = @GrNo,
                Gender = @Gender,
                DateOfBirth = @DateOfBirth,
                CategoryId = @CategoryId,
                ReligionId = @ReligionId,
                CasteId = @CasteId,
                SubCasteId = @SubCasteId,                
                Status = @Status,
                FatherContactNo = @FatherContactNo,
                Address = @Address,
                MotherName = @MotherName,
                AadharCard = @AadharCard,
                Rfid = @Rfid,
                ShiftId = @ShiftId,
                BloodGroupId = @BloodGroupId,
                HouseId = @HouseId,
                AdmissionTypeId = @AdmissionTypeId,
                Sms = @Sms,
                UniformId = @UniformId,
                MotherContactNo = @MotherContactNo,
                ProfilePhotoPath = @ProfilePhotoPath,
                SchoolSectionId = @SchoolSectionId,
                AdmissionDate = @AdmissionDate,
                Email = @Email,
                CityId = @CityId,
                StateId = @StateId,
                IsStateBoard = @IsStateBoard,
                DigitalUniform = @DigitalUniform,
                DigitalNotebook = @DigitalNotebook,
                OptedForBus = @OptedForBus,
                ModifiedOn = GETUTCDATE()
            WHERE Id = @Id;
        END
        ELSE IF @Action = 'DELETE'
        BEGIN
            SET NOCOUNT OFF;
            UPDATE [dbo].[Students] SET IsDeleted = 1, IsActive = 0, ModifiedOn = GETUTCDATE() WHERE Id = @Id;
            SET NOCOUNT ON;
        END
        ELSE IF @Action = 'PHOTO'
        BEGIN
            UPDATE [dbo].[Students] SET ProfilePhotoPath = @ProfilePhotoPath, ModifiedOn = GETUTCDATE() WHERE Id = @Id;
        END

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO
