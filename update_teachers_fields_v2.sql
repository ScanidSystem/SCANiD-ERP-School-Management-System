-- ==================================================================================
-- INCREMENTAL DATABASE UPDATE SCRIPT (v2)
-- Description: Adds custom Experience, Subject, StandardId, and SectionId columns to Teachers
--              table and redeploys the sp_ManageTeacher stored procedure to support all attributes
--              and fix Add/Update errors globally.
-- Date: May 27, 2026
-- ==================================================================================

USE ScanID_DB;
GO

-- 1. Ensure Teachers table contains the requested custom columns
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Teachers]') AND type in (N'U'))
BEGIN
    PRINT 'Verifying and adding missing custom columns to Teachers table...';

    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Teachers]') AND name = N'Experience')
    BEGIN
        ALTER TABLE [dbo].[Teachers] ADD [Experience] [nvarchar](100) NULL;
        PRINT 'Column [Experience] successfully added.';
    END

    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Teachers]') AND name = N'Subject')
    BEGIN
        ALTER TABLE [dbo].[Teachers] ADD [Subject] [nvarchar](200) NULL;
        PRINT 'Column [Subject] successfully added.';
    END

    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Teachers]') AND name = N'StandardId')
    BEGIN
        ALTER TABLE [dbo].[Teachers] ADD [StandardId] [int] NULL;
        PRINT 'Column [StandardId] successfully added.';
    END

    IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Teachers]') AND name = N'SectionId')
    BEGIN
        ALTER TABLE [dbo].[Teachers] ADD [SectionId] [int] NULL;
        PRINT 'Column [SectionId] successfully added.';
    END

    -- Ensure EmployeeId column supports a default value constraint to protect against unexpected null values
    IF NOT EXISTS (SELECT * FROM sys.default_constraints WHERE parent_object_id = OBJECT_ID(N'[dbo].[Teachers]') AND col_name(parent_object_id, parent_column_id) = 'EmployeeId')
    BEGIN
        ALTER TABLE [dbo].[Teachers] ADD CONSTRAINT [DF_Teachers_EmployeeId] DEFAULT ('') FOR [EmployeeId];
        PRINT 'Default constraint successfully added to [EmployeeId].';
    END
END
ELSE
BEGIN
    PRINT 'Error: Teachers table does not exist in the database.';
END
GO

-- 2. Redeploy sp_ManageTeacher to securely support all parameters & fix INSERT / UPDATE errors
PRINT 'Redeploying dbo.sp_ManageTeacher stored procedure...';
GO

IF OBJECT_ID('dbo.sp_ManageTeacher', 'P') IS NOT NULL 
    DROP PROCEDURE dbo.sp_ManageTeacher;
GO

CREATE PROCEDURE dbo.sp_ManageTeacher
    @Action NVARCHAR(10), -- 'INSERT', 'UPDATE', 'DELETE'
    @Id INT = NULL,
    @UserId INT = NULL,
    @ContactNumber NVARCHAR(50) = NULL,
    @Department NVARCHAR(100) = NULL,
    @Qualification NVARCHAR(100) = NULL,
    @Status NVARCHAR(50) = NULL,
    @SchoolId INT = NULL,
    @ProfilePhotoPath NVARCHAR(255) = NULL,
    @EmployeeId NVARCHAR(255) = NULL,
    @Experience NVARCHAR(100) = NULL,
    @Subject NVARCHAR(200) = NULL,
    @StandardId INT = NULL,
    @SectionId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON; -- Instantly rolls back on any fatal SQL runtime errors

    BEGIN TRY
        BEGIN TRANSACTION;

        IF @Action = 'INSERT'
        BEGIN
            -- Fallback generation for EmployeeId if omitted or NULL
            DECLARE @EmpId NVARCHAR(255) = ISNULL(@EmployeeId, '');
            IF @EmpId = ''
            BEGIN
                SET @EmpId = 'EMP-' + CAST((CAST(RAND() * 1000000 AS INT)) AS NVARCHAR(10)) + '-' + REPLACE(STR(DAY(GETUTCDATE()), 2), ' ', '0');
            END

            INSERT INTO [dbo].[Teachers] (
                UserId, SchoolId, EmployeeId, ContactNumber, Department, Qualification, Status, ProfilePhotoPath, Experience, Subject, StandardId, SectionId, IsActive, IsDeleted, CreatedOn, ModifiedOn
            ) VALUES (
                @UserId, ISNULL(@SchoolId, 1), @EmpId, @ContactNumber, @Department, @Qualification, @Status, @ProfilePhotoPath, @Experience, @Subject, @StandardId, @SectionId, 1, 0, GETUTCDATE(), GETUTCDATE()
            );
            SELECT SCOPE_IDENTITY();
        END
        ELSE IF @Action = 'UPDATE'
        BEGIN
            -- Ensure UserId is NEVER set to NULL, 0, or invalid references during professional profiles updates
            UPDATE [dbo].[Teachers] SET
                UserId = CASE WHEN @UserId IS NULL OR @UserId <= 0 THEN UserId ELSE @UserId END,
                ContactNumber = ISNULL(@ContactNumber, ContactNumber),
                Department = ISNULL(@Department, Department),
                Qualification = ISNULL(@Qualification, Qualification),
                Status = ISNULL(@Status, Status),
                SchoolId = ISNULL(@SchoolId, SchoolId),
                ProfilePhotoPath = ISNULL(@ProfilePhotoPath, ProfilePhotoPath),
                EmployeeId = CASE WHEN @EmployeeId IS NULL OR @EmployeeId = '' THEN EmployeeId ELSE @EmployeeId END,
                Experience = ISNULL(@Experience, Experience),
                Subject = ISNULL(@Subject, Subject),
                StandardId = ISNULL(@StandardId, StandardId),
                SectionId = ISNULL(@SectionId, SectionId),
                ModifiedOn = GETUTCDATE()
            WHERE Id = @Id;
        END
        ELSE IF @Action = 'DELETE'
        BEGIN
            UPDATE [dbo].[Teachers] SET IsDeleted = 1, IsActive = 0, ModifiedOn = GETUTCDATE() WHERE Id = @Id;
            DECLARE @LinkedUserId INT;
            SELECT @LinkedUserId = UserId FROM [dbo].[Teachers] WHERE Id = @Id;
            IF @LinkedUserId IS NOT NULL
            BEGIN
                UPDATE [dbo].[Users] SET IsDeleted = 1, ModifiedOn = GETUTCDATE() WHERE Id = @LinkedUserId;
            END
        END

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

PRINT 'dbo.sp_ManageTeacher redeployed successfully.';
GO
