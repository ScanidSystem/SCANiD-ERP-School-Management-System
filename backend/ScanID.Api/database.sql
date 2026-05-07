IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'ScanID_DB')
BEGIN
  CREATE DATABASE ScanID_DB;
END
GO

USE ScanID_DB;
GO

-- Audit Logs table
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

-- Error Logs table
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

-- Helper to add audit columns
-- (In a real script we would iterate or repeat, here we update the main table definitions)

-- Schools table
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

-- Users table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Users](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Username] [nvarchar](max) NOT NULL,
	[PasswordHash] [nvarchar](max) NOT NULL,
	[FullName] [nvarchar](max) NULL,
	[Email] [nvarchar](max) NULL,
	[Role] [nvarchar](max) NOT NULL DEFAULT (N'student'),
	[SchoolId] [int] NULL,
    [IsActive] [bit] NOT NULL DEFAULT (1),
    [IsDeleted] [bit] NOT NULL DEFAULT (0),
    [CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
    [ModifiedBy] [nvarchar](max) NULL,
    [ModifiedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC),
 CONSTRAINT [FK_Users_Schools_SchoolId] FOREIGN KEY([SchoolId]) REFERENCES [dbo].[Schools] ([Id])
)
END
GO

-- Students table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Students]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Students](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[RegistrationNumber] [nvarchar](max) NOT NULL,
    [FirstName] [nvarchar](max) NULL,
    [MiddleName] [nvarchar](max) NULL,
    [LastName] [nvarchar](max) NULL,
	[FullName] [nvarchar](max) NOT NULL,
	[SchoolId] [int] NOT NULL,
	[Standard] [nvarchar](max) NULL,
	[Section] [nvarchar](max) NULL,
	[DateOfBirth] [datetime2](7) NULL,
	[Gender] [nvarchar](max) NULL,
	[FatherName] [nvarchar](max) NULL,
    [MotherName] [nvarchar](max) NULL,
	[ContactNumber] [nvarchar](max) NULL,
    [Address] [nvarchar](max) NULL,
    [AadharCard] [nvarchar](max) NULL,
    [Photo] [nvarchar](max) NULL,
	[Status] [nvarchar](max) NOT NULL DEFAULT (N'Active'),
	[RollNumber] [int] NOT NULL,
    [IsActive] [bit] NOT NULL DEFAULT (1),
    [IsDeleted] [bit] NOT NULL DEFAULT (0),
    [CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
    [ModifiedBy] [nvarchar](max) NULL,
    [ModifiedOn] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
 CONSTRAINT [PK_Students] PRIMARY KEY CLUSTERED ([Id] ASC),
 CONSTRAINT [FK_Students_Schools_SchoolId] FOREIGN KEY([SchoolId]) REFERENCES [dbo].[Schools] ([Id]) ON DELETE CASCADE
)
END
GO


-- Teachers table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Teachers]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Teachers](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[SchoolId] [int] NOT NULL,
	[EmployeeId] [nvarchar](max) NOT NULL,
	[Department] [nvarchar](max) NULL,
	[Qualification] [nvarchar](max) NULL,
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

-- Attendance table
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
 CONSTRAINT [PK_Attendance] PRIMARY KEY CLUSTERED ([Id] ASC),
 CONSTRAINT [FK_Attendance_Students_StudentId] FOREIGN KEY([StudentId]) REFERENCES [dbo].[Students] ([Id]) ON DELETE CASCADE
)
END
GO

-- Fees table
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
 CONSTRAINT [PK_Fees] PRIMARY KEY CLUSTERED ([Id] ASC),
 CONSTRAINT [FK_Fees_Students_StudentId] FOREIGN KEY([StudentId]) REFERENCES [dbo].[Students] ([Id]) ON DELETE CASCADE
)
END
GO

-- Marks table
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
 CONSTRAINT [PK_Marks] PRIMARY KEY CLUSTERED ([Id] ASC),
 CONSTRAINT [FK_Marks_Students_StudentId] FOREIGN KEY([StudentId]) REFERENCES [dbo].[Students] ([Id]) ON DELETE CASCADE
)
END
GO

-- Messages table
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

-- Sample Error Log Data (for testing the Database Errors tab)
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
