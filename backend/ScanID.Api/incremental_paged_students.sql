-- Incremental Script: Add sp_GetStudentsPaged stored procedure for optimized server-side pagination, sorting, and filtering.

IF OBJECT_ID('dbo.sp_GetStudentsPaged', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_GetStudentsPaged;
GO
CREATE PROCEDURE dbo.sp_GetStudentsPaged
    @SchoolId INT = NULL,
    @AcademicYearId INT = NULL,
    @Page INT = 1,
    @PageSize INT = 10,
    @SortBy NVARCHAR(50) = NULL,
    @SortOrder NVARCHAR(10) = 'ASC',
    @Search NVARCHAR(255) = NULL,
    @StandardId INT = NULL,
    @SectionId INT = NULL,
    @LastId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @SearchLower NVARCHAR(255) = NULL;
    IF @Search IS NOT NULL AND TRIM(@Search) <> ''
    BEGIN
        SET @SearchLower = LOWER(TRIM(@Search));
    END

    -- Calculate total matching records count in a single execution
    DECLARE @TotalCount INT;
    SELECT @TotalCount = COUNT_BIG(*)
    FROM [dbo].[Students] s
    WHERE s.IsDeleted = 0
      AND (@SchoolId IS NULL OR s.SchoolId = @SchoolId)
      AND (@AcademicYearId IS NULL OR s.AcademicYearId = @AcademicYearId)
      AND (@StandardId IS NULL OR s.StandardId = @StandardId)
      AND (@SectionId IS NULL OR s.SectionId = @SectionId)
      AND (
           @SearchLower IS NULL OR 
           LOWER(s.Name) LIKE '%' + @SearchLower + '%' OR
           LOWER(s.GrNo) LIKE '%' + @SearchLower + '%' OR
           CAST(s.RollNumber AS NVARCHAR(50)) LIKE '%' + @SearchLower + '%'
      );

    -- Pagination skip details
    DECLARE @Skip INT = (@Page - 1) * @PageSize;
    IF @Skip < 0 SET @Skip = 0;

    -- Query the paginated slice
    SELECT s.*, 
           std.Name AS StandardName, 
           sec.Name AS SectionName, 
           ay.Name AS AcademicYearName,
           c.Name AS CityName,
           st.Name AS StateName,
           @TotalCount AS TotalCount
    FROM [dbo].[Students] s
    LEFT JOIN [dbo].[Standards] std ON s.StandardId = std.Id
    LEFT JOIN [dbo].[Sections] sec ON s.SectionId = sec.Id
    LEFT JOIN [dbo].[AcademicYears] ay ON s.AcademicYearId = ay.Id
    LEFT JOIN [dbo].[Cities] c ON s.CityId = c.Id
    LEFT JOIN [dbo].[States] st ON s.StateId = st.Id
    WHERE s.IsDeleted = 0
      AND (@SchoolId IS NULL OR s.SchoolId = @SchoolId)
      AND (@AcademicYearId IS NULL OR s.AcademicYearId = @AcademicYearId)
      AND (@StandardId IS NULL OR s.StandardId = @StandardId)
      AND (@SectionId IS NULL OR s.SectionId = @SectionId)
      AND (
           @SearchLower IS NULL OR 
           LOWER(s.Name) LIKE '%' + @SearchLower + '%' OR
           LOWER(s.GrNo) LIKE '%' + @SearchLower + '%' OR
           CAST(s.RollNumber AS NVARCHAR(50)) LIKE '%' + @SearchLower + '%'
      )
      AND (
           -- Keyset pagination support
           (@LastId IS NULL OR @LastId <= 0) OR (s.Id > @LastId)
      )
    ORDER BY 
        -- Dynamic Sorting Logic
        CASE WHEN UPPER(@SortOrder) = 'ASC' AND LOWER(@SortBy) = 'name' THEN s.Name END ASC,
        CASE WHEN UPPER(@SortOrder) = 'DESC' AND LOWER(@SortBy) = 'name' THEN s.Name END DESC,
        
        CASE WHEN UPPER(@SortOrder) = 'ASC' AND (LOWER(@SortBy) = 'grno' OR LOWER(@SortBy) = 'registrationnumber') THEN s.GrNo END ASC,
        CASE WHEN UPPER(@SortOrder) = 'DESC' AND (LOWER(@SortBy) = 'grno' OR LOWER(@SortBy) = 'registrationnumber') THEN s.GrNo END DESC,
        
        CASE WHEN UPPER(@SortOrder) = 'ASC' AND (LOWER(@SortBy) = 'roll' OR LOWER(@SortBy) = 'rollnumber') THEN s.RollNumber END ASC,
        CASE WHEN UPPER(@SortOrder) = 'DESC' AND (LOWER(@SortBy) = 'roll' OR LOWER(@SortBy) = 'rollnumber') THEN s.RollNumber END DESC,
        
        CASE WHEN UPPER(@SortOrder) = 'ASC' AND LOWER(@SortBy) = 'standard' THEN std.Name END ASC,
        CASE WHEN UPPER(@SortOrder) = 'DESC' AND LOWER(@SortBy) = 'standard' THEN std.Name END DESC,
        
        CASE WHEN UPPER(@SortOrder) = 'ASC' AND LOWER(@SortBy) = 'section' THEN sec.Name END ASC,
        CASE WHEN UPPER(@SortOrder) = 'DESC' AND LOWER(@SortBy) = 'section' THEN sec.Name END DESC,
        
        -- Default sorting fallback
        CASE WHEN UPPER(@SortOrder) = 'DESC' AND (@SortBy IS NULL OR @SortBy = '') THEN s.Id END DESC,
        CASE WHEN UPPER(@SortOrder) = 'ASC' AND (@SortBy IS NULL OR @SortBy = '') THEN s.Id END ASC,
        s.Id ASC
        
    OFFSET CASE WHEN @LastId IS NOT NULL AND @LastId > 0 THEN 0 ELSE @Skip END ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END;
GO
