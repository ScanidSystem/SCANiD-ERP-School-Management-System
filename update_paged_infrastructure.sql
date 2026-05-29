-- Incremental update: Add stored procedures for stored-procedure-based server-side pagination, sorting, and filtering on AuditLogs and ErrorLogs.

IF OBJECT_ID('dbo.sp_GetAuditLogsPaged', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_GetAuditLogsPaged;
GO
CREATE PROCEDURE dbo.sp_GetAuditLogsPaged
    @Page INT = 1,
    @PageSize INT = 10,
    @SortBy NVARCHAR(50) = 'timestamp',
    @SortOrder NVARCHAR(10) = 'DESC'
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @TotalCount INT;
    SELECT @TotalCount = COUNT_BIG(*) FROM [dbo].[AuditLogs];

    DECLARE @Skip INT = (@Page - 1) * @PageSize;
    IF @Skip < 0 SET @Skip = 0;

    SELECT *, @TotalCount AS TotalCount
    FROM [dbo].[AuditLogs]
    ORDER BY
        CASE WHEN UPPER(@SortOrder) = 'ASC' AND (LOWER(@SortBy) = 'timestamp' OR LOWER(@SortBy) = 'datetime') THEN [DateTime] END ASC,
        CASE WHEN UPPER(@SortOrder) = 'DESC' AND (LOWER(@SortBy) = 'timestamp' OR LOWER(@SortBy) = 'datetime') THEN [DateTime] END DESC,

        CASE WHEN UPPER(@SortOrder) = 'ASC' AND LOWER(@SortBy) = 'type' THEN [Type] END ASC,
        CASE WHEN UPPER(@SortOrder) = 'DESC' AND LOWER(@SortBy) = 'type' THEN [Type] END DESC,

        CASE WHEN UPPER(@SortOrder) = 'ASC' AND (LOWER(@SortBy) = 'tablename' OR LOWER(@SortBy) = 'entity' OR LOWER(@SortBy) = 'entityaffected') THEN TableName END ASC,
        CASE WHEN UPPER(@SortOrder) = 'DESC' AND (LOWER(@SortBy) = 'tablename' OR LOWER(@SortBy) = 'entity' OR LOWER(@SortBy) = 'entityaffected') THEN TableName END DESC,

        CASE WHEN UPPER(@SortOrder) = 'ASC' AND LOWER(@SortBy) = 'primarykey' THEN PrimaryKey END ASC,
        CASE WHEN UPPER(@SortOrder) = 'DESC' AND LOWER(@SortBy) = 'primarykey' THEN PrimaryKey END DESC,

        CASE WHEN UPPER(@SortOrder) = 'ASC' AND (@SortBy IS NULL OR @SortBy = '') THEN [DateTime] END ASC,
        CASE WHEN UPPER(@SortOrder) = 'DESC' AND (@SortBy IS NULL OR @SortBy = '') THEN [DateTime] END DESC
    OFFSET @Skip ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END;
GO

IF OBJECT_ID('dbo.sp_GetErrorLogsPaged', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_GetErrorLogsPaged;
GO
CREATE PROCEDURE dbo.sp_GetErrorLogsPaged
    @Page INT = 1,
    @PageSize INT = 10,
    @SortBy NVARCHAR(50) = 'timestamp',
    @SortOrder NVARCHAR(10) = 'DESC'
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @TotalCount INT;
    SELECT @TotalCount = COUNT_BIG(*) FROM [dbo].[ErrorLogs];

    DECLARE @Skip INT = (@Page - 1) * @PageSize;
    IF @Skip < 0 SET @Skip = 0;

    SELECT *, @TotalCount AS TotalCount
    FROM [dbo].[ErrorLogs]
    ORDER BY
        CASE WHEN UPPER(@SortOrder) = 'ASC' AND (LOWER(@SortBy) = 'timestamp' OR LOWER(@SortBy) = 'datetime' OR LOWER(@SortBy) = 'date' OR LOWER(@SortBy) = 'time') THEN [Timestamp] END ASC,
        CASE WHEN UPPER(@SortOrder) = 'DESC' AND (LOWER(@SortBy) = 'timestamp' OR LOWER(@SortBy) = 'datetime' OR LOWER(@SortBy) = 'date' OR LOWER(@SortBy) = 'time') THEN [Timestamp] END DESC,

        CASE WHEN UPPER(@SortOrder) = 'ASC' AND (LOWER(@SortBy) = 'level' OR LOWER(@SortBy) = 'severity') THEN [Level] END ASC,
        CASE WHEN UPPER(@SortOrder) = 'DESC' AND (LOWER(@SortBy) = 'level' OR LOWER(@SortBy) = 'severity') THEN [Level] END DESC,

        CASE WHEN UPPER(@SortOrder) = 'ASC' AND (LOWER(@SortBy) = 'properties' OR LOWER(@SortBy) = 'origin') THEN [Properties] END ASC,
        CASE WHEN UPPER(@SortOrder) = 'DESC' AND (LOWER(@SortBy) = 'properties' OR LOWER(@SortBy) = 'origin') THEN [Properties] END DESC,

        CASE WHEN UPPER(@SortOrder) = 'ASC' AND (@SortBy IS NULL OR @SortBy = '') THEN [Timestamp] END ASC,
        CASE WHEN UPPER(@SortOrder) = 'DESC' AND (@SortBy IS NULL OR @SortBy = '') THEN [Timestamp] END DESC
    OFFSET @Skip ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END;
GO

IF OBJECT_ID('dbo.sp_GetTeachersPaged', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_GetTeachersPaged;
GO
CREATE PROCEDURE dbo.sp_GetTeachersPaged
    @SchoolId INT = NULL,
    @AcademicYearId INT = NULL,
    @Page INT = 1,
    @PageSize INT = 10,
    @SortBy NVARCHAR(50) = NULL,
    @SortOrder NVARCHAR(10) = 'ASC',
    @Search NVARCHAR(255) = NULL,
    @Status NVARCHAR(50) = NULL,
    @Subject NVARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    WITH FilteredTeachers AS (
        SELECT t.*, u.Name AS UserName, u.Email AS UserEmail
        FROM [dbo].[Teachers] t
        LEFT JOIN [dbo].[Users] u ON t.UserId = u.Id
        WHERE t.IsDeleted = 0
          AND (@SchoolId IS NULL OR t.SchoolId = @SchoolId)
          AND (@Status IS NULL OR @Status = '' OR @Status = 'all' OR t.Status = @Status)
          AND (@Subject IS NULL OR @Subject = '' OR @Subject = 'all' OR t.Subject = @Subject)
          AND (@Search IS NULL OR @Search = '' OR 
               u.Name LIKE '%' + @Search + '%' OR 
               u.Email LIKE '%' + @Search + '%' OR 
               t.ContactNumber LIKE '%' + @Search + '%' OR 
               t.Qualification LIKE '%' + @Search + '%' OR 
               t.Department LIKE '%' + @Search + '%' OR 
               t.Subject LIKE '%' + @Search + '%' OR 
               t.EmployeeId LIKE '%' + @Search + '%')
    ),
    Total AS (
        SELECT COUNT_BIG(*) AS TotalCount FROM FilteredTeachers
    )
    SELECT ft.*, tot.TotalCount
    FROM FilteredTeachers ft
    CROSS JOIN Total tot
    ORDER BY
        CASE WHEN UPPER(@SortOrder) = 'ASC' AND LOWER(@SortBy) = 'name' THEN ft.UserName END ASC,
        CASE WHEN UPPER(@SortOrder) = 'DESC' AND LOWER(@SortBy) = 'name' THEN ft.UserName END DESC,

        CASE WHEN UPPER(@SortOrder) = 'ASC' AND LOWER(@SortBy) = 'email' THEN ft.UserEmail END ASC,
        CASE WHEN UPPER(@SortOrder) = 'DESC' AND LOWER(@SortBy) = 'email' THEN ft.UserEmail END DESC,

        CASE WHEN UPPER(@SortOrder) = 'ASC' AND LOWER(@SortBy) = 'phone' THEN ft.ContactNumber END ASC,
        CASE WHEN UPPER(@SortOrder) = 'DESC' AND LOWER(@SortBy) = 'phone' THEN ft.ContactNumber END DESC,

        CASE WHEN UPPER(@SortOrder) = 'ASC' AND LOWER(@SortBy) = 'employeeid' THEN ft.EmployeeId END ASC,
        CASE WHEN UPPER(@SortOrder) = 'DESC' AND LOWER(@SortBy) = 'employeeid' THEN ft.EmployeeId END DESC,

        CASE WHEN UPPER(@SortOrder) = 'ASC' AND LOWER(@SortBy) = 'subject' THEN ft.Subject END ASC,
        CASE WHEN UPPER(@SortOrder) = 'DESC' AND LOWER(@SortBy) = 'subject' THEN ft.Subject END DESC,

        CASE WHEN UPPER(@SortOrder) = 'ASC' AND LOWER(@SortBy) = 'status' THEN ft.Status END ASC,
        CASE WHEN UPPER(@SortOrder) = 'DESC' AND LOWER(@SortBy) = 'status' THEN ft.Status END DESC,

        CASE WHEN UPPER(@SortOrder) = 'ASC' AND (@SortBy IS NULL OR @SortBy = '') THEN ft.UserName END ASC,
        CASE WHEN UPPER(@SortOrder) = 'DESC' AND (@SortBy IS NULL OR @SortBy = '') THEN ft.UserName END DESC
    OFFSET (@Page - 1) * @PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END;
GO

IF OBJECT_ID('dbo.sp_GetUsersPaged', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_GetUsersPaged;
GO
CREATE PROCEDURE dbo.sp_GetUsersPaged
    @Page INT = 1,
    @PageSize INT = 10,
    @SortBy NVARCHAR(50) = NULL,
    @SortOrder NVARCHAR(10) = 'ASC',
    @Search NVARCHAR(255) = NULL,
    @RoleId INT = NULL,
    @SchoolId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    WITH FilteredUsers AS (
        SELECT u.*, s.Name AS SchoolName
        FROM [dbo].[Users] u
        LEFT JOIN [dbo].[Schools] s ON u.SchoolId = s.Id
        WHERE u.IsDeleted = 0
          -- Handle school filter
          AND (@SchoolId IS NULL OR u.SchoolId = @SchoolId)
          -- Filter RoleId (if present)
          AND (@RoleId IS NULL OR u.RoleId = @RoleId OR u.Role = CAST(@RoleId AS NVARCHAR(50)))
          -- Filter Search
          AND (@Search IS NULL OR @Search = '' OR 
               u.Name LIKE '%' + @Search + '%' OR 
               u.Email LIKE '%' + @Search + '%' OR 
               u.Username LIKE '%' + @Search + '%' OR 
               u.Role LIKE '%' + @Search + '%')
    ),
    Total AS (
        SELECT COUNT_BIG(*) AS TotalCount FROM FilteredUsers
    )
    SELECT fu.*, tot.TotalCount
    FROM FilteredUsers fu
    CROSS JOIN Total tot
    ORDER BY
        CASE WHEN UPPER(@SortOrder) = 'ASC' AND LOWER(@SortBy) = 'name' THEN fu.Name END ASC,
        CASE WHEN UPPER(@SortOrder) = 'DESC' AND LOWER(@SortBy) = 'name' THEN fu.Name END DESC,

        CASE WHEN UPPER(@SortOrder) = 'ASC' AND LOWER(@SortBy) = 'email' THEN fu.Email END ASC,
        CASE WHEN UPPER(@SortOrder) = 'DESC' AND LOWER(@SortBy) = 'email' THEN fu.Email END DESC,

        CASE WHEN UPPER(@SortOrder) = 'ASC' AND LOWER(@SortBy) = 'username' THEN fu.Username END ASC,
        CASE WHEN UPPER(@SortOrder) = 'DESC' AND LOWER(@SortBy) = 'username' THEN fu.Username END DESC,

        CASE WHEN UPPER(@SortOrder) = 'ASC' AND LOWER(@SortBy) = 'role' THEN fu.Role END ASC,
        CASE WHEN UPPER(@SortOrder) = 'DESC' AND LOWER(@SortBy) = 'role' THEN fu.Role END DESC,

        CASE WHEN UPPER(@SortOrder) = 'ASC' AND (@SortBy IS NULL OR @SortBy = '') THEN fu.Name END ASC,
        CASE WHEN UPPER(@SortOrder) = 'DESC' AND (@SortBy IS NULL OR @SortBy = '') THEN fu.Name END DESC
    OFFSET (@Page - 1) * @PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END;
GO
