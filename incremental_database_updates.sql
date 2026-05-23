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
