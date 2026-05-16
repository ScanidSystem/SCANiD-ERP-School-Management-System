/*
  ScanID Communication & Notifications Master Update
  Description: Adds Notifications table and seeds the Communication module.
*/

-- 1. NOTIFICATIONS TABLE
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Notifications]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[Notifications](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [UserId] [int] NULL, -- NULL means broadcast to all
    [TargetRole] [nvarchar](100) NULL, -- Target a specific role
    [Title] [nvarchar](255) NOT NULL,
    [Message] [nvarchar](max) NOT NULL,
    [Type] [nvarchar](50) NOT NULL DEFAULT ('info'), -- info, success, warning, error
    [IsRead] [bit] NOT NULL DEFAULT (0),
    [CreatedAt] [datetime2](7) NOT NULL DEFAULT (GETUTCDATE()),
    [IsDeleted] [bit] NOT NULL DEFAULT (0),
 CONSTRAINT [PK_Notifications] PRIMARY KEY CLUSTERED ([Id] ASC)
)
END
GO

-- 2. SEED SAMPLE NOTIFICATIONS
INSERT INTO [dbo].[Notifications] ([Title], [Message], [Type], [TargetRole])
VALUES 
('System Maintenance', 'Scheduled maintenance on Sunday from 2 AM to 4 AM.', 'warning', 'all'),
('Quarterly Results', 'Grade reports for Q1 are now available for review.', 'info', 'Teacher'),
('Fee Reminder', 'Early bird discount for next semester ends on May 30th.', 'success', 'Parent');
GO

-- 3. SEED SAMPLE MESSAGES
DECLARE @SuperAdminUserId INT = (SELECT TOP 1 Id FROM [dbo].[Users] WHERE [Role] = 'SuperAdmin' OR [Role] = 'Super Admin');
DECLARE @TeacherUserId INT = (SELECT TOP 1 Id FROM [dbo].[Users] WHERE [Role] = 'Teacher');

IF @SuperAdminUserId IS NOT NULL AND @TeacherUserId IS NOT NULL
BEGIN
    INSERT INTO [dbo].[Messages] ([SenderId], [ReceiverId], [Subject], [Content], [IsRead], [Type])
    VALUES 
    (@SuperAdminUserId, @TeacherUserId, 'Lesson Plan Review', 'Please submit your lesson plans for the upcoming month by Friday.', 0, 'Direct'),
    (@TeacherUserId, @SuperAdminUserId, 'Resource Request', 'We need additional lab equipment for the chemistry department.', 1, 'Direct');
END
GO
