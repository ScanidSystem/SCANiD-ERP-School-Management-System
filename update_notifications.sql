-- Incremental update: Add Notifications table
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
