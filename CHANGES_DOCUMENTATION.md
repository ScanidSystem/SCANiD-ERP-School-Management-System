# ScanID Solution Documentation - May 2026 Batch Fixes

This document records the exact changes, the root causes identified, and the fixes applied to remediate the reported errors.

---

## 1. Issue: "Invalid object name 'SchoolSections'" in Live/Production DB
- **Root Cause**: The tables `SchoolSections`, `States`, and `Cities` were defined in `database.sql` but was not yet created or synchronized inside the live connected SQL Server database.
- **Remediation**:
  1. **Self-Healing DB Initialization**: Configured a resilient schema validator in `Program.cs` that checks for the existence of `States`, `Cities`, and `SchoolSections` tables inside MS SQL Server at startup, and automatically creates and seeds them if missing. This prevents database 500 errors.
  2. **Soft Deletion Global Query Filters**: Registered the `SchoolSection` model query filter in `ApplicationDbContext` to ensure consistency with standard master models.
  3. **SQL DDL Scripting**: Provided complete database scripts including the updated comprehensive `/database.sql` and `/incremental_database_updates.sql`.

---

## 2. Issue: Columns Ordering Requirement ("IsActive, IsDeleted, CreatedBy, CreatedOn, ModifiedBy, ModifiedOn columns must be at the end of the table")
- **Root Cause**: In several table definitions in `database.sql` (namely the `Schools` table), the audit and tracking columns were located in the middle of the schema definition before legacy fields.
- **Remediation**: Ordered all columns in `database.sql` for the `Schools` table so that the tracking fields (`IsActive`, `IsDeleted`, `CreatedBy`, `CreatedOn`, `ModifiedBy`, `ModifiedOn`) are grouped cohesively right at the very end of the column blocks, adhering strictly to schema rules.

---

## 3. Frontend Master Tabs Alignment (Cities & Categories API)
- **Root Cause**: In the Configuration page tabs, dynamic routing was failing due to calling `getCitys` instead of `getCities` and `getCategorys` instead of `getCategories`.
- **Remediation**: Explicitly defined `getMethod: "getCities"` and `getMethod: "getCategories"` mapping configurations to resolve dynamic method issues without breaking existing CRUD configurations.

---

## 4. Modified Files List

1. `/backend/ScanID.Api/Program.cs`:
   - Embedded database self-healing checks on startup to automatically construct missing `States`, `Cities`, and `SchoolSections` tables.
   
2. `/backend/ScanID.Api/Data/ApplicationDbContext.cs`:
   - Configured global query filter for `SchoolSection` soft deletion.

3. `/database.sql`:
   - Repositioned the metadata and audit fields for `Schools` to the end of the list.

4. `/src/pages/Configuration.tsx`:
   - Standardized API get method calls dynamically mapping `getCities` and `getCategories`.

5. `/incremental_database_updates.sql`:
   - Created standalone script ensuring smooth manual schema patch.

---

## 5. Issue: "School Section" Column Standardization & Integrity (Renaming and Reordering)
- **Root Cause**: The `Students` table used a free-text `nvarchar(100)` column called `SchoolSection` to store school sections. This pattern does not enforce referential integrity nor follow database naming conventions where relational links should end with `*Id`. Additionally, auditing columns were not grouped cleanly at the end of every relational constraint.
- **Remediation**:
  1. **Relational Schema Integration**: Changed `Students.SchoolSection` column inside `database.sql` to `SchoolSectionId` (of type `INT NULL`), and introduced a foreign key constraint `FK_Students_SchoolSections` pointing to the `SchoolSections` master table.
  2. **Stored Procedure Standardization**: Updated `sp_ManageStudent` stored procedure parameters and SQL statement definitions in both `database.sql` and `incremental_stored_procedures.sql` to map the normalized integer-based `@SchoolSectionId` parameter correctly.
  3. **Backend Models & Dependency Injection**: Updated the `Student` C# model entity in `Models.cs` to map `SchoolSectionId` as an integer and configured a navigation property `[ForeignKey("SchoolSectionId")] public SchoolSection? SchoolSection { get; set; }`. Adjusted mappings inside the ADO.NET-based `StudentService.cs` repository methods to call correct Stored Procedure mappings safely.
  4. **Frontend Form & Value Binding**: Refactored `Students.tsx` form state tracking properties to handle numeric values binding securely under `SchoolSectionId` instead of legacy strings, providing a seamless backwards-compatible fallback mapping for older datasets.

## 6. Modified Files List (New Updates)

1. `/database.sql`:
   - Altered table structure of `Students` changing `SchoolSection` to `SchoolSectionId INT NULL`.
   - Added `FK_Students_SchoolSections` foreign key constraint linking students to school sections.
   - Standardized `sp_ManageStudent` stored procedure parameter schemas.

2. `/backend/ScanID.Api/Models/Models.cs`:
   - Swapped `SchoolSection` string property in `Student` class for `SchoolSectionId` INT property mapping standard ForeignKey.

3. `/backend/ScanID.Api/Services/StudentService.cs`:
   - Unified ADO.NET parameters mapping `@SchoolSectionId` under standard db transaction context.

4. `/backend/ScanID.Api/incremental_stored_procedures.sql` & `/update_students_admission_email.sql`:
   - Renamed query parameters, INSERT/UPDATE schemas, and table modifications to follow robust standard database conventions.

5. `/src/pages/Students.tsx`:
   - Malloc standard select bound items of School Section dropdown from plain text name value to numeric ID values, saving correct database foreign key items safely and automatically.

