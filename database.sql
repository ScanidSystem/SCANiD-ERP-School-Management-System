IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'ScanID_DB')
BEGIN
  CREATE DATABASE ScanID_DB;
END
GO

USE ScanID_DB;
GO

-- 1. Infrastructure Tables
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[AuditLogs]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[AuditLogs](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [nvarchar](max) NULL,
	[Type] [nvarchar](max) NULL,
	[TableName] [nvarchar](max) NULL,
	[DateTime] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
	[OldValues] [nvarchar](max) NULL,
	[NewValues] [nvarchar](max) NULL,
	[AffectedColumns] [nvarchar](max) NULL,
	[PrimaryKey] [nvarchar](max) NULL,
 CONSTRAINT [PK_AuditLogs] PRIMARY KEY CLUSTERED ([Id] ASC)
)
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ErrorLogs]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[ErrorLogs](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Message] [nvarchar](max) NULL,
	[Level] [nvarchar](max) NULL,
	[Timestamp] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
	[Exception] [nvarchar](max) NULL,
	[Properties] [nvarchar](max) NULL,
 CONSTRAINT [PK_ErrorLogs] PRIMARY KEY CLUSTERED ([Id] ASC)
)
END
GO

-- 2. Master Tables (Independent)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Roles]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Roles](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [Name] [nvarchar](100) NOT NULL,
    [Description] [nvarchar](255) NULL,
    [IsActive] [bit] NOT NULL DEFAULT (1),
    [IsDeleted] [bit] NOT NULL DEFAULT (0),
    [CreatedBy] [nvarchar](max) NULL,
    [CreatedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
    [ModifiedBy] [nvarchar](max) NULL,
    [ModifiedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
 CONSTRAINT [PK_Roles] PRIMARY KEY CLUSTERED ([Id] ASC)
)
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Standards]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Standards](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
    [Description] [nvarchar](255) NULL,
    [IsActive] [bit] NOT NULL DEFAULT (1),
    [IsDeleted] [bit] NOT NULL DEFAULT (0),
    [CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
    [ModifiedBy] [nvarchar](max) NULL,
    [ModifiedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
 CONSTRAINT [PK_Standards] PRIMARY KEY CLUSTERED ([Id] ASC)
)
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Sections]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Sections](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
    [Description] [nvarchar](255) NULL,
    [IsActive] [bit] NOT NULL DEFAULT (1),
    [IsDeleted] [bit] NOT NULL DEFAULT (0),
    [CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
    [ModifiedBy] [nvarchar](max) NULL,
    [ModifiedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
 CONSTRAINT [PK_Sections] PRIMARY KEY CLUSTERED ([Id] ASC)
)
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[AcademicYears]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[AcademicYears](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [Name] [nvarchar](50) NOT NULL,
    [IsCurrent] [bit] NOT NULL DEFAULT (0),
    [IsActive] [bit] NOT NULL DEFAULT (1),
    [IsDeleted] [bit] NOT NULL DEFAULT (0),
    [CreatedBy] [nvarchar](max) NULL,
    [CreatedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
    [ModifiedBy] [nvarchar](max) NULL,
    [ModifiedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
 CONSTRAINT [PK_AcademicYears] PRIMARY KEY CLUSTERED ([Id] ASC)
)
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Castes]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Castes](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [Name] [nvarchar](100) NOT NULL,
    [IsActive] [bit] NOT NULL DEFAULT (1),
    [IsDeleted] [bit] NOT NULL DEFAULT (0),
    [CreatedBy] [nvarchar](max) NULL,
    [CreatedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
    [ModifiedBy] [nvarchar](max) NULL,
    [ModifiedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
 CONSTRAINT [PK_Castes] PRIMARY KEY CLUSTERED ([Id] ASC)
)
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Religions]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Religions](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [Name] [nvarchar](100) NOT NULL,
    [IsActive] [bit] NOT NULL DEFAULT (1),
    [IsDeleted] [bit] NOT NULL DEFAULT (0),
    [CreatedBy] [nvarchar](max) NULL,
    [CreatedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
    [ModifiedBy] [nvarchar](max) NULL,
    [ModifiedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
 CONSTRAINT [PK_Religions] PRIMARY KEY CLUSTERED ([Id] ASC)
)
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[States]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[States](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [Name] [nvarchar](100) NOT NULL,
    [IsActive] [bit] NOT NULL DEFAULT (1),
    [IsDeleted] [bit] NOT NULL DEFAULT (0),
    [CreatedBy] [nvarchar](max) NULL,
    [CreatedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
    [ModifiedBy] [nvarchar](max) NULL,
    [ModifiedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
 CONSTRAINT [PK_States] PRIMARY KEY CLUSTERED ([Id] ASC)
)
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[BloodGroups]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[BloodGroups](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [Name] [nvarchar](20) NOT NULL,
    [IsActive] [bit] NOT NULL DEFAULT (1),
    [IsDeleted] [bit] NOT NULL DEFAULT (0),
    [CreatedBy] [nvarchar](max) NULL,
    [CreatedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
    [ModifiedBy] [nvarchar](max) NULL,
    [ModifiedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
 CONSTRAINT [PK_BloodGroups] PRIMARY KEY CLUSTERED ([Id] ASC)
)
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Houses]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Houses](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [Name] [nvarchar](100) NOT NULL,
    [Color] [nvarchar](50) NULL,
    [IsActive] [bit] NOT NULL DEFAULT (1),
    [IsDeleted] [bit] NOT NULL DEFAULT (0),
    [CreatedBy] [nvarchar](max) NULL,
    [CreatedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
    [ModifiedBy] [nvarchar](max) NULL,
    [ModifiedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
 CONSTRAINT [PK_Houses] PRIMARY KEY CLUSTERED ([Id] ASC)
)
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[AdmissionTypes]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[AdmissionTypes](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [Name] [nvarchar](100) NOT NULL,
    [IsActive] [bit] NOT NULL DEFAULT (1),
    [IsDeleted] [bit] NOT NULL DEFAULT (0),
    [CreatedBy] [nvarchar](max) NULL,
    [CreatedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
    [ModifiedBy] [nvarchar](max) NULL,
    [ModifiedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
 CONSTRAINT [PK_AdmissionTypes] PRIMARY KEY CLUSTERED ([Id] ASC)
)
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Shifts]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Shifts](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [Name] [nvarchar](100) NOT NULL,
    [IsActive] [bit] NOT NULL DEFAULT (1),
    [IsDeleted] [bit] NOT NULL DEFAULT (0),
    [CreatedBy] [nvarchar](max) NULL,
    [CreatedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
    [ModifiedBy] [nvarchar](max) NULL,
    [ModifiedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
 CONSTRAINT [PK_Shifts] PRIMARY KEY CLUSTERED ([Id] ASC)
)
END
GO

-- 3. Master Tables (Dependent)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SubCastes]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[SubCastes](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [CasteId] [int] NOT NULL,
    [Name] [nvarchar](100) NOT NULL,
    [IsActive] [bit] NOT NULL DEFAULT (1),
    [IsDeleted] [bit] NOT NULL DEFAULT (0),
    [CreatedBy] [nvarchar](max) NULL,
    [CreatedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
    [ModifiedBy] [nvarchar](max) NULL,
    [ModifiedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
 CONSTRAINT [PK_SubCastes] PRIMARY KEY CLUSTERED ([Id] ASC),
 CONSTRAINT [FK_SubCastes_Castes] FOREIGN KEY([CasteId]) REFERENCES [dbo].[Castes] ([Id])
)
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Cities]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Cities](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [StateId] [int] NOT NULL,
    [Name] [nvarchar](100) NOT NULL,
    [IsActive] [bit] NOT NULL DEFAULT (1),
    [IsDeleted] [bit] NOT NULL DEFAULT (0),
    [CreatedBy] [nvarchar](max) NULL,
    [CreatedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
    [ModifiedBy] [nvarchar](max) NULL,
    [ModifiedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
 CONSTRAINT [PK_Cities] PRIMARY KEY CLUSTERED ([Id] ASC),
 CONSTRAINT [FK_Cities_States] FOREIGN KEY([StateId]) REFERENCES [dbo].[States] ([Id])
)
END
GO

-- 4. Main Entity Tables
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Schools]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Schools](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](max) NOT NULL,
	[Code] [nvarchar](max) NULL,
	[Address] [nvarchar](max) NULL,
	[Email] [nvarchar](max) NULL,
	[Phone] [nvarchar](max) NULL,
	[TotalStudents] [int] NOT NULL,
	[ProfilePhotoPath] [nvarchar](max) NULL,
	[Status] [nvarchar](max) NOT NULL DEFAULT (N'Active'),
    [IsActive] [bit] NOT NULL DEFAULT (1),
    [IsDeleted] [bit] NOT NULL DEFAULT (0),
    [CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
    [ModifiedBy] [nvarchar](max) NULL,
    [ModifiedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
 CONSTRAINT [PK_Schools] PRIMARY KEY CLUSTERED ([Id] ASC)
)
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Users](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Username] [nvarchar](100) NOT NULL,
	[PasswordHash] [nvarchar](max) NOT NULL,
	[Name] [nvarchar](255) NULL,
	[Email] [nvarchar](100) NULL,
	[RoleId] [int] NULL,
	[Role] [nvarchar](max) NULL,
	[SchoolId] [int] NULL,
    [IsActive] [bit] NOT NULL DEFAULT (1),
    [IsDeleted] [bit] NOT NULL DEFAULT (0),
    [CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
    [ModifiedBy] [nvarchar](max) NULL,
    [ModifiedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC),
 CONSTRAINT [FK_Users_Schools_SchoolId] FOREIGN KEY([SchoolId]) REFERENCES [dbo].[Schools] ([Id]),
 CONSTRAINT [FK_Users_Roles_RoleId] FOREIGN KEY([RoleId]) REFERENCES [dbo].[Roles] ([Id])
)
END
GO

-- 5. Staff and Resource Tables
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Teachers]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Teachers](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[SchoolId] [int] NOT NULL,
	[EmployeeId] [nvarchar](max) NOT NULL,
	[Department] [nvarchar](max) NULL,
	[Qualification] [nvarchar](max) NULL,
	[Experience] [nvarchar](100) NULL,
	[Subject] [nvarchar](200) NULL,
	[StandardId] [int] NULL,
	[SectionId] [int] NULL,
	[ContactNumber] [nvarchar](max) NULL,
	[Status] [nvarchar](max) NOT NULL DEFAULT (N'Active'),
    [IsActive] [bit] NOT NULL DEFAULT (1),
    [IsDeleted] [bit] NOT NULL DEFAULT (0),
    [CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
    [ModifiedBy] [nvarchar](max) NULL,
    [ModifiedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
 CONSTRAINT [PK_Teachers] PRIMARY KEY CLUSTERED ([Id] ASC),
 CONSTRAINT [FK_Teachers_Schools_SchoolId] FOREIGN KEY([SchoolId]) REFERENCES [dbo].[Schools] ([Id]),
 CONSTRAINT [FK_Teachers_Users_UserId] FOREIGN KEY([UserId]) REFERENCES [dbo].[Users] ([Id]) ON DELETE CASCADE
)
END
GO

-- 6. Student Table (Depends on Schools and Masters)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Students]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Students](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[RegistrationNumber] [nvarchar](max) NOT NULL,
	[Name] [nvarchar](max) NOT NULL,
	[SchoolId] [int] NOT NULL,
	[Status] [nvarchar](max) NOT NULL DEFAULT (N'Active'),
	[RollNumber] [int] NOT NULL,
	
	[STUDENTID] [nvarchar](200) NULL,
	[FNAME] [nvarchar](200) NULL,
	[MNAME] [nvarchar](200) NULL,
	[LNAME] [nvarchar](200) NULL,
	[FirstName] [nvarchar](200) NULL,
	[MiddleName] [nvarchar](200) NULL,
	[LastName] [nvarchar](200) NULL,
	[STD] [nvarchar](200) NOT NULL,
	[DIV] [nvarchar](200) NOT NULL,
	[ROLLNO] [nvarchar](200) NOT NULL,
	[GRNO] [nvarchar](100) NULL,
	[GENDER] [nvarchar](10) NULL,
	[DOB] [nvarchar](200) NULL,
	[DateOfBirth] [nvarchar](200) NULL,
	[BLOODGROUP] [nvarchar](100) NULL,
	[CASTE] [nvarchar](50) NULL,
	[RELIGION] [nvarchar](50) NULL,
	[CATEGORY] [nvarchar](50) NULL,
	[ADDRESS] [nvarchar](500) NULL,
	[CITY] [nvarchar](100) NULL,
	[PIN] [nvarchar](100) NULL,
	[STATE] [nvarchar](50) NULL,
	[FATHERNAME] [nvarchar](200) NULL,
	[MOTHERNAME] [nvarchar](200) NULL,
	[MOBILE] [nvarchar](200) NULL,
	[EMAIL] [nvarchar](50) NULL,
	[SHIFTNAME] [nvarchar](200) NULL,
	[DOA] [nvarchar](200) NULL,
	[ProfilePhotoPath] [nvarchar](500) NULL,
	[CARDID] [nvarchar](500) NULL,
	[VALIDFROM] [nvarchar](200) NULL,
	[VALIDTO] [nvarchar](200) NULL,
	[sms] [nvarchar](10) NULL,
	[subcaste] [nvarchar](255) NULL,
	[contact2] [nvarchar](255) NULL,
	[photo] [varbinary](max) NULL,
	[ispromoted] [nvarchar](10) NULL,
	[saralid] [nvarchar](100) NULL,
	[aadharcard] [nvarchar](100) NULL,
	[bankname] [nvarchar](200) NULL,
	[bankacc] [nvarchar](100) NULL,
	[cid] [nvarchar](100) NULL,
	[fingerid] [nvarchar](500) NULL,
	[freeshiptype] [nvarchar](500) NULL,
	[otp] [nvarchar](500) NULL,
	[admissiontype] [nvarchar](500) NULL,
	[subjects] [nvarchar](500) NULL,
	[placeofbirth] [nvarchar](500) NULL,
	[birthtaluka] [nvarchar](500) NULL,
	[birthdistrict] [nvarchar](500) NULL,
	[birthstate] [nvarchar](500) NULL,
	[birthcountry] [nvarchar](500) NULL,
	[mothertongue] [nvarchar](500) NULL,
	[Nationality] [nvarchar](100) NULL,
	[Lastschool] [nvarchar](500) NULL,
	[Progress] [nvarchar](500) NULL,
	[DateofLeaving] [nvarchar](100) NULL,
	[Reasonforleaving] [nvarchar](500) NULL,
	[LCNo] [nvarchar](500) NULL,
	[conduct] [nvarchar](500) NULL,
	[remark] [nvarchar](500) NULL,
	[dobwords] [nvarchar](500) NULL,
	[admissionstd] [nvarchar](500) NULL,
	[accountname] [nvarchar](500) NULL,
	[IQLD] [nvarchar](10) NULL,
	[schoolsection] [nvarchar](500) NULL,
	[leftstatus] [nvarchar](100) NULL,
	[academicyear] [nvarchar](500) NULL,
	[stdstudying] [nvarchar](500) NULL,
	[house] [nvarchar](500) NULL,
	[feesinstallment] [nvarchar](500) NULL,
	[uniformid] [nvarchar](500) NULL,
	[stdstudyingInWords] [nvarchar](500) NULL,
	[EntryDate] [nvarchar](500) NULL,
	[PEN_No] [nvarchar](50) NULL,
	[apaar_id] [varchar](100) NULL,
	[RFID] [nvarchar](100) NULL,

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

    [IsActive] [bit] NOT NULL DEFAULT (1),
    [IsDeleted] [bit] NOT NULL DEFAULT (0),
    [CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
    [ModifiedBy] [nvarchar](max) NULL,
    [ModifiedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
 CONSTRAINT [PK_Students] PRIMARY KEY CLUSTERED ([Id] ASC)
)
END
GO

-- Foreign Key Constraints for Students
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Students]') AND type in (N'U'))
BEGIN
    IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Students_Schools_SchoolId')
        ALTER TABLE [dbo].[Students] ADD CONSTRAINT [FK_Students_Schools_SchoolId] FOREIGN KEY([SchoolId]) REFERENCES [dbo].[Schools] ([Id]) ON DELETE CASCADE;
    
    IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Students_Standards')
        ALTER TABLE [dbo].[Students] ADD CONSTRAINT [FK_Students_Standards] FOREIGN KEY([StandardId]) REFERENCES [dbo].[Standards] ([Id]);
    
    IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Students_Sections')
        ALTER TABLE [dbo].[Students] ADD CONSTRAINT [FK_Students_Sections] FOREIGN KEY([SectionId]) REFERENCES [dbo].[Sections] ([Id]);
    
    IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Students_AcademicYears')
        ALTER TABLE [dbo].[Students] ADD CONSTRAINT [FK_Students_AcademicYears] FOREIGN KEY([AcademicYearId]) REFERENCES [dbo].[AcademicYears] ([Id]);
    
    IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Students_Castes')
        ALTER TABLE [dbo].[Students] ADD CONSTRAINT [FK_Students_Castes] FOREIGN KEY([CasteId]) REFERENCES [dbo].[Castes] ([Id]);
    
    IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Students_SubCastes')
        ALTER TABLE [dbo].[Students] ADD CONSTRAINT [FK_Students_SubCastes] FOREIGN KEY([SubCasteId]) REFERENCES [dbo].[SubCastes] ([Id]);
    
    IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Students_Religions')
        ALTER TABLE [dbo].[Students] ADD CONSTRAINT [FK_Students_Religions] FOREIGN KEY([ReligionId]) REFERENCES [dbo].[Religions] ([Id]);
    
    IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Students_BloodGroups')
        ALTER TABLE [dbo].[Students] ADD CONSTRAINT [FK_Students_BloodGroups] FOREIGN KEY([BloodGroupId]) REFERENCES [dbo].[BloodGroups] ([Id]);
    
    IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Students_Houses')
        ALTER TABLE [dbo].[Students] ADD CONSTRAINT [FK_Students_Houses] FOREIGN KEY([HouseId]) REFERENCES [dbo].[Houses] ([Id]);
    
    IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Students_AdmissionTypes')
        ALTER TABLE [dbo].[Students] ADD CONSTRAINT [FK_Students_AdmissionTypes] FOREIGN KEY([AdmissionTypeId]) REFERENCES [dbo].[AdmissionTypes] ([Id]);
    
    IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Students_Cities')
        ALTER TABLE [dbo].[Students] ADD CONSTRAINT [FK_Students_Cities] FOREIGN KEY([CityId]) REFERENCES [dbo].[Cities] ([Id]);
    
    IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Students_States')
        ALTER TABLE [dbo].[Students] ADD CONSTRAINT [FK_Students_States] FOREIGN KEY([StateId]) REFERENCES [dbo].[States] ([Id]);
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[NavigationItems]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[NavigationItems](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Title] [nvarchar](100) NOT NULL,
	[Icon] [nvarchar](100) NULL,
	[Path] [nvarchar](255) NULL,
	[ParentId] [int] NULL,
	[SortOrder] [int] NOT NULL DEFAULT ((0)),
	[IsActive] [bit] NOT NULL DEFAULT ((1)),
    [CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
    [ModifiedBy] [nvarchar](max) NULL,
	[ModifiedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
 CONSTRAINT [PK_NavigationItems] PRIMARY KEY CLUSTERED ([Id] ASC),
 CONSTRAINT [FK_NavigationItems_NavigationItems] FOREIGN KEY([ParentId]) REFERENCES [dbo].[NavigationItems] ([Id])
)
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[NavigationRoles]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[NavigationRoles](
    [NavigationItemId] [int] NOT NULL,
    [RoleId] [int] NOT NULL,
 CONSTRAINT [PK_NavigationRoles] PRIMARY KEY CLUSTERED ([NavigationItemId] ASC, [RoleId] ASC),
 CONSTRAINT [FK_NavigationRoles_NavigationItems] FOREIGN KEY([NavigationItemId]) REFERENCES [dbo].[NavigationItems] ([Id]) ON DELETE CASCADE,
 CONSTRAINT [FK_NavigationRoles_Roles] FOREIGN KEY([RoleId]) REFERENCES [dbo].[Roles] ([Id]) ON DELETE CASCADE
)
END
GO

-- 7. Transactional Tables (Depends on Students)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Attendance]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Attendance](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[StudentId] [int] NOT NULL,
	[Date] [datetime2](7) NOT NULL,
	[Status] [nvarchar](max) NOT NULL DEFAULT (N'Present'),
	[MarkedByUserId] [int] NOT NULL,
    [IsActive] [bit] NOT NULL DEFAULT (1),
    [IsDeleted] [bit] NOT NULL DEFAULT (0),
    [CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
    [ModifiedBy] [nvarchar](max) NULL,
    [ModifiedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
 CONSTRAINT [PK_Attendance] PRIMARY KEY CLUSTERED ([Id] ASC)
)
END
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Attendance]') AND type in (N'U'))
BEGIN
    IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Attendance_Students_StudentId')
        ALTER TABLE [dbo].[Attendance] ADD CONSTRAINT [FK_Attendance_Students_StudentId] FOREIGN KEY([StudentId]) REFERENCES [dbo].[Students] ([Id]) ON DELETE CASCADE;
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Fees]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Fees](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[StudentId] [int] NOT NULL,
	[InvoiceNumber] [nvarchar](max) NOT NULL,
	[Type] [nvarchar](max) NOT NULL DEFAULT (N'Tuition'),
	[Amount] [decimal](18, 2) NOT NULL,
	[DueDate] [datetime2](7) NOT NULL,
	[PaidDate] [datetime2](7) NULL,
	[Status] [nvarchar](max) NOT NULL DEFAULT (N'Pending'),
	[PaymentMethod] [nvarchar](max) NULL,
    [IsActive] [bit] NOT NULL DEFAULT (1),
    [IsDeleted] [bit] NOT NULL DEFAULT (0),
    [CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
    [ModifiedBy] [nvarchar](max) NULL,
    [ModifiedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
 CONSTRAINT [PK_Fees] PRIMARY KEY CLUSTERED ([Id] ASC)
)
END
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Fees]') AND type in (N'U'))
BEGIN
    IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Fees_Students_StudentId')
        ALTER TABLE [dbo].[Fees] ADD CONSTRAINT [FK_Fees_Students_StudentId] FOREIGN KEY([StudentId]) REFERENCES [dbo].[Students] ([Id]) ON DELETE CASCADE;
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Marks]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Marks](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[StudentId] [int] NOT NULL,
	[Subject] [nvarchar](max) NOT NULL,
	[ExamName] [nvarchar](max) NOT NULL DEFAULT (N'Mid-Term'),
	[MarksObtained] [decimal](18, 2) NOT NULL,
	[TotalMarks] [decimal](18, 2) NOT NULL,
	[Grade] [nvarchar](max) NULL,
    [IsActive] [bit] NOT NULL DEFAULT (1),
    [IsDeleted] [bit] NOT NULL DEFAULT (0),
    [CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
    [ModifiedBy] [nvarchar](max) NULL,
    [ModifiedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
 CONSTRAINT [PK_Marks] PRIMARY KEY CLUSTERED ([Id] ASC)
)
END
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Marks]') AND type in (N'U'))
BEGIN
    IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Marks_Students_StudentId')
        ALTER TABLE [dbo].[Marks] ADD CONSTRAINT [FK_Marks_Students_StudentId] FOREIGN KEY([StudentId]) REFERENCES [dbo].[Students] ([Id]) ON DELETE CASCADE;
END
GO

-- 8. Other Application Master Tables
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Categories]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Categories](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [Name] [nvarchar](100) NOT NULL,
    [IsActive] [bit] NOT NULL DEFAULT (1),
    [IsDeleted] [bit] NOT NULL DEFAULT (0),
    [CreatedBy] [nvarchar](max) NULL,
    [CreatedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
    [ModifiedBy] [nvarchar](max) NULL,
    [ModifiedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
 CONSTRAINT [PK_Categories] PRIMARY KEY CLUSTERED ([Id] ASC)
)
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Sessions]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Sessions](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [Name] [nvarchar](100) NOT NULL,
    [IsActive] [bit] NOT NULL DEFAULT (1),
    [IsDeleted] [bit] NOT NULL DEFAULT (0),
    [CreatedBy] [nvarchar](max) NULL,
    [CreatedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
    [ModifiedBy] [nvarchar](max) NULL,
    [ModifiedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
 CONSTRAINT [PK_Sessions] PRIMARY KEY CLUSTERED ([Id] ASC)
)
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Batches]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Batches](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [Name] [nvarchar](100) NOT NULL,
    [IsActive] [bit] NOT NULL DEFAULT (1),
    [IsDeleted] [bit] NOT NULL DEFAULT (0),
    [CreatedBy] [nvarchar](max) NULL,
    [CreatedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
    [ModifiedBy] [nvarchar](max) NULL,
    [ModifiedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
 CONSTRAINT [PK_Batches] PRIMARY KEY CLUSTERED ([Id] ASC)
)
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Subjects]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Subjects](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [Name] [nvarchar](100) NOT NULL,
    [Description] [nvarchar](max) NULL,
    [IsActive] [bit] NOT NULL DEFAULT (1),
    [IsDeleted] [bit] NOT NULL DEFAULT (0),
    [CreatedBy] [nvarchar](max) NULL,
    [CreatedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
    [ModifiedBy] [nvarchar](max) NULL,
    [ModifiedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
 CONSTRAINT [PK_Subjects] PRIMARY KEY CLUSTERED ([Id] ASC)
)
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ExamTypes]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[ExamTypes](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [Name] [nvarchar](100) NOT NULL,
    [IsActive] [bit] NOT NULL DEFAULT (1),
    [IsDeleted] [bit] NOT NULL DEFAULT (0),
    [CreatedBy] [nvarchar](max) NULL,
    [CreatedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
    [ModifiedBy] [nvarchar](max) NULL,
    [ModifiedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
 CONSTRAINT [PK_ExamTypes] PRIMARY KEY CLUSTERED ([Id] ASC)
)
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Designations]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Designations](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [Name] [nvarchar](100) NOT NULL,
    [IsActive] [bit] NOT NULL DEFAULT (1),
    [IsDeleted] [bit] NOT NULL DEFAULT (0),
    [CreatedBy] [nvarchar](max) NULL,
    [CreatedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
    [ModifiedBy] [nvarchar](max) NULL,
    [ModifiedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
 CONSTRAINT [PK_Designations] PRIMARY KEY CLUSTERED ([Id] ASC)
)
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Occupations]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Occupations](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [Name] [nvarchar](100) NOT NULL,
    [IsActive] [bit] NOT NULL DEFAULT (1),
    [IsDeleted] [bit] NOT NULL DEFAULT (0),
    [CreatedBy] [nvarchar](max) NULL,
    [CreatedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
    [ModifiedBy] [nvarchar](max) NULL,
    [ModifiedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
 CONSTRAINT [PK_Occupations] PRIMARY KEY CLUSTERED ([Id] ASC)
)
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Messages]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Messages](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[SenderId] [int] NOT NULL,
	[ReceiverId] [int] NULL,
	[Subject] [nvarchar](max) NOT NULL,
	[Content] [nvarchar](max) NOT NULL,
	[IsRead] [bit] NOT NULL,
	[Type] [nvarchar](max) NOT NULL DEFAULT (N'Alert'),
	[CreatedAt] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
    [IsActive] [bit] NOT NULL DEFAULT (1),
    [IsDeleted] [bit] NOT NULL DEFAULT (0),
    [CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
    [ModifiedBy] [nvarchar](max) NULL,
    [ModifiedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
 CONSTRAINT [PK_Messages] PRIMARY KEY CLUSTERED ([Id] ASC)
)
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Notifications]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Notifications](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NULL,
    [RoleId] [int] NULL,
	[Title] [nvarchar](max) NOT NULL,
	[Message] [nvarchar](max) NOT NULL,
	[Type] [nvarchar](50) NOT NULL DEFAULT (N'info'),
	[IsRead] [bit] NOT NULL DEFAULT (0),
	[CreatedAt] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
    [IsActive] [bit] NOT NULL DEFAULT (1),
    [IsDeleted] [bit] NOT NULL DEFAULT (0),
    [CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
    [ModifiedBy] [nvarchar](max) NULL,
    [ModifiedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
 CONSTRAINT [PK_Notifications] PRIMARY KEY CLUSTERED ([Id] ASC)
)
END
GO

-- 9. Sample Data
IF NOT EXISTS (SELECT * FROM [dbo].[ErrorLogs] WHERE [Id] = 1)
BEGIN
INSERT INTO [dbo].[ErrorLogs] ([Message], [Level], [Timestamp], [Exception], [Properties])
VALUES 
    ('Database connection timeout', 'Error', DATEADD(HOUR, -2, GETUTCDATE()), 'System.Data.SqlClient.SqlException: Timeout expired', 'Path: /api/students'),
    ('Null reference exception in student service', 'Error', DATEADD(HOUR, -1, GETUTCDATE()), 'System.NullReferenceException: Object reference not set to an instance of an object', 'Path: /api/students/5'),
    ('Invalid operation: Duplicate entry', 'Warning', DATEADD(MINUTE, -30, GETUTCDATE()), 'System.InvalidOperationException: Sequence contains no matching element', 'Path: /api/marks'),
    ('Authentication failed for user', 'Error', GETUTCDATE(), 'System.UnauthorizedAccessException: Access denied', 'Path: /api/auth/login'),
    ('Database constraint violation', 'Error', DATEADD(MINUTE, -15, GETUTCDATE()), 'System.Data.DbUpdateException: An error occurred while updating the entries', 'Path: /api/fees');
END
GO
