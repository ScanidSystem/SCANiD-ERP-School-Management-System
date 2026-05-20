USE [master]
GO
/****** Object:  Database [ScanID_DB]    Script Date: 20/05/2026 4:45:32 PM ******/
CREATE DATABASE [ScanID_DB]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'ScanID_DB', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.SQLEXPRESS\MSSQL\DATA\ScanID_DB.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'ScanID_DB_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.SQLEXPRESS\MSSQL\DATA\ScanID_DB_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO
ALTER DATABASE [ScanID_DB] SET COMPATIBILITY_LEVEL = 150
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [ScanID_DB].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [ScanID_DB] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [ScanID_DB] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [ScanID_DB] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [ScanID_DB] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [ScanID_DB] SET ARITHABORT OFF 
GO
ALTER DATABASE [ScanID_DB] SET AUTO_CLOSE ON 
GO
ALTER DATABASE [ScanID_DB] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [ScanID_DB] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [ScanID_DB] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [ScanID_DB] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [ScanID_DB] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [ScanID_DB] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [ScanID_DB] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [ScanID_DB] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [ScanID_DB] SET  ENABLE_BROKER 
GO
ALTER DATABASE [ScanID_DB] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [ScanID_DB] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [ScanID_DB] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [ScanID_DB] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [ScanID_DB] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [ScanID_DB] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [ScanID_DB] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [ScanID_DB] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [ScanID_DB] SET  MULTI_USER 
GO
ALTER DATABASE [ScanID_DB] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [ScanID_DB] SET DB_CHAINING OFF 
GO
ALTER DATABASE [ScanID_DB] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [ScanID_DB] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [ScanID_DB] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [ScanID_DB] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [ScanID_DB] SET QUERY_STORE = OFF
GO
USE [ScanID_DB]
GO
/****** Object:  Table [dbo].[AcademicYears]    Script Date: 20/05/2026 4:45:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AcademicYears](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[IsCurrent] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](max) NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_AcademicYears] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AdmissionTypes]    Script Date: 20/05/2026 4:45:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AdmissionTypes](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[IsActive] [bit] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](max) NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_AdmissionTypes] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Attendance]    Script Date: 20/05/2026 4:45:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Attendance](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[StudentId] [int] NOT NULL,
	[Date] [datetime2](7) NOT NULL,
	[Status] [nvarchar](max) NOT NULL,
	[MarkedByUserId] [int] NOT NULL,
	[IsActive] [bit] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](max) NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_Attendance] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AuditLogs]    Script Date: 20/05/2026 4:45:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AuditLogs](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [nvarchar](max) NULL,
	[Type] [nvarchar](max) NULL,
	[TableName] [nvarchar](max) NULL,
	[DateTime] [datetime2](7) NOT NULL,
	[OldValues] [nvarchar](max) NULL,
	[NewValues] [nvarchar](max) NULL,
	[AffectedColumns] [nvarchar](max) NULL,
	[PrimaryKey] [nvarchar](max) NULL,
 CONSTRAINT [PK_AuditLogs] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Batches]    Script Date: 20/05/2026 4:45:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Batches](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[IsActive] [bit] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](max) NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_Batches] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[BloodGroups]    Script Date: 20/05/2026 4:45:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BloodGroups](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](20) NOT NULL,
	[IsActive] [bit] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](max) NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_BloodGroups] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Castes]    Script Date: 20/05/2026 4:45:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Castes](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[IsActive] [bit] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](max) NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_Castes] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Categories]    Script Date: 20/05/2026 4:45:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Categories](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[IsActive] [bit] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](max) NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_Categories] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Cities]    Script Date: 20/05/2026 4:45:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Cities](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[StateId] [int] NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[IsActive] [bit] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](max) NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_Cities] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Designations]    Script Date: 20/05/2026 4:45:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Designations](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[IsActive] [bit] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](max) NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_Designations] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ErrorLogs]    Script Date: 20/05/2026 4:45:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ErrorLogs](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Message] [nvarchar](max) NULL,
	[Level] [nvarchar](max) NULL,
	[Timestamp] [datetime2](7) NOT NULL,
	[Exception] [nvarchar](max) NULL,
	[Properties] [nvarchar](max) NULL,
 CONSTRAINT [PK_ErrorLogs] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ExamTypes]    Script Date: 20/05/2026 4:45:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ExamTypes](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[IsActive] [bit] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](max) NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_ExamTypes] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Fees]    Script Date: 20/05/2026 4:45:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Fees](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[StudentId] [int] NOT NULL,
	[InvoiceNumber] [nvarchar](max) NOT NULL,
	[Type] [nvarchar](max) NOT NULL,
	[Amount] [decimal](18, 2) NOT NULL,
	[DueDate] [datetime2](7) NOT NULL,
	[PaidDate] [datetime2](7) NULL,
	[Status] [nvarchar](max) NOT NULL,
	[PaymentMethod] [nvarchar](max) NULL,
	[IsActive] [bit] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](max) NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_Fees] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Houses]    Script Date: 20/05/2026 4:45:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Houses](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[Color] [nvarchar](50) NULL,
	[IsActive] [bit] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](max) NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_Houses] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Marks]    Script Date: 20/05/2026 4:45:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Marks](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[StudentId] [int] NOT NULL,
	[Subject] [nvarchar](max) NOT NULL,
	[ExamName] [nvarchar](max) NOT NULL,
	[MarksObtained] [decimal](18, 2) NOT NULL,
	[TotalMarks] [decimal](18, 2) NOT NULL,
	[Grade] [nvarchar](max) NULL,
	[IsActive] [bit] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](max) NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_Marks] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Messages]    Script Date: 20/05/2026 4:45:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Messages](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[SenderId] [int] NOT NULL,
	[ReceiverId] [int] NULL,
	[Subject] [nvarchar](max) NOT NULL,
	[Content] [nvarchar](max) NOT NULL,
	[IsRead] [bit] NOT NULL,
	[Type] [nvarchar](max) NOT NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
	[IsActive] [bit] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](max) NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_Messages] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[NavigationItems]    Script Date: 20/05/2026 4:45:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[NavigationItems](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Title] [nvarchar](100) NOT NULL,
	[Icon] [nvarchar](100) NULL,
	[Path] [nvarchar](255) NULL,
	[ParentId] [int] NULL,
	[SortOrder] [int] NOT NULL,
	[IsActive] [bit] NOT NULL,
	[CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](max) NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_NavigationItems] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[NavigationRoles]    Script Date: 20/05/2026 4:45:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[NavigationRoles](
	[NavigationItemId] [int] NOT NULL,
	[RoleId] [int] NOT NULL,
 CONSTRAINT [PK_NavigationRoles] PRIMARY KEY CLUSTERED 
(
	[NavigationItemId] ASC,
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Notifications]    Script Date: 20/05/2026 4:45:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Notifications](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NULL,
	[RoleId] [int] NULL,
	[Title] [nvarchar](max) NOT NULL,
	[Message] [nvarchar](max) NOT NULL,
	[Type] [nvarchar](50) NOT NULL,
	[IsRead] [bit] NOT NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
	[IsActive] [bit] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](max) NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_Notifications] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Occupations]    Script Date: 20/05/2026 4:45:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Occupations](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[IsActive] [bit] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](max) NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_Occupations] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Religions]    Script Date: 20/05/2026 4:45:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Religions](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[IsActive] [bit] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](max) NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_Religions] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Roles]    Script Date: 20/05/2026 4:45:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Roles](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[Description] [nvarchar](255) NULL,
	[IsActive] [bit] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](max) NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_Roles] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Schools]    Script Date: 20/05/2026 4:45:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Schools](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](max) NOT NULL,
	[Code] [nvarchar](max) NULL,
	[Address] [nvarchar](max) NULL,
	[Email] [nvarchar](max) NULL,
	[Phone] [nvarchar](max) NULL,
	[TotalStudents] [int] NOT NULL,
	[Status] [nvarchar](max) NOT NULL,
	[IsActive] [bit] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](max) NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
	[ProfilePhotoPath] [nvarchar](max) NULL,
 CONSTRAINT [PK_Schools] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Sections]    Script Date: 20/05/2026 4:45:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Sections](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](255) NULL,
	[IsActive] [bit] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](max) NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_Sections] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Sessions]    Script Date: 20/05/2026 4:45:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Sessions](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[IsActive] [bit] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](max) NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_Sessions] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Shifts]    Script Date: 20/05/2026 4:45:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Shifts](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[IsActive] [bit] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](max) NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_Shifts] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Standards]    Script Date: 20/05/2026 4:45:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Standards](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[Description] [nvarchar](255) NULL,
	[IsActive] [bit] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](max) NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_Standards] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[States]    Script Date: 20/05/2026 4:45:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[States](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[IsActive] [bit] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](max) NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_States] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Students]    Script Date: 20/05/2026 4:45:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Students](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[RegistrationNumber] [nvarchar](max) NOT NULL,
	[Name] [nvarchar](max) NOT NULL,
	[SchoolId] [int] NOT NULL,
	[Status] [nvarchar](max) NOT NULL,
	[RollNumber] [int] NOT NULL,
	[STUDENTID] [nvarchar](200) NULL,
	[FNAME] [nvarchar](200) NULL,
	[MNAME] [nvarchar](200) NULL,
	[LNAME] [nvarchar](200) NULL,
	[FirstName] [nvarchar](200) NULL,
	[MiddleName] [nvarchar](200) NULL,
	[LastName] [nvarchar](200) NULL,
	[GRNO] [nvarchar](100) NULL,
	[GENDER] [nvarchar](10) NULL,
	[DOB] [nvarchar](200) NULL,
	[DateOfBirth] [nvarchar](200) NULL,
	[ADDRESS] [nvarchar](500) NULL,
	[PIN] [nvarchar](100) NULL,
	[FATHERNAME] [nvarchar](200) NULL,
	[MOTHERNAME] [nvarchar](200) NULL,
	[MOBILE] [nvarchar](200) NULL,
	[EMAIL] [nvarchar](50) NULL,
	[DOA] [nvarchar](200) NULL,
	[ProfilePhotoPath] [nvarchar](500) NULL,
	[CARDID] [nvarchar](500) NULL,
	[VALIDFROM] [nvarchar](200) NULL,
	[VALIDTO] [nvarchar](200) NULL,
	[sms] [nvarchar](10) NULL,
	[contact2] [nvarchar](255) NULL,
	[ispromoted] [nvarchar](10) NULL,
	[saralid] [nvarchar](100) NULL,
	[aadharcard] [nvarchar](100) NULL,
	[bankname] [nvarchar](200) NULL,
	[bankacc] [nvarchar](100) NULL,
	[cid] [nvarchar](100) NULL,
	[fingerid] [nvarchar](500) NULL,
	[freeshiptype] [nvarchar](500) NULL,
	[otp] [nvarchar](500) NULL,
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
	[IsActive] [bit] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](max) NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
	[CategoryId] [int] NULL,
 CONSTRAINT [PK_Students] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SubCastes]    Script Date: 20/05/2026 4:45:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SubCastes](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CasteId] [int] NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[IsActive] [bit] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](max) NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_SubCastes] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Subjects]    Script Date: 20/05/2026 4:45:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Subjects](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[Description] [nvarchar](max) NULL,
	[IsActive] [bit] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](max) NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_Subjects] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Teachers]    Script Date: 20/05/2026 4:45:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
	[Status] [nvarchar](max) NOT NULL,
	[IsActive] [bit] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](max) NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
	[ProfilePhotoPath] [nvarchar](max) NULL,
 CONSTRAINT [PK_Teachers] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 20/05/2026 4:45:33 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Username] [nvarchar](100) NOT NULL,
	[PasswordHash] [nvarchar](max) NOT NULL,
	[Name] [nvarchar](255) NULL,
	[Email] [nvarchar](100) NULL,
	[RoleId] [int] NULL,
	[Role] [nvarchar](max) NULL,
	[SchoolId] [int] NULL,
	[IsActive] [bit] NOT NULL,
	[IsDeleted] [bit] NOT NULL,
	[CreatedBy] [nvarchar](max) NULL,
	[CreatedOn] [datetime2](7) NOT NULL,
	[ModifiedBy] [nvarchar](max) NULL,
	[ModifiedOn] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[AcademicYears] ON 
GO
INSERT [dbo].[AcademicYears] ([Id], [Name], [IsCurrent], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (1, N'2024-2025', 0, 1, 0, NULL, CAST(N'2026-05-15T11:30:03.0300000' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:03.0300000' AS DateTime2))
GO
INSERT [dbo].[AcademicYears] ([Id], [Name], [IsCurrent], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (2, N'2025-2026', 1, 1, 0, NULL, CAST(N'2026-05-15T11:30:03.0300000' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:03.0300000' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[AcademicYears] OFF
GO
SET IDENTITY_INSERT [dbo].[AdmissionTypes] ON 
GO
INSERT [dbo].[AdmissionTypes] ([Id], [Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (1, N'REGULAR', 1, 0, NULL, CAST(N'2026-05-15T11:30:03.0700000' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:03.0700000' AS DateTime2))
GO
INSERT [dbo].[AdmissionTypes] ([Id], [Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (2, N'RTE', 1, 0, NULL, CAST(N'2026-05-15T11:30:03.0700000' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:03.0700000' AS DateTime2))
GO
INSERT [dbo].[AdmissionTypes] ([Id], [Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (3, N'STAFF CHILD', 1, 0, NULL, CAST(N'2026-05-15T11:30:03.0700000' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:03.0700000' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[AdmissionTypes] OFF
GO
SET IDENTITY_INSERT [dbo].[AuditLogs] ON 
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (1, NULL, N'Update', N'Student', CAST(N'2026-05-16T16:32:12.3603295' AS DateTime2), N'{"ADDRESS":"N/A","AcademicYearId":null,"AdmissionTypeId":1,"BLOODGROUP":"1","BloodGroupId":1,"CARDID":null,"CASTE":"1","CATEGORY":null,"CITY":null,"CasteId":1,"CityId":null,"CreatedBy":null,"CreatedOn":"2026-05-16T16:32:11.8605935+05:30","DIV":"A","DOA":null,"DOB":"2026-05-18","DateofLeaving":null,"EMAIL":null,"EntryDate":null,"FATHERNAME":null,"FNAME":"Shivansh","GENDER":"Male","GRNO":"REG1001","HouseId":1,"IQLD":null,"IsActive":true,"IsDeleted":false,"LCNo":null,"LNAME":"Khopkar","Lastschool":null,"MNAME":"Sanjay","MOBILE":"4564564564","MOTHERNAME":"trerter","ModifiedBy":"Super Admin","ModifiedOn":"2026-05-16T16:32:11.8605948+05:30","Name":"Shivansh Sanjay Khopkar","Nationality":null,"PEN_No":null,"PIN":null,"ProfilePhotoPath":"","Progress":null,"RELIGION":"1","RFID":"","ROLLNO":"1","Reasonforleaving":null,"RegistrationNumber":"REG1001","ReligionId":1,"RollNumber":1,"SHIFTNAME":"AFTERNOON","STATE":null,"STD":"1st","STUDENTID":"REG1001","SchoolId":1,"SectionId":1,"ShiftId":2,"StandardId":1,"StateId":null,"Status":"Active","SubCasteId":null,"VALIDFROM":null,"VALIDTO":null,"aadharcard":"345353453453","academicyear":"","accountname":null,"admissionstd":null,"admissiontype":"1","apaar_id":null,"bankacc":null,"bankname":null,"birthcountry":null,"birthdistrict":null,"birthstate":null,"birthtaluka":null,"cid":null,"conduct":null,"contact2":"","dobwords":null,"feesinstallment":null,"fingerid":null,"freeshiptype":null,"house":"1","ispromoted":null,"leftstatus":null,"mothertongue":null,"otp":null,"photo":null,"placeofbirth":null,"remark":null,"saralid":null,"schoolsection":null,"sms":"","stdstudying":null,"stdstudyingInWords":null,"subcaste":"","subjects":null,"uniformid":""}', N'{"ADDRESS":"N/A","AcademicYearId":null,"AdmissionTypeId":1,"BLOODGROUP":"1","BloodGroupId":1,"CARDID":null,"CASTE":"1","CATEGORY":null,"CITY":null,"CasteId":1,"CityId":null,"CreatedBy":null,"CreatedOn":"2026-05-16T16:32:11.8605935+05:30","DIV":"A","DOA":null,"DOB":"2026-05-18","DateofLeaving":null,"EMAIL":null,"EntryDate":null,"FATHERNAME":null,"FNAME":"Shivansh","GENDER":"Male","GRNO":"REG1001","HouseId":1,"IQLD":null,"IsActive":true,"IsDeleted":false,"LCNo":null,"LNAME":"Khopkar","Lastschool":null,"MNAME":"Sanjay","MOBILE":"4564564564","MOTHERNAME":"trerter","ModifiedBy":"Super Admin","ModifiedOn":"2026-05-16T16:32:12.2906062+05:30","Name":"Shivansh Sanjay Khopkar","Nationality":null,"PEN_No":null,"PIN":null,"ProfilePhotoPath":"","Progress":null,"RELIGION":"1","RFID":"","ROLLNO":"1","Reasonforleaving":null,"RegistrationNumber":"REG1001","ReligionId":1,"RollNumber":1,"SHIFTNAME":"AFTERNOON","STATE":null,"STD":"1st","STUDENTID":"REG1001","SchoolId":1,"SectionId":1,"ShiftId":2,"StandardId":1,"StateId":null,"Status":"Active","SubCasteId":null,"VALIDFROM":null,"VALIDTO":null,"aadharcard":"345353453453","academicyear":"","accountname":null,"admissionstd":null,"admissiontype":"1","apaar_id":null,"bankacc":null,"bankname":null,"birthcountry":null,"birthdistrict":null,"birthstate":null,"birthtaluka":null,"cid":null,"conduct":null,"contact2":"","dobwords":null,"feesinstallment":null,"fingerid":null,"freeshiptype":null,"house":"1","ispromoted":null,"leftstatus":null,"mothertongue":null,"otp":null,"photo":null,"placeofbirth":null,"remark":null,"saralid":null,"schoolsection":null,"sms":"","stdstudying":null,"stdstudyingInWords":null,"subcaste":"","subjects":null,"uniformid":""}', N'["ADDRESS","AcademicYearId","AdmissionTypeId","BLOODGROUP","BloodGroupId","CARDID","CASTE","CATEGORY","CITY","CasteId","CityId","CreatedBy","CreatedOn","DIV","DOA","DOB","DateofLeaving","EMAIL","EntryDate","FATHERNAME","FNAME","GENDER","GRNO","HouseId","IQLD","IsActive","IsDeleted","LCNo","LNAME","Lastschool","MNAME","MOBILE","MOTHERNAME","ModifiedBy","ModifiedOn","Name","Nationality","PEN_No","PIN","ProfilePhotoPath","Progress","RELIGION","RFID","ROLLNO","Reasonforleaving","RegistrationNumber","ReligionId","RollNumber","SHIFTNAME","STATE","STD","STUDENTID","SchoolId","SectionId","ShiftId","StandardId","StateId","Status","SubCasteId","VALIDFROM","VALIDTO","aadharcard","academicyear","accountname","admissionstd","admissiontype","apaar_id","bankacc","bankname","birthcountry","birthdistrict","birthstate","birthtaluka","cid","conduct","contact2","dobwords","feesinstallment","fingerid","freeshiptype","house","ispromoted","leftstatus","mothertongue","otp","photo","placeofbirth","remark","saralid","schoolsection","sms","stdstudying","stdstudyingInWords","subcaste","subjects","uniformid"]', N'{"Id":1}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (2, NULL, N'Update', N'Student', CAST(N'2026-05-16T16:34:33.8051781' AS DateTime2), N'{"ModifiedOn":"2026-05-16T16:32:12.2906062","ProfilePhotoPath":""}', N'{"ModifiedOn":"2026-05-16T16:34:33.8050918+05:30","ProfilePhotoPath":"/uploads/SCANID_PRIMARY_SCHOOL/1st/A/student_1_639145460737383408.jpeg"}', N'["ModifiedOn","ProfilePhotoPath"]', N'{"Id":1}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (3, NULL, N'Update', N'Student', CAST(N'2026-05-16T16:34:45.5933998' AS DateTime2), N'{"ModifiedOn":"2026-05-16T16:34:33.8050918","ProfilePhotoPath":"/uploads/SCANID_PRIMARY_SCHOOL/1st/A/student_1_639145460737383408.jpeg"}', N'{"ModifiedOn":"2026-05-16T16:34:45.5932742+05:30","ProfilePhotoPath":"/uploads/SCANID_PRIMARY_SCHOOL/1st/A/student_1_639145460855818671.jpeg"}', N'["ModifiedOn","ProfilePhotoPath"]', N'{"Id":1}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (4, NULL, N'Update', N'Student', CAST(N'2026-05-16T16:34:50.8557410' AS DateTime2), N'{"ModifiedOn":"2026-05-15T11:30:03.1233333","ProfilePhotoPath":null}', N'{"ModifiedOn":"2026-05-16T16:34:50.8556638+05:30","ProfilePhotoPath":"/uploads/SCANID_PRIMARY_SCHOOL/1st/A/student_2_639145460908494989.jpeg"}', N'["ModifiedOn","ProfilePhotoPath"]', N'{"Id":2}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (5, NULL, N'Update', N'User', CAST(N'2026-05-16T19:42:01.6806583' AS DateTime2), N'{"CreatedBy":"SYSTEM","CreatedOn":"2026-05-15T11:30:03.09","Email":"admin@scanid.com","IsActive":true,"IsDeleted":false,"ModifiedBy":null,"ModifiedOn":"2026-05-15T11:30:03.09","Name":"Admin","PasswordHash":"Password123","Role":null,"SchoolId":1,"Username":"adminuser"}', N'{"CreatedBy":"SYSTEM","CreatedOn":"2026-05-15T11:30:03.09","Email":"admin@scanid.com","IsActive":true,"IsDeleted":false,"ModifiedBy":null,"ModifiedOn":"2026-05-16T19:42:01.6758434+05:30","Name":"Admin","PasswordHash":"Password123","Role":"admin","SchoolId":1,"Username":"adminuser"}', N'["CreatedBy","CreatedOn","Email","IsActive","IsDeleted","ModifiedBy","ModifiedOn","Name","PasswordHash","Role","SchoolId","Username"]', N'{"Id":2}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (6, NULL, N'Update', N'User', CAST(N'2026-05-16T19:42:28.4837453' AS DateTime2), N'{"CreatedBy":"SYSTEM","CreatedOn":"2026-05-15T11:30:03.09","Email":"teacher@scanid.com","IsActive":true,"IsDeleted":false,"ModifiedBy":null,"ModifiedOn":"2026-05-15T11:30:03.09","Name":"Teacher","PasswordHash":"Password123","Role":null,"SchoolId":1,"Username":"teacher"}', N'{"CreatedBy":"SYSTEM","CreatedOn":"2026-05-15T11:30:03.09","Email":"teacher@scanid.com","IsActive":true,"IsDeleted":false,"ModifiedBy":null,"ModifiedOn":"2026-05-16T19:42:28.4836972+05:30","Name":"Teacher","PasswordHash":"Password123","Role":"teacher","SchoolId":1,"Username":"teacher"}', N'["CreatedBy","CreatedOn","Email","IsActive","IsDeleted","ModifiedBy","ModifiedOn","Name","PasswordHash","Role","SchoolId","Username"]', N'{"Id":3}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (7, NULL, N'Update', N'User', CAST(N'2026-05-16T19:42:41.8939496' AS DateTime2), N'{"CreatedBy":"SYSTEM","CreatedOn":"2026-05-15T11:30:03.09","Email":"parent@scanid.com","IsActive":true,"IsDeleted":false,"ModifiedBy":null,"ModifiedOn":"2026-05-15T11:30:03.09","Name":"Parent","PasswordHash":"Password123","Role":null,"SchoolId":1,"Username":"parent"}', N'{"CreatedBy":"SYSTEM","CreatedOn":"2026-05-15T11:30:03.09","Email":"parent@scanid.com","IsActive":true,"IsDeleted":false,"ModifiedBy":null,"ModifiedOn":"2026-05-16T19:42:41.8938943+05:30","Name":"Parent","PasswordHash":"Password123","Role":"parent","SchoolId":1,"Username":"parent"}', N'["CreatedBy","CreatedOn","Email","IsActive","IsDeleted","ModifiedBy","ModifiedOn","Name","PasswordHash","Role","SchoolId","Username"]', N'{"Id":6}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (8, NULL, N'Update', N'User', CAST(N'2026-05-16T19:42:52.4292324' AS DateTime2), N'{"CreatedBy":"SYSTEM","CreatedOn":"2026-05-15T11:30:03.09","Email":"student@scanid.com","IsActive":true,"IsDeleted":false,"ModifiedBy":null,"ModifiedOn":"2026-05-15T11:30:03.09","Name":"Student","PasswordHash":"Password123","Role":null,"SchoolId":1,"Username":"student"}', N'{"CreatedBy":"SYSTEM","CreatedOn":"2026-05-15T11:30:03.09","Email":"student@scanid.com","IsActive":true,"IsDeleted":false,"ModifiedBy":null,"ModifiedOn":"2026-05-16T19:42:52.4291887+05:30","Name":"Student","PasswordHash":"Password123","Role":"student","SchoolId":1,"Username":"student"}', N'["CreatedBy","CreatedOn","Email","IsActive","IsDeleted","ModifiedBy","ModifiedOn","Name","PasswordHash","Role","SchoolId","Username"]', N'{"Id":7}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (9, NULL, N'Create', N'Student', CAST(N'2026-05-17T18:53:15.3441922' AS DateTime2), NULL, N'{"ADDRESS":"N/A","AcademicYearId":2,"AdmissionTypeId":null,"BLOODGROUP":"","BloodGroupId":null,"CARDID":null,"CASTE":"","CATEGORY":null,"CITY":null,"CasteId":null,"CityId":null,"CreatedBy":"Super Admin","CreatedOn":"2026-05-17T18:53:15.3411674+05:30","DIV":"A","DOA":null,"DOB":"0043-03-31","DateofLeaving":null,"EMAIL":null,"EntryDate":null,"FATHERNAME":null,"FNAME":"Liam","GENDER":"Male","GRNO":"REG/2024/003","HouseId":null,"IQLD":null,"IsActive":true,"IsDeleted":false,"LCNo":null,"LNAME":"Wilson","Lastschool":null,"MNAME":"","MOBILE":"1234567890","MOTHERNAME":"Mary","ModifiedBy":"Super Admin","ModifiedOn":"2026-05-17T18:53:15.3411674+05:30","Name":"Liam  Wilson","Nationality":null,"PEN_No":null,"PIN":null,"ProfilePhotoPath":"","Progress":null,"RELIGION":"","RFID":"1232131341","ROLLNO":"1","Reasonforleaving":null,"RegistrationNumber":"REG/2024/003","ReligionId":null,"RollNumber":1,"SHIFTNAME":"AFTERNOON","STATE":null,"STD":"2nd","STUDENTID":"REG/2024/003","SchoolId":1,"SectionId":1,"ShiftId":2,"StandardId":2,"StateId":null,"Status":"Active","SubCasteId":null,"VALIDFROM":null,"VALIDTO":null,"aadharcard":"123456789145","academicyear":"2","accountname":null,"admissionstd":null,"admissiontype":"","apaar_id":null,"bankacc":null,"bankname":null,"birthcountry":null,"birthdistrict":null,"birthstate":null,"birthtaluka":null,"cid":null,"conduct":null,"contact2":"","dobwords":null,"feesinstallment":null,"fingerid":null,"freeshiptype":null,"house":"","ispromoted":null,"leftstatus":null,"mothertongue":null,"otp":null,"photo":null,"placeofbirth":null,"remark":null,"saralid":null,"schoolsection":null,"sms":"","stdstudying":null,"stdstudyingInWords":null,"subcaste":"","subjects":null,"uniformid":""}', NULL, N'{"Id":-2147482647}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (10, NULL, N'Update', N'User', CAST(N'2026-05-18T09:33:01.7714973' AS DateTime2), N'{"CreatedBy":"SYSTEM","CreatedOn":"2026-05-15T11:30:03.09","Email":"admin@scanid.com","IsActive":true,"IsDeleted":false,"ModifiedBy":null,"ModifiedOn":"2026-05-16T19:42:01.6758434","Name":"Admin","PasswordHash":"Password123","Role":"admin","RoleId":2,"SchoolId":1,"Username":"adminuser"}', N'{"CreatedBy":"SYSTEM","CreatedOn":"2026-05-15T11:30:03.09","Email":"admin@scanid.com","IsActive":true,"IsDeleted":false,"ModifiedBy":null,"ModifiedOn":"2026-05-18T09:33:01.7679117+05:30","Name":"Admin","PasswordHash":"Password123","Role":"teacher","RoleId":2,"SchoolId":1,"Username":"adminuser"}', N'["CreatedBy","CreatedOn","Email","IsActive","IsDeleted","ModifiedBy","ModifiedOn","Name","PasswordHash","Role","RoleId","SchoolId","Username"]', N'{"Id":2}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (11, NULL, N'Update', N'User', CAST(N'2026-05-18T09:33:08.6902377' AS DateTime2), N'{"CreatedBy":"SYSTEM","CreatedOn":"2026-05-15T11:30:03.09","Email":"admin@scanid.com","IsActive":true,"IsDeleted":false,"ModifiedBy":null,"ModifiedOn":"2026-05-18T09:33:01.7679117","Name":"Admin","PasswordHash":"Password123","Role":"teacher","RoleId":2,"SchoolId":1,"Username":"adminuser"}', N'{"CreatedBy":"SYSTEM","CreatedOn":"2026-05-15T11:30:03.09","Email":"admin@scanid.com","IsActive":true,"IsDeleted":false,"ModifiedBy":null,"ModifiedOn":"2026-05-18T09:33:08.6901572+05:30","Name":"Admin","PasswordHash":"Password123","Role":"admin","RoleId":2,"SchoolId":1,"Username":"adminuser"}', N'["CreatedBy","CreatedOn","Email","IsActive","IsDeleted","ModifiedBy","ModifiedOn","Name","PasswordHash","Role","RoleId","SchoolId","Username"]', N'{"Id":2}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (12, NULL, N'Create', N'Student', CAST(N'2026-05-18T09:43:26.9912788' AS DateTime2), NULL, N'{"ADDRESS":"N/A","AcademicYearId":2,"AdmissionTypeId":1,"BLOODGROUP":"1","BloodGroupId":1,"CARDID":null,"CASTE":"1","CATEGORY":null,"CITY":null,"CasteId":1,"CityId":null,"CreatedBy":"Super Admin","CreatedOn":"2026-05-18T09:43:26.9908959+05:30","DIV":"A","DOA":null,"DOB":"1984-12-04","DateofLeaving":null,"EMAIL":null,"EntryDate":null,"FATHERNAME":null,"FNAME":"Rajesh","GENDER":"Male","GRNO":"REG/2024/003","HouseId":1,"IQLD":null,"IsActive":true,"IsDeleted":false,"LCNo":null,"LNAME":"Patil","Lastschool":null,"MNAME":"Prakash","MOBILE":"4342342342","MOTHERNAME":"Mary","ModifiedBy":"Super Admin","ModifiedOn":"2026-05-18T09:43:26.9908959+05:30","Name":"Rajesh Prakash Patil","Nationality":null,"PEN_No":null,"PIN":null,"ProfilePhotoPath":"","Progress":null,"RELIGION":"1","RFID":"","ROLLNO":"1","Reasonforleaving":null,"RegistrationNumber":"REG/2024/003","ReligionId":1,"RollNumber":1,"SHIFTNAME":"MORNING","STATE":null,"STD":"1st","STUDENTID":"REG/2024/003","SchoolId":1,"SectionId":1,"ShiftId":1,"StandardId":1,"StateId":null,"Status":"Active","SubCasteId":null,"VALIDFROM":null,"VALIDTO":null,"aadharcard":"323232312312","academicyear":"2","accountname":null,"admissionstd":null,"admissiontype":"1","apaar_id":null,"bankacc":null,"bankname":null,"birthcountry":null,"birthdistrict":null,"birthstate":null,"birthtaluka":null,"cid":null,"conduct":null,"contact2":"","dobwords":null,"feesinstallment":null,"fingerid":null,"freeshiptype":null,"house":"1","ispromoted":null,"leftstatus":null,"mothertongue":null,"otp":null,"photo":null,"placeofbirth":null,"remark":null,"saralid":null,"schoolsection":null,"sms":"","stdstudying":null,"stdstudyingInWords":null,"subcaste":"","subjects":null,"uniformid":""}', NULL, N'{"Id":-2147482647}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (13, NULL, N'Update', N'Student', CAST(N'2026-05-19T09:46:32.2482900' AS DateTime2), N'{"ModifiedOn":"2026-05-16T16:34:45.5932742","ProfilePhotoPath":"/uploads/SCANID_PRIMARY_SCHOOL/1st/A/student_1_639145460855818671.jpeg"}', N'{"ModifiedOn":"2026-05-19T09:46:32.246675+05:30","ProfilePhotoPath":"/photos/1/student_1_639147807638284639.jpeg"}', N'["ModifiedOn","ProfilePhotoPath"]', N'{"Id":1}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (14, NULL, N'Update', N'Student', CAST(N'2026-05-19T09:46:48.9219257' AS DateTime2), N'{"ModifiedOn":"2026-05-19T09:46:32.246675","ProfilePhotoPath":"/photos/1/student_1_639147807638284639.jpeg"}', N'{"ModifiedOn":"2026-05-19T09:46:48.9217498+05:30","ProfilePhotoPath":"/photos/1/student_1_639147808089118227.jpeg"}', N'["ModifiedOn","ProfilePhotoPath"]', N'{"Id":1}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (15, NULL, N'Update', N'Student', CAST(N'2026-05-19T16:13:27.0055391' AS DateTime2), N'{"ModifiedOn":"2026-05-19T09:46:48.9217498","ProfilePhotoPath":""}', N'{"ModifiedOn":"2026-05-19T16:13:27.0041513+05:30","ProfilePhotoPath":"/photos/1/094676232810.jpeg"}', N'["ModifiedOn","ProfilePhotoPath"]', N'{"Id":1}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (16, NULL, N'Update', N'Student', CAST(N'2026-05-19T16:14:35.5749518' AS DateTime2), N'{"ModifiedOn":"2026-05-19T16:13:27.0041513","ProfilePhotoPath":"/photos/1/094676232810.jpeg"}', N'{"ModifiedOn":"2026-05-19T16:14:35.5747732+05:30","ProfilePhotoPath":"/photos/1/473217995953.jpeg"}', N'["ModifiedOn","ProfilePhotoPath"]', N'{"Id":1}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (17, NULL, N'Update', N'Student', CAST(N'2026-05-19T16:14:47.9477147' AS DateTime2), N'{"ModifiedOn":"2026-05-16T16:34:50.8556638","ProfilePhotoPath":""}', N'{"ModifiedOn":"2026-05-19T16:14:47.9476376+05:30","ProfilePhotoPath":"/photos/1/114023446323.jpeg"}', N'["ModifiedOn","ProfilePhotoPath"]', N'{"Id":2}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (18, NULL, N'Update', N'Teacher', CAST(N'2026-05-19T16:15:16.5960689' AS DateTime2), N'{"ProfilePhotoPath":null}', N'{"ProfilePhotoPath":"/uploads/teachers/teacher_1_639148041165817957.jpeg"}', N'["ProfilePhotoPath"]', N'{"Id":1}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (19, NULL, N'Update', N'School', CAST(N'2026-05-19T16:15:49.2392366' AS DateTime2), N'{"ModifiedOn":"2026-05-15T11:30:02.9066667","ProfilePhotoPath":null}', N'{"ModifiedOn":"2026-05-19T16:15:49.2391994+05:30","ProfilePhotoPath":"/uploads/schools/SCANID_PRIMARY_SCHOOL/school_1_639148041492360706.jpeg"}', N'["ModifiedOn","ProfilePhotoPath"]', N'{"Id":1}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (20, NULL, N'Create', N'SubCaste', CAST(N'2026-05-19T19:41:08.8810052' AS DateTime2), NULL, N'{"CasteId":1,"CreatedBy":null,"CreatedOn":"2026-05-19T19:41:08.8779407+05:30","IsActive":true,"IsDeleted":false,"ModifiedBy":null,"ModifiedOn":"2026-05-19T19:41:08.8779407+05:30","Name":"Hindu-Maratha"}', NULL, N'{"Id":-2147482647}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (21, NULL, N'Update', N'Student', CAST(N'2026-05-20T10:19:38.1942042' AS DateTime2), N'{"ModifiedOn":"2026-05-19T16:14:35.5747732","ProfilePhotoPath":"/photos/1/473217995953.jpeg"}', N'{"ModifiedOn":"2026-05-20T10:19:38.1899896+05:30","ProfilePhotoPath":"/photos/1/495479815988.jpeg"}', N'["ModifiedOn","ProfilePhotoPath"]', N'{"Id":1}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (22, NULL, N'Update', N'Student', CAST(N'2026-05-20T10:20:20.1524265' AS DateTime2), N'{"ModifiedOn":"2026-05-20T10:19:38.1899896","ProfilePhotoPath":"/photos/1/495479815988.jpeg"}', N'{"ModifiedOn":"2026-05-20T10:20:20.1522678+05:30","ProfilePhotoPath":"/photos/1/589551789604.jpeg"}', N'["ModifiedOn","ProfilePhotoPath"]', N'{"Id":1}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (23, NULL, N'Update', N'Student', CAST(N'2026-05-20T10:29:52.7660073' AS DateTime2), N'{"ModifiedOn":"2026-05-20T10:20:20.1522678","ProfilePhotoPath":"/photos/1/589551789604.jpeg"}', N'{"ModifiedOn":"2026-05-20T10:29:52.7659195+05:30","ProfilePhotoPath":"/photos/1/380877934933.png"}', N'["ModifiedOn","ProfilePhotoPath"]', N'{"Id":1}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (24, NULL, N'Update', N'Teacher', CAST(N'2026-05-20T10:34:46.8695394' AS DateTime2), N'{"ProfilePhotoPath":"/uploads/teachers/teacher_1_639148041165817957.jpeg"}', N'{"ProfilePhotoPath":"/uploads/teachers/teacher_1_639148700868518487.png"}', N'["ProfilePhotoPath"]', N'{"Id":1}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (25, NULL, N'Update', N'Student', CAST(N'2026-05-20T10:59:45.4476028' AS DateTime2), N'{"ModifiedOn":"2026-05-20T10:29:52.7659195","ProfilePhotoPath":"/photos/1/380877934933.png"}', N'{"ModifiedOn":"2026-05-20T10:59:45.4458755+05:30","ProfilePhotoPath":"/photos/1/358800024131.png"}', N'["ModifiedOn","ProfilePhotoPath"]', N'{"Id":1}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (26, NULL, N'Create', N'Student', CAST(N'2026-05-20T11:31:41.4800310' AS DateTime2), NULL, N'{"ADDRESS":"N/A","AcademicYearId":2,"AdmissionTypeId":1,"BloodGroupId":1,"CARDID":null,"CasteId":1,"CategoryId":null,"CityId":null,"CreatedBy":"Super Admin","CreatedOn":"2026-05-20T11:31:41.4769865+05:30","DOA":null,"DOB":"2026-02-01","DateofLeaving":null,"EMAIL":null,"EntryDate":null,"FATHERNAME":null,"FNAME":"Liam","GENDER":"Male","GRNO":"REG/2024/003","HouseId":1,"IQLD":null,"IsActive":true,"IsDeleted":false,"LCNo":null,"LNAME":"Wilson","Lastschool":null,"MNAME":"","MOBILE":"1234567890","MOTHERNAME":"Mary","ModifiedBy":"Super Admin","ModifiedOn":"2026-05-20T11:31:41.4769865+05:30","Name":"Liam  Wilson","Nationality":null,"PEN_No":null,"PIN":null,"ProfilePhotoPath":"","Progress":null,"RFID":"32423423423423423423","Reasonforleaving":null,"RegistrationNumber":"REG/2024/003","ReligionId":1,"RollNumber":1,"STUDENTID":"REG/2024/003","SchoolId":2,"SectionId":1,"ShiftId":1,"StandardId":1,"StateId":null,"Status":"Active","SubCasteId":1,"VALIDFROM":null,"VALIDTO":null,"aadharcard":"123456789145","accountname":null,"admissionstd":null,"apaar_id":null,"bankacc":null,"bankname":null,"birthcountry":null,"birthdistrict":null,"birthstate":null,"birthtaluka":null,"cid":null,"conduct":null,"dobwords":null,"feesinstallment":null,"fingerid":null,"freeshiptype":null,"leftstatus":null,"mothertongue":null,"otp":null,"placeofbirth":null,"remark":null,"saralid":null,"schoolsection":null,"sms":"","stdstudyingInWords":null,"subjects":null,"uniformid":""}', NULL, N'{"Id":-2147482647}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (27, NULL, N'Update', N'Student', CAST(N'2026-05-20T11:31:41.9125416' AS DateTime2), N'{"ModifiedOn":"2026-05-20T11:31:41.4769865","ProfilePhotoPath":""}', N'{"ModifiedOn":"2026-05-20T11:31:41.9123754+05:30","ProfilePhotoPath":"/photos/2/734336230573.png"}', N'["ModifiedOn","ProfilePhotoPath"]', N'{"Id":5}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (28, NULL, N'Update', N'Student', CAST(N'2026-05-20T11:32:23.8203574' AS DateTime2), N'{"ModifiedOn":"2026-05-20T11:31:41.9123754","ProfilePhotoPath":"/photos/2/734336230573.png"}', N'{"ModifiedOn":"2026-05-20T11:32:23.8202626+05:30","ProfilePhotoPath":"/photos/2/951013660322.png"}', N'["ModifiedOn","ProfilePhotoPath"]', N'{"Id":5}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (29, NULL, N'Update', N'Student', CAST(N'2026-05-20T11:32:26.3270606' AS DateTime2), N'{"ADDRESS":"N/A","AcademicYearId":2,"AdmissionTypeId":1,"BloodGroupId":1,"CARDID":null,"CasteId":1,"CategoryId":null,"CityId":null,"CreatedBy":null,"CreatedOn":"2026-05-20T11:32:26.2762214+05:30","DOA":null,"DOB":"2026-02-01","DateofLeaving":null,"EMAIL":null,"EntryDate":null,"FATHERNAME":null,"FNAME":"Liam","GENDER":"Male","GRNO":"REG/2024/003","HouseId":1,"IQLD":null,"IsActive":true,"IsDeleted":false,"LCNo":null,"LNAME":"Wilson","Lastschool":null,"MNAME":"","MOBILE":"1234567890","MOTHERNAME":"Mary","ModifiedBy":"Super Admin","ModifiedOn":"2026-05-20T11:32:26.2762221+05:30","Name":"Liam  Wilson","Nationality":null,"PEN_No":null,"PIN":null,"ProfilePhotoPath":"/photos/2/951013660322.png","Progress":null,"RFID":"32423423423423423423","Reasonforleaving":null,"RegistrationNumber":"REG/2024/003","ReligionId":1,"RollNumber":1,"STUDENTID":"REG/2024/003","SchoolId":2,"SectionId":1,"ShiftId":1,"StandardId":1,"StateId":null,"Status":"Active","SubCasteId":1,"VALIDFROM":null,"VALIDTO":null,"aadharcard":"123456789145","accountname":null,"admissionstd":null,"apaar_id":null,"bankacc":null,"bankname":null,"birthcountry":null,"birthdistrict":null,"birthstate":null,"birthtaluka":null,"cid":null,"conduct":null,"dobwords":null,"feesinstallment":null,"fingerid":null,"freeshiptype":null,"leftstatus":null,"mothertongue":null,"otp":null,"placeofbirth":null,"remark":null,"saralid":null,"schoolsection":null,"sms":"","stdstudyingInWords":null,"subjects":null,"uniformid":""}', N'{"ADDRESS":"N/A","AcademicYearId":2,"AdmissionTypeId":1,"BloodGroupId":1,"CARDID":null,"CasteId":1,"CategoryId":null,"CityId":null,"CreatedBy":null,"CreatedOn":"2026-05-20T11:32:26.2762214+05:30","DOA":null,"DOB":"2026-02-01","DateofLeaving":null,"EMAIL":null,"EntryDate":null,"FATHERNAME":null,"FNAME":"Liam","GENDER":"Male","GRNO":"REG/2024/003","HouseId":1,"IQLD":null,"IsActive":true,"IsDeleted":false,"LCNo":null,"LNAME":"Wilson","Lastschool":null,"MNAME":"","MOBILE":"1234567890","MOTHERNAME":"Mary","ModifiedBy":"Super Admin","ModifiedOn":"2026-05-20T11:32:26.3268934+05:30","Name":"Liam  Wilson","Nationality":null,"PEN_No":null,"PIN":null,"ProfilePhotoPath":"/photos/2/951013660322.png","Progress":null,"RFID":"32423423423423423423","Reasonforleaving":null,"RegistrationNumber":"REG/2024/003","ReligionId":1,"RollNumber":1,"STUDENTID":"REG/2024/003","SchoolId":2,"SectionId":1,"ShiftId":1,"StandardId":1,"StateId":null,"Status":"Active","SubCasteId":1,"VALIDFROM":null,"VALIDTO":null,"aadharcard":"123456789145","accountname":null,"admissionstd":null,"apaar_id":null,"bankacc":null,"bankname":null,"birthcountry":null,"birthdistrict":null,"birthstate":null,"birthtaluka":null,"cid":null,"conduct":null,"dobwords":null,"feesinstallment":null,"fingerid":null,"freeshiptype":null,"leftstatus":null,"mothertongue":null,"otp":null,"placeofbirth":null,"remark":null,"saralid":null,"schoolsection":null,"sms":"","stdstudyingInWords":null,"subjects":null,"uniformid":""}', N'["ADDRESS","AcademicYearId","AdmissionTypeId","BloodGroupId","CARDID","CasteId","CategoryId","CityId","CreatedBy","CreatedOn","DOA","DOB","DateofLeaving","EMAIL","EntryDate","FATHERNAME","FNAME","GENDER","GRNO","HouseId","IQLD","IsActive","IsDeleted","LCNo","LNAME","Lastschool","MNAME","MOBILE","MOTHERNAME","ModifiedBy","ModifiedOn","Name","Nationality","PEN_No","PIN","ProfilePhotoPath","Progress","RFID","Reasonforleaving","RegistrationNumber","ReligionId","RollNumber","STUDENTID","SchoolId","SectionId","ShiftId","StandardId","StateId","Status","SubCasteId","VALIDFROM","VALIDTO","aadharcard","accountname","admissionstd","apaar_id","bankacc","bankname","birthcountry","birthdistrict","birthstate","birthtaluka","cid","conduct","dobwords","feesinstallment","fingerid","freeshiptype","leftstatus","mothertongue","otp","placeofbirth","remark","saralid","schoolsection","sms","stdstudyingInWords","subjects","uniformid"]', N'{"Id":5}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (30, NULL, N'Create', N'Teacher', CAST(N'2026-05-20T11:34:40.3772801' AS DateTime2), NULL, N'{"ContactNumber":"2132131232","CreatedBy":"Super Admin","CreatedOn":"2026-05-20T11:34:40.3772256+05:30","Department":"Mathematics","EmployeeId":"EMP-1779257080279","IsActive":true,"IsDeleted":false,"ModifiedBy":"Super Admin","ModifiedOn":"2026-05-20T11:34:40.3772256+05:30","ProfilePhotoPath":"","Qualification":"PhD","SchoolId":2,"Status":"Active","UserId":-2147482647}', NULL, N'{"Id":-2147482647}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (31, NULL, N'Create', N'User', CAST(N'2026-05-20T11:34:40.3774109' AS DateTime2), NULL, N'{"CreatedBy":null,"CreatedOn":"2026-05-20T11:34:40.3772612+05:30","Email":"faculty@colloege.com","IsActive":true,"IsDeleted":false,"ModifiedBy":null,"ModifiedOn":"2026-05-20T11:34:40.3772612+05:30","Name":"Robert Smith","PasswordHash":"temp123","Role":"teacher","RoleId":null,"SchoolId":2,"Username":"faculty1779257080279"}', NULL, N'{"Id":-2147482647}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (32, NULL, N'Update', N'Teacher', CAST(N'2026-05-20T11:34:40.5097489' AS DateTime2), N'{"ProfilePhotoPath":""}', N'{"ProfilePhotoPath":"/uploads/teachers/teacher_2_639148736805074081.png"}', N'["ProfilePhotoPath"]', N'{"Id":2}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (33, NULL, N'Update', N'Teacher', CAST(N'2026-05-20T11:35:04.3756766' AS DateTime2), N'{"ProfilePhotoPath":"/uploads/teachers/teacher_2_639148736805074081.png"}', N'{"ProfilePhotoPath":"/uploads/teachers/teacher_2_639148737043740528.png"}', N'["ProfilePhotoPath"]', N'{"Id":2}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (34, NULL, N'Update', N'Teacher', CAST(N'2026-05-20T11:35:23.9503104' AS DateTime2), N'{"ProfilePhotoPath":"/uploads/teachers/teacher_2_639148737043740528.png"}', N'{"ProfilePhotoPath":"/uploads/teachers/teacher_2_639148737239443797.png"}', N'["ProfilePhotoPath"]', N'{"Id":2}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (35, NULL, N'Update', N'Teacher', CAST(N'2026-05-20T11:35:33.1765401' AS DateTime2), N'{"ProfilePhotoPath":"/uploads/teachers/teacher_2_639148737239443797.png"}', N'{"ProfilePhotoPath":"/uploads/teachers/teacher_2_639148737331709655.png"}', N'["ProfilePhotoPath"]', N'{"Id":2}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (36, NULL, N'Create', N'School', CAST(N'2026-05-20T11:39:39.4771500' AS DateTime2), NULL, N'{"Address":"C-201, Ishwati Prasad C.H.S. Dattaram lad marg, Kalachowki, Mumbai - 400033.","Code":null,"CreatedBy":null,"CreatedOn":"2026-05-20T11:39:39.4771338+05:30","Email":"","IsActive":true,"IsDeleted":false,"ModifiedBy":null,"ModifiedOn":"2026-05-20T11:39:39.4771338+05:30","Name":"Ahilya Vidya Mandir","Phone":"","ProfilePhotoPath":null,"Status":"Active","TotalStudents":0}', NULL, N'{"Id":-2147482647}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (37, NULL, N'Update', N'School', CAST(N'2026-05-20T11:42:36.7415297' AS DateTime2), N'{"ModifiedOn":"2026-05-20T11:39:39.4771338","ProfilePhotoPath":null}', N'{"ModifiedOn":"2026-05-20T11:42:36.7414945+05:30","ProfilePhotoPath":"/uploads/schools/Ahilya_Vidya_Mandir/school_3_639148741567394383.png"}', N'["ModifiedOn","ProfilePhotoPath"]', N'{"Id":3}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (38, NULL, N'Update', N'School', CAST(N'2026-05-20T11:57:02.1728667' AS DateTime2), N'{"ModifiedOn":"2026-05-15T11:30:02.9266667","ProfilePhotoPath":null}', N'{"ModifiedOn":"2026-05-20T11:57:02.1714206+05:30","ProfilePhotoPath":"/uploads/schools/SCANID_SECONDARY_HIGH_SCHOOL/school_2_639148750221260050.png"}', N'["ModifiedOn","ProfilePhotoPath"]', N'{"Id":2}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (39, NULL, N'Update', N'School', CAST(N'2026-05-20T11:57:10.8008859' AS DateTime2), N'{"ProfilePhotoPath":"/uploads/schools/SCANID_SECONDARY_HIGH_SCHOOL/school_2_639148750221260050.png"}', N'{"ProfilePhotoPath":null}', N'["ProfilePhotoPath"]', N'{"Id":2}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (40, NULL, N'Update', N'School', CAST(N'2026-05-20T11:57:58.7477851' AS DateTime2), N'{"ModifiedOn":"2026-05-20T11:57:10.8008516","ProfilePhotoPath":null}', N'{"ModifiedOn":"2026-05-20T11:57:58.7477438+05:30","ProfilePhotoPath":"/uploads/schools/SCANID_SECONDARY_HIGH_SCHOOL/school_2_639148750787397024.png"}', N'["ModifiedOn","ProfilePhotoPath"]', N'{"Id":2}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (41, NULL, N'Update', N'School', CAST(N'2026-05-20T11:58:04.1880675' AS DateTime2), N'{"ProfilePhotoPath":"/uploads/schools/SCANID_SECONDARY_HIGH_SCHOOL/school_2_639148750787397024.png"}', N'{"ProfilePhotoPath":null}', N'["ProfilePhotoPath"]', N'{"Id":2}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (42, NULL, N'Create', N'School', CAST(N'2026-05-20T12:00:04.3271313' AS DateTime2), NULL, N'{"Address":"C-201, Ishwati Prasad C.H.S. Dattaram lad marg, Kalachowki, Mumbai - 400033.","Code":null,"CreatedBy":null,"CreatedOn":"2026-05-20T12:00:04.3269826+05:30","Email":"devendraparte2001@gmail.com","IsActive":true,"IsDeleted":false,"ModifiedBy":null,"ModifiedOn":"2026-05-20T12:00:04.3269826+05:30","Name":"Ahilya Vidya Mandir","Phone":"","ProfilePhotoPath":null,"Status":"Active","TotalStudents":0}', NULL, N'{"Id":-2147482647}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (43, NULL, N'Update', N'School', CAST(N'2026-05-20T12:00:04.4626321' AS DateTime2), N'{"ModifiedOn":"2026-05-20T12:00:04.3269826","ProfilePhotoPath":null}', N'{"ModifiedOn":"2026-05-20T12:00:04.462616+05:30","ProfilePhotoPath":"/uploads/schools/Ahilya_Vidya_Mandir/school_4_639148752044586605.png"}', N'["ModifiedOn","ProfilePhotoPath"]', N'{"Id":4}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (44, NULL, N'Update', N'School', CAST(N'2026-05-20T12:00:22.1511768' AS DateTime2), N'{"ModifiedOn":"2026-05-20T12:00:04.462616","ProfilePhotoPath":"/uploads/schools/Ahilya_Vidya_Mandir/school_4_639148752044586605.png"}', N'{"ModifiedOn":"2026-05-20T12:00:22.1511584+05:30","ProfilePhotoPath":"/uploads/schools/Ahilya_Vidya_Mandir/school_4_639148752221455747.png"}', N'["ModifiedOn","ProfilePhotoPath"]', N'{"Id":4}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (45, NULL, N'Update', N'School', CAST(N'2026-05-20T12:00:26.4972614' AS DateTime2), N'{"ProfilePhotoPath":"/uploads/schools/Ahilya_Vidya_Mandir/school_4_639148752221455747.png"}', N'{"ProfilePhotoPath":null}', N'["ProfilePhotoPath"]', N'{"Id":4}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (46, NULL, N'Update', N'Teacher', CAST(N'2026-05-20T12:03:43.8407560' AS DateTime2), N'{"ProfilePhotoPath":"/uploads/teachers/teacher_2_639148737331709655.png"}', N'{"ProfilePhotoPath":"/uploads/teachers/teacher_2_639148754238226093.png"}', N'["ProfilePhotoPath"]', N'{"Id":2}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (47, NULL, N'Update', N'Teacher', CAST(N'2026-05-20T14:25:03.8975875' AS DateTime2), N'{"Department":null}', N'{"Department":"N/A"}', N'["Department"]', N'{"Id":1}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (48, NULL, N'Update', N'User', CAST(N'2026-05-20T14:25:03.9365426' AS DateTime2), N'{"Name":"Teacher"}', N'{"Name":"Teacher1 Teacher"}', N'["Name"]', N'{"Id":3}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (49, NULL, N'Update', N'School', CAST(N'2026-05-20T14:25:49.0410742' AS DateTime2), N'{"ModifiedOn":"2026-05-20T12:00:26.4972368","ProfilePhotoPath":null}', N'{"ModifiedOn":"2026-05-20T14:25:49.04104+05:30","ProfilePhotoPath":"/uploads/schools/Ahilya_Vidya_Mandir/school_4_639148839490204735.png"}', N'["ModifiedOn","ProfilePhotoPath"]', N'{"Id":4}')
GO
INSERT [dbo].[AuditLogs] ([Id], [UserId], [Type], [TableName], [DateTime], [OldValues], [NewValues], [AffectedColumns], [PrimaryKey]) VALUES (50, NULL, N'Update', N'School', CAST(N'2026-05-20T14:26:38.9050802' AS DateTime2), N'{"ModifiedOn":"2026-05-20T11:58:04.1880371","ProfilePhotoPath":null}', N'{"ModifiedOn":"2026-05-20T14:26:38.9050572+05:30","ProfilePhotoPath":"/uploads/schools/SCANID_SECONDARY_HIGH_SCHOOL/school_2_639148839989026960.png"}', N'["ModifiedOn","ProfilePhotoPath"]', N'{"Id":2}')
GO
SET IDENTITY_INSERT [dbo].[AuditLogs] OFF
GO
SET IDENTITY_INSERT [dbo].[BloodGroups] ON 
GO
INSERT [dbo].[BloodGroups] ([Id], [Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (1, N'A+', 1, 0, NULL, CAST(N'2026-05-15T11:30:03.0400000' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:03.0400000' AS DateTime2))
GO
INSERT [dbo].[BloodGroups] ([Id], [Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (2, N'B+', 1, 0, NULL, CAST(N'2026-05-15T11:30:03.0400000' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:03.0400000' AS DateTime2))
GO
INSERT [dbo].[BloodGroups] ([Id], [Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (3, N'O+', 1, 0, NULL, CAST(N'2026-05-15T11:30:03.0400000' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:03.0400000' AS DateTime2))
GO
INSERT [dbo].[BloodGroups] ([Id], [Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (4, N'AB+', 1, 0, NULL, CAST(N'2026-05-15T11:30:03.0400000' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:03.0400000' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[BloodGroups] OFF
GO
SET IDENTITY_INSERT [dbo].[Castes] ON 
GO
INSERT [dbo].[Castes] ([Id], [Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (1, N'OPEN', 1, 0, NULL, CAST(N'2026-05-15T11:30:03.0166667' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:03.0166667' AS DateTime2))
GO
INSERT [dbo].[Castes] ([Id], [Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (2, N'OBC', 1, 0, NULL, CAST(N'2026-05-15T11:30:03.0166667' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:03.0166667' AS DateTime2))
GO
INSERT [dbo].[Castes] ([Id], [Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (3, N'SC', 1, 0, NULL, CAST(N'2026-05-15T11:30:03.0166667' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:03.0166667' AS DateTime2))
GO
INSERT [dbo].[Castes] ([Id], [Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (4, N'ST', 1, 0, NULL, CAST(N'2026-05-15T11:30:03.0166667' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:03.0166667' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[Castes] OFF
GO
SET IDENTITY_INSERT [dbo].[ErrorLogs] ON 
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (1, N'Database connection timeout', N'Error', CAST(N'2026-05-15T09:28:45.0900000' AS DateTime2), N'System.Data.SqlClient.SqlException: Timeout expired', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (2, N'Null reference exception in student service', N'Error', CAST(N'2026-05-15T10:28:45.0900000' AS DateTime2), N'System.NullReferenceException: Object reference not set to an instance of an object', N'Path: /api/students/5')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (3, N'Invalid operation: Duplicate entry', N'Warning', CAST(N'2026-05-15T10:58:45.0900000' AS DateTime2), N'System.InvalidOperationException: Sequence contains no matching element', N'Path: /api/marks')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (4, N'Authentication failed for user', N'Error', CAST(N'2026-05-15T11:28:45.0900000' AS DateTime2), N'System.UnauthorizedAccessException: Access denied', N'Path: /api/auth/login')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (5, N'Database constraint violation', N'Error', CAST(N'2026-05-15T11:13:45.0900000' AS DateTime2), N'System.Data.DbUpdateException: An error occurred while updating the entries', N'Path: /api/fees')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (6, N'Data is Null. This method or property cannot be called on Null values.', N'Error', CAST(N'2026-05-15T17:09:53.5018113' AS DateTime2), N'System.Data.SqlTypes.SqlNullValueException: Data is Null. This method or property cannot be called on Null values.
   at Microsoft.Data.SqlClient.SqlBuffer.ThrowIfNull()
   at Microsoft.Data.SqlClient.SqlBuffer.get_String()
   at Microsoft.Data.SqlClient.SqlDataReader.GetString(Int32 i)
   at lambda_method143(Closure, QueryContext, DbDataReader, ResultContext, SingleQueryResultCoordinator)
   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.MoveNextAsync()
   at Microsoft.EntityFrameworkCore.Query.ShapedQueryCompilingExpressionVisitor.SingleOrDefaultAsync[TSource](IAsyncEnumerable`1 asyncEnumerable, CancellationToken cancellationToken)
   at Microsoft.EntityFrameworkCore.Query.ShapedQueryCompilingExpressionVisitor.SingleOrDefaultAsync[TSource](IAsyncEnumerable`1 asyncEnumerable, CancellationToken cancellationToken)
   at ScanID.Api.Controllers.AuthController.Login(LoginRequest request) in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Controllers\AuthController.cs:line 30
   at lambda_method137(Closure, Object)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ActionMethodExecutor.AwaitableObjectResultExecutor.Execute(ActionContext actionContext, IActionResultTypeMapper mapper, ObjectMethodExecutor executor, Object controller, Object[] arguments)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.<InvokeActionMethodAsync>g__Awaited|12_0(ControllerActionInvoker invoker, ValueTask`1 actionResultValueTask)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.<InvokeNextActionFilterAsync>g__Awaited|10_0(ControllerActionInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.Rethrow(ActionExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.Next(State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.<InvokeInnerFilterAsync>g__Awaited|13_0(ControllerActionInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_3>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 44', N'Path: /api/auth/login')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (7, N'A possible object cycle was detected. This can either be due to a cycle or if the object depth is larger than the maximum allowed depth of 32. Consider using ReferenceHandler.Preserve on JsonSerializerOptions to support cycles. Path: $.data.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItemId.', N'Error', CAST(N'2026-05-15T17:38:54.4183418' AS DateTime2), N'System.Text.Json.JsonException: A possible object cycle was detected. This can either be due to a cycle or if the object depth is larger than the maximum allowed depth of 32. Consider using ReferenceHandler.Preserve on JsonSerializerOptions to support cycles. Path: $.data.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItemId.
   at System.Text.Json.ThrowHelper.ThrowJsonException_SerializerCycleDetected(Int32 maxDepth)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.ListOfTConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.WriteCore(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo`1.SerializeAsync(Stream utf8Json, T rootValue, CancellationToken cancellationToken, Object rootValueBoxed)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo`1.SerializeAsync(Stream utf8Json, T rootValue, CancellationToken cancellationToken, Object rootValueBoxed)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo`1.SerializeAsync(Stream utf8Json, T rootValue, CancellationToken cancellationToken, Object rootValueBoxed)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_3>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 44', N'Path: /api/navigation')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (8, N'A possible object cycle was detected. This can either be due to a cycle or if the object depth is larger than the maximum allowed depth of 32. Consider using ReferenceHandler.Preserve on JsonSerializerOptions to support cycles. Path: $.data.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItemId.', N'Error', CAST(N'2026-05-15T17:40:38.1812513' AS DateTime2), N'System.Text.Json.JsonException: A possible object cycle was detected. This can either be due to a cycle or if the object depth is larger than the maximum allowed depth of 32. Consider using ReferenceHandler.Preserve on JsonSerializerOptions to support cycles. Path: $.data.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItemId.
   at System.Text.Json.ThrowHelper.ThrowJsonException_SerializerCycleDetected(Int32 maxDepth)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.ListOfTConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.WriteCore(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo`1.SerializeAsync(Stream utf8Json, T rootValue, CancellationToken cancellationToken, Object rootValueBoxed)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo`1.SerializeAsync(Stream utf8Json, T rootValue, CancellationToken cancellationToken, Object rootValueBoxed)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo`1.SerializeAsync(Stream utf8Json, T rootValue, CancellationToken cancellationToken, Object rootValueBoxed)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_3>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 44', N'Path: /api/navigation')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (9, N'A possible object cycle was detected. This can either be due to a cycle or if the object depth is larger than the maximum allowed depth of 32. Consider using ReferenceHandler.Preserve on JsonSerializerOptions to support cycles. Path: $.data.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItemId.', N'Error', CAST(N'2026-05-15T17:41:12.6855574' AS DateTime2), N'System.Text.Json.JsonException: A possible object cycle was detected. This can either be due to a cycle or if the object depth is larger than the maximum allowed depth of 32. Consider using ReferenceHandler.Preserve on JsonSerializerOptions to support cycles. Path: $.data.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItemId.
   at System.Text.Json.ThrowHelper.ThrowJsonException_SerializerCycleDetected(Int32 maxDepth)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.ListOfTConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.WriteCore(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo`1.SerializeAsync(Stream utf8Json, T rootValue, CancellationToken cancellationToken, Object rootValueBoxed)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo`1.SerializeAsync(Stream utf8Json, T rootValue, CancellationToken cancellationToken, Object rootValueBoxed)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo`1.SerializeAsync(Stream utf8Json, T rootValue, CancellationToken cancellationToken, Object rootValueBoxed)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_3>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 44', N'Path: /api/Navigation')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (10, N'A possible object cycle was detected. This can either be due to a cycle or if the object depth is larger than the maximum allowed depth of 32. Consider using ReferenceHandler.Preserve on JsonSerializerOptions to support cycles. Path: $.data.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItemId.', N'Error', CAST(N'2026-05-15T17:41:52.3773918' AS DateTime2), N'System.Text.Json.JsonException: A possible object cycle was detected. This can either be due to a cycle or if the object depth is larger than the maximum allowed depth of 32. Consider using ReferenceHandler.Preserve on JsonSerializerOptions to support cycles. Path: $.data.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItem.NavigationRoles.NavigationItemId.
   at System.Text.Json.ThrowHelper.ThrowJsonException_SerializerCycleDetected(Int32 maxDepth)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.IEnumerableDefaultConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Converters.ListOfTConverter`2.OnWriteResume(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonCollectionConverter`2.OnTryWrite(Utf8JsonWriter writer, TCollection value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonPropertyInfo`1.GetMemberAndWriteJson(Object obj, WriteStack& state, Utf8JsonWriter writer)
   at System.Text.Json.Serialization.Converters.ObjectDefaultConverter`1.OnTryWrite(Utf8JsonWriter writer, T value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.TryWrite(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.JsonConverter`1.WriteCore(Utf8JsonWriter writer, T& value, JsonSerializerOptions options, WriteStack& state)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo`1.SerializeAsync(Stream utf8Json, T rootValue, CancellationToken cancellationToken, Object rootValueBoxed)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo`1.SerializeAsync(Stream utf8Json, T rootValue, CancellationToken cancellationToken, Object rootValueBoxed)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo`1.SerializeAsync(Stream utf8Json, T rootValue, CancellationToken cancellationToken, Object rootValueBoxed)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_3>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 44', N'Path: /api/Navigation')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (11, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T09:44:29.8022646' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (12, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T09:57:28.1137376' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (13, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T09:57:28.1911277' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (14, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:01:06.0808686' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (15, N'Execution Timeout Expired.  The timeout period elapsed prior to completion of the operation or the server is not responding.', N'Error', CAST(N'2026-05-19T10:04:13.0941653' AS DateTime2), N'Microsoft.Data.SqlClient.SqlException (0x80131904): Execution Timeout Expired.  The timeout period elapsed prior to completion of the operation or the server is not responding.
 ---> System.ComponentModel.Win32Exception (258): The wait operation timed out.
   at Microsoft.Data.SqlClient.SqlCommand.<>c.<ExecuteDbDataReaderAsync>b__209_0(Task`1 result)
   at System.Threading.Tasks.ContinuationResultTaskFromResultTask`2.InnerInvoke()
   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)
--- End of stack trace from previous location ---
   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)
   at System.Threading.Tasks.Task.ExecuteWithThreadLocal(Task& currentTaskSlot, Thread threadPoolThread)
--- End of stack trace from previous location ---
   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)
   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)
   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.InitializeReaderAsync(AsyncEnumerator enumerator, CancellationToken cancellationToken)
   at Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal.SqlServerExecutionStrategy.ExecuteAsync[TState,TResult](TState state, Func`4 operation, Func`4 verifySucceeded, CancellationToken cancellationToken)
   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.MoveNextAsync()
   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)
   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)
   at ScanID.Api.Controllers.SchoolsController.GetSchools() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Controllers\SchoolsController.cs:line 32
   at lambda_method1583(Closure, Object)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ActionMethodExecutor.AwaitableObjectResultExecutor.Execute(ActionContext actionContext, IActionResultTypeMapper mapper, ObjectMethodExecutor executor, Object controller, Object[] arguments)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.<InvokeActionMethodAsync>g__Awaited|12_0(ControllerActionInvoker invoker, ValueTask`1 actionResultValueTask)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.<InvokeNextActionFilterAsync>g__Awaited|10_0(ControllerActionInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.Rethrow(ActionExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.Next(State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.<InvokeInnerFilterAsync>g__Awaited|13_0(ControllerActionInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49
ClientConnectionId:c4c542ec-11e6-4b1a-8013-8ad1febca982
Error Number:-2,State:0,Class:11', N'Path: /api/schools')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (16, N'Execution Timeout Expired.  The timeout period elapsed prior to completion of the operation or the server is not responding.', N'Error', CAST(N'2026-05-19T10:04:13.1180511' AS DateTime2), N'Microsoft.Data.SqlClient.SqlException (0x80131904): Execution Timeout Expired.  The timeout period elapsed prior to completion of the operation or the server is not responding.
 ---> System.ComponentModel.Win32Exception (258): The wait operation timed out.
   at Microsoft.Data.SqlClient.SqlCommand.<>c.<ExecuteDbDataReaderAsync>b__209_0(Task`1 result)
   at System.Threading.Tasks.ContinuationResultTaskFromResultTask`2.InnerInvoke()
   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)
--- End of stack trace from previous location ---
   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)
   at System.Threading.Tasks.Task.ExecuteWithThreadLocal(Task& currentTaskSlot, Thread threadPoolThread)
--- End of stack trace from previous location ---
   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)
   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)
   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.InitializeReaderAsync(AsyncEnumerator enumerator, CancellationToken cancellationToken)
   at Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal.SqlServerExecutionStrategy.ExecuteAsync[TState,TResult](TState state, Func`4 operation, Func`4 verifySucceeded, CancellationToken cancellationToken)
   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.MoveNextAsync()
   at Microsoft.EntityFrameworkCore.Query.ShapedQueryCompilingExpressionVisitor.SingleOrDefaultAsync[TSource](IAsyncEnumerable`1 asyncEnumerable, CancellationToken cancellationToken)
   at Microsoft.EntityFrameworkCore.Query.ShapedQueryCompilingExpressionVisitor.SingleOrDefaultAsync[TSource](IAsyncEnumerable`1 asyncEnumerable, CancellationToken cancellationToken)
   at ScanID.Api.Controllers.StudentsController.GetStudents(Nullable`1 schoolId, Nullable`1 academicYearId) in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Controllers\StudentsController.cs:line 50
   at lambda_method8(Closure, Object)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ActionMethodExecutor.AwaitableObjectResultExecutor.Execute(ActionContext actionContext, IActionResultTypeMapper mapper, ObjectMethodExecutor executor, Object controller, Object[] arguments)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.<InvokeActionMethodAsync>g__Awaited|12_0(ControllerActionInvoker invoker, ValueTask`1 actionResultValueTask)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.<InvokeNextActionFilterAsync>g__Awaited|10_0(ControllerActionInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.Rethrow(ActionExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.Next(State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.<InvokeInnerFilterAsync>g__Awaited|13_0(ControllerActionInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49
ClientConnectionId:a6e9568a-dc7f-4127-80b2-69a6502564f1
Error Number:-2,State:0,Class:11', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (17, N'Execution Timeout Expired.  The timeout period elapsed prior to completion of the operation or the server is not responding.', N'Error', CAST(N'2026-05-19T10:04:13.1187108' AS DateTime2), N'Microsoft.Data.SqlClient.SqlException (0x80131904): Execution Timeout Expired.  The timeout period elapsed prior to completion of the operation or the server is not responding.
 ---> System.ComponentModel.Win32Exception (258): The wait operation timed out.
   at Microsoft.Data.SqlClient.SqlCommand.<>c.<ExecuteDbDataReaderAsync>b__209_0(Task`1 result)
   at System.Threading.Tasks.ContinuationResultTaskFromResultTask`2.InnerInvoke()
   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)
--- End of stack trace from previous location ---
   at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state)
   at System.Threading.Tasks.Task.ExecuteWithThreadLocal(Task& currentTaskSlot, Thread threadPoolThread)
--- End of stack trace from previous location ---
   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)
   at Microsoft.EntityFrameworkCore.Storage.RelationalCommand.ExecuteReaderAsync(RelationalCommandParameterObject parameterObject, CancellationToken cancellationToken)
   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.InitializeReaderAsync(AsyncEnumerator enumerator, CancellationToken cancellationToken)
   at Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal.SqlServerExecutionStrategy.ExecuteAsync[TState,TResult](TState state, Func`4 operation, Func`4 verifySucceeded, CancellationToken cancellationToken)
   at Microsoft.EntityFrameworkCore.Query.Internal.SingleQueryingEnumerable`1.AsyncEnumerator.MoveNextAsync()
   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)
   at Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ToListAsync[TSource](IQueryable`1 source, CancellationToken cancellationToken)
   at ScanID.Api.Controllers.MastersController.GetAll[T](DbSet`1 dbSet) in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Controllers\MastersController.cs:line 26
   at ScanID.Api.Controllers.MastersController.GetAcademicYears() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Controllers\MastersController.cs:line 116
   at lambda_method1590(Closure, Object)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ActionMethodExecutor.AwaitableObjectResultExecutor.Execute(ActionContext actionContext, IActionResultTypeMapper mapper, ObjectMethodExecutor executor, Object controller, Object[] arguments)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.<InvokeActionMethodAsync>g__Awaited|12_0(ControllerActionInvoker invoker, ValueTask`1 actionResultValueTask)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.<InvokeNextActionFilterAsync>g__Awaited|10_0(ControllerActionInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.Rethrow(ActionExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.Next(State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ControllerActionInvoker.<InvokeInnerFilterAsync>g__Awaited|13_0(ControllerActionInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49
ClientConnectionId:78adb631-76aa-415e-92e4-3584ca2144f8
Error Number:-2,State:0,Class:11', N'Path: /api/masters/academic-years')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (18, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:07:20.5039411' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49
--- End of stack trace from previous location ---
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (19, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:07:20.5062092' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49
--- End of stack trace from previous location ---
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (20, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:10:59.7229564' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (21, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:11:01.4145061' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (22, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:13:02.8705686' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (23, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:13:04.0516969' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (24, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:14:50.6592463' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (25, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:14:50.9947598' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (26, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:15:22.7604570' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (27, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:15:22.9537503' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (28, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:15:49.0347921' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (29, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:15:49.2188387' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (30, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:19:22.1054879' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (31, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:19:22.1054864' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (32, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:19:22.1050829' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (33, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:19:22.1050469' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (34, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:20:06.8620347' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (35, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:20:11.1598442' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (36, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:20:30.1357480' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (37, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:20:30.3004045' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (38, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:20:42.2399989' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (39, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:20:42.4030944' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (40, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:22:18.8716327' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (41, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:26:38.8990905' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (42, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:26:39.0119451' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (43, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:27:16.9825671' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (44, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:27:17.1043032' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (45, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:27:40.7091042' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (46, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:31:09.1908838' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (47, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:31:09.4248551' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (48, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:58:10.4710573' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (49, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:58:10.6114920' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (50, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:58:10.2424677' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (51, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:58:10.0338393' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (52, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:58:10.2457849' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (53, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:58:10.0339918' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (54, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:58:12.5837108' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (55, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:58:10.3357880' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (56, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:58:10.2458647' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (57, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T10:58:10.0379556' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (58, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T11:13:02.2431495' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (59, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T11:13:32.5838680' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (60, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T11:13:32.7367363' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (61, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T11:13:34.5416900' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (62, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T11:13:50.0048015' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (63, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T11:13:51.6219094' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (64, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T11:15:26.8261351' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (65, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T12:12:07.5575967' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (66, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T12:18:28.6316075' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (67, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T12:35:02.4653355' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (68, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T12:42:38.2015551' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 50', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (69, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T13:03:20.9456391' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
INSERT [dbo].[ErrorLogs] ([Id], [Message], [Level], [Timestamp], [Exception], [Properties]) VALUES (70, N'The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.', N'Error', CAST(N'2026-05-19T13:03:23.1554464' AS DateTime2), N'System.InvalidOperationException: The JSON property name for ''ScanID.Api.Models.Student.academicYear'' collides with another property.
   at System.Text.Json.ThrowHelper.ThrowInvalidOperationException_SerializerPropertyNameConflict(Type type, String propertyName)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.JsonPropertyInfoList.AddPropertyWithConflictResolution(JsonPropertyInfo jsonPropertyInfo, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.AddMembersDeclaredBySuperType(JsonTypeInfo typeInfo, Type currentType, Boolean constructorHasSetsRequiredMembersAttribute, PropertyHierarchyResolutionState& state)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.PopulateProperties(JsonTypeInfo typeInfo)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.CreateTypeInfoCore(Type type, JsonConverter converter, JsonSerializerOptions options)
   at System.Text.Json.Serialization.Metadata.DefaultJsonTypeInfoResolver.GetTypeInfo(Type type, JsonSerializerOptions options)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoNoCaching(Type type)
   at System.Text.Json.JsonSerializerOptions.CachingContext.CreateCacheEntry(Type type, CachingContext context)
--- End of stack trace from previous location ---
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.Configure()
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
--- End of stack trace from previous location ---
   at System.Text.Json.Serialization.Metadata.JsonTypeInfo.<EnsureConfigured>g__ConfigureSynchronized|172_0()
   at System.Text.Json.JsonSerializerOptions.GetTypeInfoInternal(Type type, Boolean ensureConfigured, Nullable`1 ensureNotNull, Boolean resolveIfMutable, Boolean fallBackToNearestAncestorType)
   at System.Text.Json.JsonSerializerOptions.GetTypeInfo(Type type)
   at Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter.WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeNextResultFilterAsync>g__Awaited|30_0[TFilter,TFilterAsync](ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.Rethrow(ResultExecutedContextSealed context)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.ResultNext[TFilter,TFilterAsync](State& next, Scope& scope, Object& state, Boolean& isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.InvokeResultFilters()
--- End of stack trace from previous location ---
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeFilterPipelineAsync>g__Awaited|20_0(ResourceInvoker invoker, Task lastTask, State next, Scope scope, Object state, Boolean isCompleted)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Mvc.Infrastructure.ResourceInvoker.<InvokeAsync>g__Awaited|17_0(ResourceInvoker invoker, Task task, IDisposable scope)
   at Microsoft.AspNetCore.Authorization.AuthorizationMiddleware.Invoke(HttpContext context)
   at Swashbuckle.AspNetCore.SwaggerUI.SwaggerUIMiddleware.Invoke(HttpContext httpContext)
   at Swashbuckle.AspNetCore.Swagger.SwaggerMiddleware.Invoke(HttpContext httpContext, ISwaggerProvider swaggerProvider)
   at Program.<>c.<<<Main>$>b__0_4>d.MoveNext() in D:\Projects\SCANiD-School-Management-System\SCANiD-School-Management-System\backend\ScanID.Api\Program.cs:line 49', N'Path: /api/students')
GO
SET IDENTITY_INSERT [dbo].[ErrorLogs] OFF
GO
SET IDENTITY_INSERT [dbo].[Houses] ON 
GO
INSERT [dbo].[Houses] ([Id], [Name], [Color], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (1, N'RED', N'#EF4444', 1, 0, NULL, CAST(N'2026-05-15T11:30:03.0533333' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:03.0533333' AS DateTime2))
GO
INSERT [dbo].[Houses] ([Id], [Name], [Color], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (2, N'BLUE', N'#3B82F6', 1, 0, NULL, CAST(N'2026-05-15T11:30:03.0533333' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:03.0533333' AS DateTime2))
GO
INSERT [dbo].[Houses] ([Id], [Name], [Color], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (3, N'GREEN', N'#10B981', 1, 0, NULL, CAST(N'2026-05-15T11:30:03.0533333' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:03.0533333' AS DateTime2))
GO
INSERT [dbo].[Houses] ([Id], [Name], [Color], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (4, N'YELLOW', N'#F59E0B', 1, 0, NULL, CAST(N'2026-05-15T11:30:03.0566667' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:03.0566667' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[Houses] OFF
GO
SET IDENTITY_INSERT [dbo].[NavigationItems] ON 
GO
INSERT [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (1, N'Dashboard', N'LayoutDashboard', N'/', NULL, 1, 1, NULL, CAST(N'2026-05-16T14:03:35.8766667' AS DateTime2), NULL, CAST(N'2026-05-16T14:03:35.8766667' AS DateTime2))
GO
INSERT [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (2, N'Academic Operations', N'BookOpen', NULL, NULL, 2, 1, NULL, CAST(N'2026-05-16T14:03:35.8766667' AS DateTime2), NULL, CAST(N'2026-05-16T14:03:35.8766667' AS DateTime2))
GO
INSERT [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (3, N'Student Registry', N'GraduationCap', N'/students', 2, 1, 1, NULL, CAST(N'2026-05-16T14:03:35.8766667' AS DateTime2), NULL, CAST(N'2026-05-16T14:03:35.8766667' AS DateTime2))
GO
INSERT [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (4, N'Attendance Tracking', N'CalendarCheck', N'/attendance', 2, 2, 1, NULL, CAST(N'2026-05-16T14:03:35.8766667' AS DateTime2), NULL, CAST(N'2026-05-16T14:03:35.8766667' AS DateTime2))
GO
INSERT [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (5, N'Examination & Marks', N'BarChart3', N'/marks', 2, 3, 1, NULL, CAST(N'2026-05-16T14:03:35.8766667' AS DateTime2), NULL, CAST(N'2026-05-16T14:03:35.8766667' AS DateTime2))
GO
INSERT [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (6, N'Staff & HR', N'Users', NULL, NULL, 3, 1, NULL, CAST(N'2026-05-16T14:03:35.8766667' AS DateTime2), NULL, CAST(N'2026-05-16T14:03:35.8766667' AS DateTime2))
GO
INSERT [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (7, N'Teacher Catalog', N'UserCheck', N'/teachers', 6, 1, 1, NULL, CAST(N'2026-05-16T14:03:35.8800000' AS DateTime2), NULL, CAST(N'2026-05-16T14:03:35.8800000' AS DateTime2))
GO
INSERT [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (8, N'Administrative', N'ShieldCheck', NULL, NULL, 4, 1, NULL, CAST(N'2026-05-16T14:03:35.8800000' AS DateTime2), NULL, CAST(N'2026-05-16T14:03:35.8800000' AS DateTime2))
GO
INSERT [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (9, N'Fee Management', N'CreditCard', N'/fees', 8, 1, 1, NULL, CAST(N'2026-05-16T14:03:35.8800000' AS DateTime2), NULL, CAST(N'2026-05-16T14:03:35.8800000' AS DateTime2))
GO
INSERT [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (10, N'Communication Hub', N'MessageSquare', N'/messages', 8, 2, 1, NULL, CAST(N'2026-05-16T14:03:35.8800000' AS DateTime2), NULL, CAST(N'2026-05-16T14:03:35.8800000' AS DateTime2))
GO
INSERT [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (11, N'Masters & Config', N'Database', N'/configuration', NULL, 5, 1, NULL, CAST(N'2026-05-16T14:03:35.8800000' AS DateTime2), NULL, CAST(N'2026-05-16T14:03:35.8800000' AS DateTime2))
GO
INSERT [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (12, N'Global Schools', N'School', N'/configuration/schools', 11, 1, 1, NULL, CAST(N'2026-05-16T14:03:35.8800000' AS DateTime2), NULL, CAST(N'2026-05-16T14:03:35.8800000' AS DateTime2))
GO
INSERT [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (13, N'Access Control (RBAC)', N'Key', NULL, 11, 2, 1, NULL, CAST(N'2026-05-16T14:03:35.8800000' AS DateTime2), NULL, CAST(N'2026-05-16T14:03:35.8800000' AS DateTime2))
GO
INSERT [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (14, N'Role Master', N'Shield', N'/configuration/role-master', 13, 1, 1, NULL, CAST(N'2026-05-16T14:03:35.8800000' AS DateTime2), NULL, CAST(N'2026-05-16T14:03:35.8800000' AS DateTime2))
GO
INSERT [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (15, N'Role Assignment', N'UserCheck', N'/configuration/role-assignment', 13, 2, 1, NULL, CAST(N'2026-05-16T14:03:35.8800000' AS DateTime2), NULL, CAST(N'2026-05-16T14:03:35.8800000' AS DateTime2))
GO
INSERT [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (16, N'Menu Designer', N'Layout', NULL, 11, 3, 1, NULL, CAST(N'2026-05-16T14:03:35.8833333' AS DateTime2), NULL, CAST(N'2026-05-16T14:03:35.8833333' AS DateTime2))
GO
INSERT [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (17, N'Navigation Builder', N'LayoutGrid', N'/configuration/navigation', 16, 1, 1, NULL, CAST(N'2026-05-16T14:03:35.8833333' AS DateTime2), NULL, CAST(N'2026-05-16T14:03:35.8833333' AS DateTime2))
GO
INSERT [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (18, N'Academic Masters', N'BookOpen', NULL, 11, 4, 1, NULL, CAST(N'2026-05-16T14:03:35.8833333' AS DateTime2), NULL, CAST(N'2026-05-16T14:03:35.8833333' AS DateTime2))
GO
INSERT [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (19, N'Standards & Grades', N'Layers', N'/configuration/standards', 18, 1, 1, NULL, CAST(N'2026-05-16T14:03:35.8833333' AS DateTime2), NULL, CAST(N'2026-05-16T14:03:35.8833333' AS DateTime2))
GO
INSERT [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (20, N'Divisions/Sections', N'Hash', N'/configuration/sections', 18, 2, 1, NULL, CAST(N'2026-05-16T14:03:35.8833333' AS DateTime2), NULL, CAST(N'2026-05-16T14:03:35.8833333' AS DateTime2))
GO
INSERT [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (21, N'Academic Years', N'Calendar', N'/configuration/academic-years', 18, 3, 1, NULL, CAST(N'2026-05-16T14:03:35.8833333' AS DateTime2), NULL, CAST(N'2026-05-16T14:03:35.8833333' AS DateTime2))
GO
INSERT [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (22, N'Subject Registry', N'BookOpen', N'/configuration/subjects', 18, 4, 1, NULL, CAST(N'2026-05-16T14:03:35.8833333' AS DateTime2), NULL, CAST(N'2026-05-16T14:03:35.8833333' AS DateTime2))
GO
INSERT [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (23, N'System Audit', N'Terminal', N'/system-logs', NULL, 6, 1, NULL, CAST(N'2026-05-16T14:03:35.8833333' AS DateTime2), NULL, CAST(N'2026-05-16T14:03:35.8833333' AS DateTime2))
GO
INSERT [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (45, N'General Masters', N'Database', NULL, 11, 5, 1, NULL, CAST(N'2026-05-18T04:49:37.2233333' AS DateTime2), NULL, CAST(N'2026-05-18T04:49:37.2233333' AS DateTime2))
GO
INSERT [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (451, N'Religions', N'Heart', N'/configuration/religions', 45, 1, 1, NULL, CAST(N'2026-05-18T04:49:37.2266667' AS DateTime2), NULL, CAST(N'2026-05-18T04:49:37.2266667' AS DateTime2))
GO
INSERT [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (452, N'Blood Groups', N'Droplets', N'/configuration/blood-groups', 45, 2, 1, NULL, CAST(N'2026-05-18T04:49:37.2266667' AS DateTime2), NULL, CAST(N'2026-05-18T04:49:37.2266667' AS DateTime2))
GO
INSERT [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (453, N'Caste Category', N'Users', N'/configuration/castes', 45, 3, 1, NULL, CAST(N'2026-05-18T04:49:37.2266667' AS DateTime2), NULL, CAST(N'2026-05-18T04:49:37.2266667' AS DateTime2))
GO
INSERT [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (454, N'Sub-Caste', N'UserCircle', N'/configuration/sub-castes', 45, 4, 1, NULL, CAST(N'2026-05-18T04:49:37.2266667' AS DateTime2), NULL, CAST(N'2026-05-18T04:49:37.2266667' AS DateTime2))
GO
INSERT [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (455, N'School House', N'Home', N'/configuration/houses', 45, 5, 1, NULL, CAST(N'2026-05-18T04:49:37.2266667' AS DateTime2), NULL, CAST(N'2026-05-18T04:49:37.2266667' AS DateTime2))
GO
INSERT [dbo].[NavigationItems] ([Id], [Title], [Icon], [Path], [ParentId], [SortOrder], [IsActive], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (456, N'Admission Types', N'UserCheck', N'/configuration/admission-types', 45, 6, 1, NULL, CAST(N'2026-05-18T04:49:37.2266667' AS DateTime2), NULL, CAST(N'2026-05-18T04:49:37.2266667' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[NavigationItems] OFF
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (1, 1)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (1, 2)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (1, 3)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (1, 4)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (1, 5)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (2, 1)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (2, 2)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (2, 3)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (2, 4)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (2, 5)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (3, 1)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (3, 2)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (3, 3)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (3, 5)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (4, 1)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (4, 2)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (4, 3)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (4, 4)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (4, 5)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (5, 1)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (5, 2)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (5, 3)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (5, 4)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (5, 5)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (6, 1)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (6, 2)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (6, 3)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (7, 1)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (7, 2)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (7, 3)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (8, 1)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (8, 2)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (8, 3)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (8, 4)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (8, 5)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (9, 1)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (9, 2)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (9, 5)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (10, 1)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (10, 2)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (10, 3)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (10, 4)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (10, 5)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (11, 1)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (11, 2)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (12, 1)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (12, 2)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (13, 1)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (13, 2)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (14, 1)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (14, 2)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (15, 1)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (15, 2)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (16, 1)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (16, 2)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (17, 1)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (17, 2)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (18, 1)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (18, 2)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (19, 1)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (19, 2)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (20, 1)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (20, 2)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (21, 1)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (21, 2)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (22, 1)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (22, 2)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (23, 1)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (45, 1)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (45, 2)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (451, 1)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (451, 2)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (452, 1)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (452, 2)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (453, 1)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (453, 2)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (454, 1)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (454, 2)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (455, 1)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (455, 2)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (456, 1)
GO
INSERT [dbo].[NavigationRoles] ([NavigationItemId], [RoleId]) VALUES (456, 2)
GO
SET IDENTITY_INSERT [dbo].[Religions] ON 
GO
INSERT [dbo].[Religions] ([Id], [Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (1, N'HINDU', 1, 0, NULL, CAST(N'2026-05-15T11:30:03.0000000' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:03.0000000' AS DateTime2))
GO
INSERT [dbo].[Religions] ([Id], [Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (2, N'MUSLIM', 1, 0, NULL, CAST(N'2026-05-15T11:30:03.0033333' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:03.0033333' AS DateTime2))
GO
INSERT [dbo].[Religions] ([Id], [Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (3, N'CHRISTIAN', 1, 0, NULL, CAST(N'2026-05-15T11:30:03.0033333' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:03.0033333' AS DateTime2))
GO
INSERT [dbo].[Religions] ([Id], [Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (4, N'SIKH', 1, 0, NULL, CAST(N'2026-05-15T11:30:03.0033333' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:03.0033333' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[Religions] OFF
GO
SET IDENTITY_INSERT [dbo].[Roles] ON 
GO
INSERT [dbo].[Roles] ([Id], [Name], [Description], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (1, N'SuperAdmin', N'Global System Administrator', 1, 0, N'SYSTEM', CAST(N'2026-05-15T11:30:02.9400000' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:02.9400000' AS DateTime2))
GO
INSERT [dbo].[Roles] ([Id], [Name], [Description], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (2, N'Admin', N'School Level Administrator', 1, 0, N'SYSTEM', CAST(N'2026-05-15T11:30:02.9400000' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:02.9400000' AS DateTime2))
GO
INSERT [dbo].[Roles] ([Id], [Name], [Description], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (3, N'Teacher', N'Teaching Staff', 1, 0, N'SYSTEM', CAST(N'2026-05-15T11:30:02.9400000' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:02.9400000' AS DateTime2))
GO
INSERT [dbo].[Roles] ([Id], [Name], [Description], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (4, N'Student', N'Student Account', 1, 0, N'SYSTEM', CAST(N'2026-05-15T11:30:02.9400000' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:02.9400000' AS DateTime2))
GO
INSERT [dbo].[Roles] ([Id], [Name], [Description], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (5, N'Parent', N'Guardian Account', 1, 0, N'SYSTEM', CAST(N'2026-05-15T11:30:02.9400000' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:02.9400000' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[Roles] OFF
GO
SET IDENTITY_INSERT [dbo].[Schools] ON 
GO
INSERT [dbo].[Schools] ([Id], [Name], [Code], [Address], [Email], [Phone], [TotalStudents], [Status], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn], [ProfilePhotoPath]) VALUES (1, N'SCANID PRIMARY SCHOOL', NULL, N'MUMBAI, MAHARASHTRA', N'pri@scanid.com', N'9876543210', 0, N'Active', 1, 0, N'SYSTEM', CAST(N'2026-05-15T11:30:02.9066667' AS DateTime2), NULL, CAST(N'2026-05-19T16:15:49.2391994' AS DateTime2), N'/uploads/schools/SCANID_PRIMARY_SCHOOL/school_1_639148041492360706.jpeg')
GO
INSERT [dbo].[Schools] ([Id], [Name], [Code], [Address], [Email], [Phone], [TotalStudents], [Status], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn], [ProfilePhotoPath]) VALUES (2, N'SCANID SECONDARY HIGH SCHOOL', NULL, N'PUNE, MAHARASHTRA', N'sec@scanid.com', N'9876543211', 0, N'Active', 1, 0, N'SYSTEM', CAST(N'2026-05-15T11:30:02.9266667' AS DateTime2), NULL, CAST(N'2026-05-20T14:26:38.9050572' AS DateTime2), N'/uploads/schools/SCANID_SECONDARY_HIGH_SCHOOL/school_2_639148839989026960.png')
GO
INSERT [dbo].[Schools] ([Id], [Name], [Code], [Address], [Email], [Phone], [TotalStudents], [Status], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn], [ProfilePhotoPath]) VALUES (3, N'Ahilya Vidya Mandir', NULL, N'C-201, Ishwati Prasad C.H.S. Dattaram lad marg, Kalachowki, Mumbai - 400033.', N'', N'', 0, N'Active', 1, 0, NULL, CAST(N'2026-05-20T11:39:39.4771338' AS DateTime2), NULL, CAST(N'2026-05-20T11:42:36.7414945' AS DateTime2), N'/uploads/schools/Ahilya_Vidya_Mandir/school_3_639148741567394383.png')
GO
INSERT [dbo].[Schools] ([Id], [Name], [Code], [Address], [Email], [Phone], [TotalStudents], [Status], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn], [ProfilePhotoPath]) VALUES (4, N'Ahilya Vidya Mandir', NULL, N'C-201, Ishwati Prasad C.H.S. Dattaram lad marg, Kalachowki, Mumbai - 400033.', N'devendraparte2001@gmail.com', N'', 0, N'Active', 1, 0, NULL, CAST(N'2026-05-20T12:00:04.3269826' AS DateTime2), NULL, CAST(N'2026-05-20T14:25:49.0410400' AS DateTime2), N'/uploads/schools/Ahilya_Vidya_Mandir/school_4_639148839490204735.png')
GO
SET IDENTITY_INSERT [dbo].[Schools] OFF
GO
SET IDENTITY_INSERT [dbo].[Sections] ON 
GO
INSERT [dbo].[Sections] ([Id], [Name], [Description], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (1, N'A', NULL, 1, 0, NULL, CAST(N'2026-05-15T11:30:02.9900000' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:02.9900000' AS DateTime2))
GO
INSERT [dbo].[Sections] ([Id], [Name], [Description], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (2, N'B', NULL, 1, 0, NULL, CAST(N'2026-05-15T11:30:02.9900000' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:02.9900000' AS DateTime2))
GO
INSERT [dbo].[Sections] ([Id], [Name], [Description], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (3, N'C', NULL, 1, 0, NULL, CAST(N'2026-05-15T11:30:02.9900000' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:02.9900000' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[Sections] OFF
GO
SET IDENTITY_INSERT [dbo].[Shifts] ON 
GO
INSERT [dbo].[Shifts] ([Id], [Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (1, N'MORNING', 1, 0, NULL, CAST(N'2026-05-15T11:30:03.0766667' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:03.0766667' AS DateTime2))
GO
INSERT [dbo].[Shifts] ([Id], [Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (2, N'AFTERNOON', 1, 0, NULL, CAST(N'2026-05-15T11:30:03.0800000' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:03.0800000' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[Shifts] OFF
GO
SET IDENTITY_INSERT [dbo].[Standards] ON 
GO
INSERT [dbo].[Standards] ([Id], [Name], [Description], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (1, N'1st', NULL, 1, 0, NULL, CAST(N'2026-05-15T11:30:02.9633333' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:02.9633333' AS DateTime2))
GO
INSERT [dbo].[Standards] ([Id], [Name], [Description], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (2, N'2nd', NULL, 1, 0, NULL, CAST(N'2026-05-15T11:30:02.9633333' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:02.9633333' AS DateTime2))
GO
INSERT [dbo].[Standards] ([Id], [Name], [Description], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (3, N'3rd', NULL, 1, 0, NULL, CAST(N'2026-05-15T11:30:02.9633333' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:02.9633333' AS DateTime2))
GO
INSERT [dbo].[Standards] ([Id], [Name], [Description], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (4, N'4th', NULL, 1, 0, NULL, CAST(N'2026-05-15T11:30:02.9633333' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:02.9633333' AS DateTime2))
GO
INSERT [dbo].[Standards] ([Id], [Name], [Description], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (5, N'5th', NULL, 1, 0, NULL, CAST(N'2026-05-15T11:30:02.9666667' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:02.9666667' AS DateTime2))
GO
INSERT [dbo].[Standards] ([Id], [Name], [Description], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (6, N'LKG', NULL, 1, 0, NULL, CAST(N'2026-05-15T11:30:02.9666667' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:02.9666667' AS DateTime2))
GO
INSERT [dbo].[Standards] ([Id], [Name], [Description], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (7, N'UKG', NULL, 1, 0, NULL, CAST(N'2026-05-15T11:30:02.9666667' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:02.9666667' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[Standards] OFF
GO
SET IDENTITY_INSERT [dbo].[Students] ON 
GO
INSERT [dbo].[Students] ([Id], [RegistrationNumber], [Name], [SchoolId], [Status], [RollNumber], [STUDENTID], [FNAME], [MNAME], [LNAME], [FirstName], [MiddleName], [LastName], [GRNO], [GENDER], [DOB], [DateOfBirth], [ADDRESS], [PIN], [FATHERNAME], [MOTHERNAME], [MOBILE], [EMAIL], [DOA], [ProfilePhotoPath], [CARDID], [VALIDFROM], [VALIDTO], [sms], [contact2], [ispromoted], [saralid], [aadharcard], [bankname], [bankacc], [cid], [fingerid], [freeshiptype], [otp], [subjects], [placeofbirth], [birthtaluka], [birthdistrict], [birthstate], [birthcountry], [mothertongue], [Nationality], [Lastschool], [Progress], [DateofLeaving], [Reasonforleaving], [LCNo], [conduct], [remark], [dobwords], [admissionstd], [accountname], [IQLD], [schoolsection], [leftstatus], [feesinstallment], [uniformid], [stdstudyingInWords], [EntryDate], [PEN_No], [apaar_id], [RFID], [StandardId], [SectionId], [AcademicYearId], [CasteId], [SubCasteId], [ReligionId], [BloodGroupId], [HouseId], [AdmissionTypeId], [CityId], [StateId], [ShiftId], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn], [CategoryId]) VALUES (1, N'REG1001', N'Shivansh Sanjay Khopkar', 1, N'Active', 1, N'REG1001', N'Shivansh', N'Sanjay', N'Khopkar', N'Shivansh', NULL, N'Khopkar', N'REG1001', N'Male', N'2026-05-18', N'2015-05-20', N'N/A', NULL, NULL, N'trerter', N'4564564564', NULL, NULL, N'/photos/1/358800024131.png', NULL, NULL, NULL, N'', N'', NULL, NULL, N'345353453453', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, N'', NULL, NULL, NULL, NULL, N'', 1, 1, 2, 1, NULL, 1, 1, 1, 1, NULL, NULL, 2, 1, 0, NULL, CAST(N'2026-05-16T16:32:11.8605935' AS DateTime2), N'Super Admin', CAST(N'2026-05-20T10:59:45.4458755' AS DateTime2), NULL)
GO
INSERT [dbo].[Students] ([Id], [RegistrationNumber], [Name], [SchoolId], [Status], [RollNumber], [STUDENTID], [FNAME], [MNAME], [LNAME], [FirstName], [MiddleName], [LastName], [GRNO], [GENDER], [DOB], [DateOfBirth], [ADDRESS], [PIN], [FATHERNAME], [MOTHERNAME], [MOBILE], [EMAIL], [DOA], [ProfilePhotoPath], [CARDID], [VALIDFROM], [VALIDTO], [sms], [contact2], [ispromoted], [saralid], [aadharcard], [bankname], [bankacc], [cid], [fingerid], [freeshiptype], [otp], [subjects], [placeofbirth], [birthtaluka], [birthdistrict], [birthstate], [birthcountry], [mothertongue], [Nationality], [Lastschool], [Progress], [DateofLeaving], [Reasonforleaving], [LCNo], [conduct], [remark], [dobwords], [admissionstd], [accountname], [IQLD], [schoolsection], [leftstatus], [feesinstallment], [uniformid], [stdstudyingInWords], [EntryDate], [PEN_No], [apaar_id], [RFID], [StandardId], [SectionId], [AcademicYearId], [CasteId], [SubCasteId], [ReligionId], [BloodGroupId], [HouseId], [AdmissionTypeId], [CityId], [StateId], [ShiftId], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn], [CategoryId]) VALUES (2, N'REG1002', N'Aavya Amit Patil', 1, N'Active', 2, NULL, NULL, NULL, NULL, N'Aavya', NULL, N'Patil', NULL, N'Female', NULL, N'2015-08-15', NULL, NULL, NULL, NULL, NULL, NULL, NULL, N'/photos/1/114023446323.jpeg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 2, 2, NULL, 1, 2, 2, 1, NULL, NULL, NULL, 1, 0, NULL, CAST(N'2026-05-15T11:30:03.1233333' AS DateTime2), NULL, CAST(N'2026-05-19T16:14:47.9476376' AS DateTime2), NULL)
GO
INSERT [dbo].[Students] ([Id], [RegistrationNumber], [Name], [SchoolId], [Status], [RollNumber], [STUDENTID], [FNAME], [MNAME], [LNAME], [FirstName], [MiddleName], [LastName], [GRNO], [GENDER], [DOB], [DateOfBirth], [ADDRESS], [PIN], [FATHERNAME], [MOTHERNAME], [MOBILE], [EMAIL], [DOA], [ProfilePhotoPath], [CARDID], [VALIDFROM], [VALIDTO], [sms], [contact2], [ispromoted], [saralid], [aadharcard], [bankname], [bankacc], [cid], [fingerid], [freeshiptype], [otp], [subjects], [placeofbirth], [birthtaluka], [birthdistrict], [birthstate], [birthcountry], [mothertongue], [Nationality], [Lastschool], [Progress], [DateofLeaving], [Reasonforleaving], [LCNo], [conduct], [remark], [dobwords], [admissionstd], [accountname], [IQLD], [schoolsection], [leftstatus], [feesinstallment], [uniformid], [stdstudyingInWords], [EntryDate], [PEN_No], [apaar_id], [RFID], [StandardId], [SectionId], [AcademicYearId], [CasteId], [SubCasteId], [ReligionId], [BloodGroupId], [HouseId], [AdmissionTypeId], [CityId], [StateId], [ShiftId], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn], [CategoryId]) VALUES (3, N'REG/2024/003', N'Liam  Wilson', 1, N'Active', 1, N'REG/2024/003', N'Liam', N'', N'Wilson', NULL, NULL, NULL, N'REG/2024/003', N'Male', N'0043-03-31', NULL, N'N/A', NULL, NULL, N'Mary', N'1234567890', NULL, NULL, N'', NULL, NULL, NULL, N'', N'', NULL, NULL, N'123456789145', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, N'', NULL, NULL, NULL, NULL, N'1232131341', 2, 1, 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, 1, 0, N'Super Admin', CAST(N'2026-05-17T18:53:15.3411674' AS DateTime2), N'Super Admin', CAST(N'2026-05-17T18:53:15.3411674' AS DateTime2), NULL)
GO
INSERT [dbo].[Students] ([Id], [RegistrationNumber], [Name], [SchoolId], [Status], [RollNumber], [STUDENTID], [FNAME], [MNAME], [LNAME], [FirstName], [MiddleName], [LastName], [GRNO], [GENDER], [DOB], [DateOfBirth], [ADDRESS], [PIN], [FATHERNAME], [MOTHERNAME], [MOBILE], [EMAIL], [DOA], [ProfilePhotoPath], [CARDID], [VALIDFROM], [VALIDTO], [sms], [contact2], [ispromoted], [saralid], [aadharcard], [bankname], [bankacc], [cid], [fingerid], [freeshiptype], [otp], [subjects], [placeofbirth], [birthtaluka], [birthdistrict], [birthstate], [birthcountry], [mothertongue], [Nationality], [Lastschool], [Progress], [DateofLeaving], [Reasonforleaving], [LCNo], [conduct], [remark], [dobwords], [admissionstd], [accountname], [IQLD], [schoolsection], [leftstatus], [feesinstallment], [uniformid], [stdstudyingInWords], [EntryDate], [PEN_No], [apaar_id], [RFID], [StandardId], [SectionId], [AcademicYearId], [CasteId], [SubCasteId], [ReligionId], [BloodGroupId], [HouseId], [AdmissionTypeId], [CityId], [StateId], [ShiftId], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn], [CategoryId]) VALUES (4, N'REG/2024/003', N'Rajesh Prakash Patil', 1, N'Active', 1, N'REG/2024/003', N'Rajesh', N'Prakash', N'Patil', NULL, NULL, NULL, N'REG/2024/003', N'Male', N'1984-12-04', NULL, N'N/A', NULL, NULL, N'Mary', N'4342342342', NULL, NULL, N'', NULL, NULL, NULL, N'', N'', NULL, NULL, N'323232312312', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, N'', NULL, NULL, NULL, NULL, N'', 1, 1, 2, 1, NULL, 1, 1, 1, 1, NULL, NULL, 1, 1, 0, N'Super Admin', CAST(N'2026-05-18T09:43:26.9908959' AS DateTime2), N'Super Admin', CAST(N'2026-05-18T09:43:26.9908959' AS DateTime2), NULL)
GO
INSERT [dbo].[Students] ([Id], [RegistrationNumber], [Name], [SchoolId], [Status], [RollNumber], [STUDENTID], [FNAME], [MNAME], [LNAME], [FirstName], [MiddleName], [LastName], [GRNO], [GENDER], [DOB], [DateOfBirth], [ADDRESS], [PIN], [FATHERNAME], [MOTHERNAME], [MOBILE], [EMAIL], [DOA], [ProfilePhotoPath], [CARDID], [VALIDFROM], [VALIDTO], [sms], [contact2], [ispromoted], [saralid], [aadharcard], [bankname], [bankacc], [cid], [fingerid], [freeshiptype], [otp], [subjects], [placeofbirth], [birthtaluka], [birthdistrict], [birthstate], [birthcountry], [mothertongue], [Nationality], [Lastschool], [Progress], [DateofLeaving], [Reasonforleaving], [LCNo], [conduct], [remark], [dobwords], [admissionstd], [accountname], [IQLD], [schoolsection], [leftstatus], [feesinstallment], [uniformid], [stdstudyingInWords], [EntryDate], [PEN_No], [apaar_id], [RFID], [StandardId], [SectionId], [AcademicYearId], [CasteId], [SubCasteId], [ReligionId], [BloodGroupId], [HouseId], [AdmissionTypeId], [CityId], [StateId], [ShiftId], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn], [CategoryId]) VALUES (5, N'REG/2024/003', N'Liam  Wilson', 2, N'Active', 1, N'REG/2024/003', N'Liam', N'', N'Wilson', NULL, NULL, NULL, N'REG/2024/003', N'Male', N'2026-02-01', NULL, N'N/A', NULL, NULL, N'Mary', N'1234567890', NULL, NULL, N'/photos/2/951013660322.png', NULL, NULL, NULL, N'', NULL, NULL, NULL, N'123456789145', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, N'', NULL, NULL, NULL, NULL, N'32423423423423423423', 1, 1, 2, 1, 1, 1, 1, 1, 1, NULL, NULL, 1, 1, 0, NULL, CAST(N'2026-05-20T11:32:26.2762214' AS DateTime2), N'Super Admin', CAST(N'2026-05-20T11:32:26.3268934' AS DateTime2), NULL)
GO
SET IDENTITY_INSERT [dbo].[Students] OFF
GO
SET IDENTITY_INSERT [dbo].[SubCastes] ON 
GO
INSERT [dbo].[SubCastes] ([Id], [CasteId], [Name], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (1, 1, N'Hindu-Maratha', 1, 0, NULL, CAST(N'2026-05-19T19:41:08.8779407' AS DateTime2), NULL, CAST(N'2026-05-19T19:41:08.8779407' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[SubCastes] OFF
GO
SET IDENTITY_INSERT [dbo].[Teachers] ON 
GO
INSERT [dbo].[Teachers] ([Id], [UserId], [SchoolId], [EmployeeId], [Department], [Qualification], [Experience], [Subject], [StandardId], [SectionId], [ContactNumber], [Status], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn], [ProfilePhotoPath]) VALUES (1, 3, 1, N'EMP001', N'N/A', N'MA B.Ed', N'5+ Years', N'Mathematics', 1, 1, N'9876543210', N'Active', 1, 0, N'SYSTEM', CAST(N'2026-05-15T11:30:03.1100000' AS DateTime2), NULL, CAST(N'2026-05-20T14:25:03.8962233' AS DateTime2), N'/uploads/teachers/teacher_1_639148700868518487.png')
GO
INSERT [dbo].[Teachers] ([Id], [UserId], [SchoolId], [EmployeeId], [Department], [Qualification], [Experience], [Subject], [StandardId], [SectionId], [ContactNumber], [Status], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn], [ProfilePhotoPath]) VALUES (2, 8, 2, N'EMP-1779257080279', N'Mathematics', N'PhD', NULL, NULL, NULL, NULL, N'2132131232', N'Active', 1, 0, N'Super Admin', CAST(N'2026-05-20T11:34:40.3772256' AS DateTime2), N'Super Admin', CAST(N'2026-05-20T12:03:43.8407441' AS DateTime2), N'/uploads/teachers/teacher_2_639148754238226093.png')
GO
SET IDENTITY_INSERT [dbo].[Teachers] OFF
GO
SET IDENTITY_INSERT [dbo].[Users] ON 
GO
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [Name], [Email], [RoleId], [Role], [SchoolId], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (1, N'superadmin', N'Password123', N'Super Admin', N'superadmin@scanid.com', 1, N'superadmin', 1, 1, 0, N'SYSTEM', CAST(N'2026-05-15T11:30:03.0900000' AS DateTime2), NULL, CAST(N'2026-05-15T11:30:03.0900000' AS DateTime2))
GO
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [Name], [Email], [RoleId], [Role], [SchoolId], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (2, N'adminuser', N'Password123', N'Admin', N'admin@scanid.com', 2, N'admin', 1, 1, 0, N'SYSTEM', CAST(N'2026-05-15T11:30:03.0900000' AS DateTime2), NULL, CAST(N'2026-05-18T09:33:08.6901572' AS DateTime2))
GO
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [Name], [Email], [RoleId], [Role], [SchoolId], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (3, N'teacher', N'Password123', N'Teacher1 Teacher', N'teacher@scanid.com', 3, N'teacher', 1, 1, 0, N'SYSTEM', CAST(N'2026-05-15T11:30:03.0900000' AS DateTime2), NULL, CAST(N'2026-05-20T14:25:03.8970965' AS DateTime2))
GO
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [Name], [Email], [RoleId], [Role], [SchoolId], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (6, N'parent', N'Password123', N'Parent', N'parent@scanid.com', 5, N'parent', 1, 1, 0, N'SYSTEM', CAST(N'2026-05-15T11:30:03.0900000' AS DateTime2), NULL, CAST(N'2026-05-16T19:42:41.8938943' AS DateTime2))
GO
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [Name], [Email], [RoleId], [Role], [SchoolId], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (7, N'student', N'Password123', N'Student', N'student@scanid.com', 4, N'student', 1, 1, 0, N'SYSTEM', CAST(N'2026-05-15T11:30:03.0900000' AS DateTime2), NULL, CAST(N'2026-05-16T19:42:52.4291887' AS DateTime2))
GO
INSERT [dbo].[Users] ([Id], [Username], [PasswordHash], [Name], [Email], [RoleId], [Role], [SchoolId], [IsActive], [IsDeleted], [CreatedBy], [CreatedOn], [ModifiedBy], [ModifiedOn]) VALUES (8, N'faculty1779257080279', N'temp123', N'Robert Smith', N'faculty@colloege.com', NULL, N'teacher', 2, 1, 0, NULL, CAST(N'2026-05-20T11:34:40.3772612' AS DateTime2), NULL, CAST(N'2026-05-20T11:34:40.3772612' AS DateTime2))
GO
SET IDENTITY_INSERT [dbo].[Users] OFF
GO
/****** Object:  Index [IX_Students_CategoryId]    Script Date: 20/05/2026 4:45:33 PM ******/
CREATE NONCLUSTERED INDEX [IX_Students_CategoryId] ON [dbo].[Students]
(
	[CategoryId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AcademicYears] ADD  DEFAULT ((0)) FOR [IsCurrent]
GO
ALTER TABLE [dbo].[AcademicYears] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[AcademicYears] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[AcademicYears] ADD  DEFAULT (getutcdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[AcademicYears] ADD  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO
ALTER TABLE [dbo].[AdmissionTypes] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[AdmissionTypes] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[AdmissionTypes] ADD  DEFAULT (getutcdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[AdmissionTypes] ADD  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO
ALTER TABLE [dbo].[Attendance] ADD  DEFAULT (N'Present') FOR [Status]
GO
ALTER TABLE [dbo].[Attendance] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Attendance] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Attendance] ADD  DEFAULT (getutcdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[Attendance] ADD  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO
ALTER TABLE [dbo].[AuditLogs] ADD  DEFAULT (getutcdate()) FOR [DateTime]
GO
ALTER TABLE [dbo].[Batches] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Batches] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Batches] ADD  DEFAULT (getutcdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[Batches] ADD  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO
ALTER TABLE [dbo].[BloodGroups] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[BloodGroups] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[BloodGroups] ADD  DEFAULT (getutcdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[BloodGroups] ADD  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO
ALTER TABLE [dbo].[Castes] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Castes] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Castes] ADD  DEFAULT (getutcdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[Castes] ADD  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO
ALTER TABLE [dbo].[Categories] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Categories] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Categories] ADD  DEFAULT (getutcdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[Categories] ADD  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO
ALTER TABLE [dbo].[Cities] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Cities] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Cities] ADD  DEFAULT (getutcdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[Cities] ADD  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO
ALTER TABLE [dbo].[Designations] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Designations] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Designations] ADD  DEFAULT (getutcdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[Designations] ADD  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO
ALTER TABLE [dbo].[ErrorLogs] ADD  DEFAULT (getutcdate()) FOR [Timestamp]
GO
ALTER TABLE [dbo].[ExamTypes] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[ExamTypes] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[ExamTypes] ADD  DEFAULT (getutcdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[ExamTypes] ADD  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO
ALTER TABLE [dbo].[Fees] ADD  DEFAULT (N'Tuition') FOR [Type]
GO
ALTER TABLE [dbo].[Fees] ADD  DEFAULT (N'Pending') FOR [Status]
GO
ALTER TABLE [dbo].[Fees] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Fees] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Fees] ADD  DEFAULT (getutcdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[Fees] ADD  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO
ALTER TABLE [dbo].[Houses] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Houses] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Houses] ADD  DEFAULT (getutcdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[Houses] ADD  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO
ALTER TABLE [dbo].[Marks] ADD  DEFAULT (N'Mid-Term') FOR [ExamName]
GO
ALTER TABLE [dbo].[Marks] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Marks] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Marks] ADD  DEFAULT (getutcdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[Marks] ADD  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO
ALTER TABLE [dbo].[Messages] ADD  DEFAULT (N'Alert') FOR [Type]
GO
ALTER TABLE [dbo].[Messages] ADD  DEFAULT (getutcdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Messages] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Messages] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Messages] ADD  DEFAULT (getutcdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[Messages] ADD  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO
ALTER TABLE [dbo].[NavigationItems] ADD  DEFAULT ((0)) FOR [SortOrder]
GO
ALTER TABLE [dbo].[NavigationItems] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[NavigationItems] ADD  DEFAULT (getutcdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[NavigationItems] ADD  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO
ALTER TABLE [dbo].[Notifications] ADD  DEFAULT (N'info') FOR [Type]
GO
ALTER TABLE [dbo].[Notifications] ADD  DEFAULT ((0)) FOR [IsRead]
GO
ALTER TABLE [dbo].[Notifications] ADD  DEFAULT (getutcdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Notifications] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Notifications] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Notifications] ADD  DEFAULT (getutcdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[Notifications] ADD  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO
ALTER TABLE [dbo].[Occupations] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Occupations] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Occupations] ADD  DEFAULT (getutcdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[Occupations] ADD  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO
ALTER TABLE [dbo].[Religions] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Religions] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Religions] ADD  DEFAULT (getutcdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[Religions] ADD  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO
ALTER TABLE [dbo].[Roles] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Roles] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Roles] ADD  DEFAULT (getutcdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[Roles] ADD  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO
ALTER TABLE [dbo].[Schools] ADD  DEFAULT (N'Active') FOR [Status]
GO
ALTER TABLE [dbo].[Schools] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Schools] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Schools] ADD  DEFAULT (getutcdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[Schools] ADD  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO
ALTER TABLE [dbo].[Sections] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Sections] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Sections] ADD  DEFAULT (getutcdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[Sections] ADD  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO
ALTER TABLE [dbo].[Sessions] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Sessions] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Sessions] ADD  DEFAULT (getutcdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[Sessions] ADD  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO
ALTER TABLE [dbo].[Shifts] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Shifts] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Shifts] ADD  DEFAULT (getutcdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[Shifts] ADD  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO
ALTER TABLE [dbo].[Standards] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Standards] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Standards] ADD  DEFAULT (getutcdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[Standards] ADD  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO
ALTER TABLE [dbo].[States] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[States] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[States] ADD  DEFAULT (getutcdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[States] ADD  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO
ALTER TABLE [dbo].[Students] ADD  DEFAULT (N'Active') FOR [Status]
GO
ALTER TABLE [dbo].[Students] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Students] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Students] ADD  DEFAULT (getutcdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[Students] ADD  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO
ALTER TABLE [dbo].[SubCastes] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[SubCastes] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[SubCastes] ADD  DEFAULT (getutcdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[SubCastes] ADD  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO
ALTER TABLE [dbo].[Subjects] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Subjects] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Subjects] ADD  DEFAULT (getutcdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[Subjects] ADD  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO
ALTER TABLE [dbo].[Teachers] ADD  DEFAULT (N'Active') FOR [Status]
GO
ALTER TABLE [dbo].[Teachers] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Teachers] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Teachers] ADD  DEFAULT (getutcdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[Teachers] ADD  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT (getutcdate()) FOR [CreatedOn]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT (getutcdate()) FOR [ModifiedOn]
GO
ALTER TABLE [dbo].[Attendance]  WITH CHECK ADD  CONSTRAINT [FK_Attendance_Students_StudentId] FOREIGN KEY([StudentId])
REFERENCES [dbo].[Students] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Attendance] CHECK CONSTRAINT [FK_Attendance_Students_StudentId]
GO
ALTER TABLE [dbo].[Cities]  WITH CHECK ADD  CONSTRAINT [FK_Cities_States] FOREIGN KEY([StateId])
REFERENCES [dbo].[States] ([Id])
GO
ALTER TABLE [dbo].[Cities] CHECK CONSTRAINT [FK_Cities_States]
GO
ALTER TABLE [dbo].[Fees]  WITH CHECK ADD  CONSTRAINT [FK_Fees_Students_StudentId] FOREIGN KEY([StudentId])
REFERENCES [dbo].[Students] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Fees] CHECK CONSTRAINT [FK_Fees_Students_StudentId]
GO
ALTER TABLE [dbo].[Marks]  WITH CHECK ADD  CONSTRAINT [FK_Marks_Students_StudentId] FOREIGN KEY([StudentId])
REFERENCES [dbo].[Students] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Marks] CHECK CONSTRAINT [FK_Marks_Students_StudentId]
GO
ALTER TABLE [dbo].[NavigationItems]  WITH CHECK ADD  CONSTRAINT [FK_NavigationItems_NavigationItems] FOREIGN KEY([ParentId])
REFERENCES [dbo].[NavigationItems] ([Id])
GO
ALTER TABLE [dbo].[NavigationItems] CHECK CONSTRAINT [FK_NavigationItems_NavigationItems]
GO
ALTER TABLE [dbo].[NavigationRoles]  WITH CHECK ADD  CONSTRAINT [FK_NavigationRoles_NavigationItems] FOREIGN KEY([NavigationItemId])
REFERENCES [dbo].[NavigationItems] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[NavigationRoles] CHECK CONSTRAINT [FK_NavigationRoles_NavigationItems]
GO
ALTER TABLE [dbo].[NavigationRoles]  WITH CHECK ADD  CONSTRAINT [FK_NavigationRoles_Roles] FOREIGN KEY([RoleId])
REFERENCES [dbo].[Roles] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[NavigationRoles] CHECK CONSTRAINT [FK_NavigationRoles_Roles]
GO
ALTER TABLE [dbo].[Students]  WITH CHECK ADD  CONSTRAINT [FK_Students_AcademicYears] FOREIGN KEY([AcademicYearId])
REFERENCES [dbo].[AcademicYears] ([Id])
GO
ALTER TABLE [dbo].[Students] CHECK CONSTRAINT [FK_Students_AcademicYears]
GO
ALTER TABLE [dbo].[Students]  WITH CHECK ADD  CONSTRAINT [FK_Students_AdmissionTypes] FOREIGN KEY([AdmissionTypeId])
REFERENCES [dbo].[AdmissionTypes] ([Id])
GO
ALTER TABLE [dbo].[Students] CHECK CONSTRAINT [FK_Students_AdmissionTypes]
GO
ALTER TABLE [dbo].[Students]  WITH CHECK ADD  CONSTRAINT [FK_Students_BloodGroups] FOREIGN KEY([BloodGroupId])
REFERENCES [dbo].[BloodGroups] ([Id])
GO
ALTER TABLE [dbo].[Students] CHECK CONSTRAINT [FK_Students_BloodGroups]
GO
ALTER TABLE [dbo].[Students]  WITH CHECK ADD  CONSTRAINT [FK_Students_Castes] FOREIGN KEY([CasteId])
REFERENCES [dbo].[Castes] ([Id])
GO
ALTER TABLE [dbo].[Students] CHECK CONSTRAINT [FK_Students_Castes]
GO
ALTER TABLE [dbo].[Students]  WITH CHECK ADD  CONSTRAINT [FK_Students_Categories] FOREIGN KEY([CategoryId])
REFERENCES [dbo].[Categories] ([Id])
GO
ALTER TABLE [dbo].[Students] CHECK CONSTRAINT [FK_Students_Categories]
GO
ALTER TABLE [dbo].[Students]  WITH CHECK ADD  CONSTRAINT [FK_Students_Categories_CategoryId] FOREIGN KEY([CategoryId])
REFERENCES [dbo].[Categories] ([Id])
GO
ALTER TABLE [dbo].[Students] CHECK CONSTRAINT [FK_Students_Categories_CategoryId]
GO
ALTER TABLE [dbo].[Students]  WITH CHECK ADD  CONSTRAINT [FK_Students_Cities] FOREIGN KEY([CityId])
REFERENCES [dbo].[Cities] ([Id])
GO
ALTER TABLE [dbo].[Students] CHECK CONSTRAINT [FK_Students_Cities]
GO
ALTER TABLE [dbo].[Students]  WITH CHECK ADD  CONSTRAINT [FK_Students_Houses] FOREIGN KEY([HouseId])
REFERENCES [dbo].[Houses] ([Id])
GO
ALTER TABLE [dbo].[Students] CHECK CONSTRAINT [FK_Students_Houses]
GO
ALTER TABLE [dbo].[Students]  WITH CHECK ADD  CONSTRAINT [FK_Students_Religions] FOREIGN KEY([ReligionId])
REFERENCES [dbo].[Religions] ([Id])
GO
ALTER TABLE [dbo].[Students] CHECK CONSTRAINT [FK_Students_Religions]
GO
ALTER TABLE [dbo].[Students]  WITH CHECK ADD  CONSTRAINT [FK_Students_Schools_SchoolId] FOREIGN KEY([SchoolId])
REFERENCES [dbo].[Schools] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Students] CHECK CONSTRAINT [FK_Students_Schools_SchoolId]
GO
ALTER TABLE [dbo].[Students]  WITH CHECK ADD  CONSTRAINT [FK_Students_Sections] FOREIGN KEY([SectionId])
REFERENCES [dbo].[Sections] ([Id])
GO
ALTER TABLE [dbo].[Students] CHECK CONSTRAINT [FK_Students_Sections]
GO
ALTER TABLE [dbo].[Students]  WITH CHECK ADD  CONSTRAINT [FK_Students_Standards] FOREIGN KEY([StandardId])
REFERENCES [dbo].[Standards] ([Id])
GO
ALTER TABLE [dbo].[Students] CHECK CONSTRAINT [FK_Students_Standards]
GO
ALTER TABLE [dbo].[Students]  WITH CHECK ADD  CONSTRAINT [FK_Students_States] FOREIGN KEY([StateId])
REFERENCES [dbo].[States] ([Id])
GO
ALTER TABLE [dbo].[Students] CHECK CONSTRAINT [FK_Students_States]
GO
ALTER TABLE [dbo].[Students]  WITH CHECK ADD  CONSTRAINT [FK_Students_SubCastes] FOREIGN KEY([SubCasteId])
REFERENCES [dbo].[SubCastes] ([Id])
GO
ALTER TABLE [dbo].[Students] CHECK CONSTRAINT [FK_Students_SubCastes]
GO
ALTER TABLE [dbo].[SubCastes]  WITH CHECK ADD  CONSTRAINT [FK_SubCastes_Castes] FOREIGN KEY([CasteId])
REFERENCES [dbo].[Castes] ([Id])
GO
ALTER TABLE [dbo].[SubCastes] CHECK CONSTRAINT [FK_SubCastes_Castes]
GO
ALTER TABLE [dbo].[Teachers]  WITH CHECK ADD  CONSTRAINT [FK_Teachers_Schools_SchoolId] FOREIGN KEY([SchoolId])
REFERENCES [dbo].[Schools] ([Id])
GO
ALTER TABLE [dbo].[Teachers] CHECK CONSTRAINT [FK_Teachers_Schools_SchoolId]
GO
ALTER TABLE [dbo].[Teachers]  WITH CHECK ADD  CONSTRAINT [FK_Teachers_Users_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Teachers] CHECK CONSTRAINT [FK_Teachers_Users_UserId]
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD  CONSTRAINT [FK_Users_Roles_RoleId] FOREIGN KEY([RoleId])
REFERENCES [dbo].[Roles] ([Id])
GO
ALTER TABLE [dbo].[Users] CHECK CONSTRAINT [FK_Users_Roles_RoleId]
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD  CONSTRAINT [FK_Users_Schools_SchoolId] FOREIGN KEY([SchoolId])
REFERENCES [dbo].[Schools] ([Id])
GO
ALTER TABLE [dbo].[Users] CHECK CONSTRAINT [FK_Users_Schools_SchoolId]
GO
USE [master]
GO
ALTER DATABASE [ScanID_DB] SET  READ_WRITE 
GO
