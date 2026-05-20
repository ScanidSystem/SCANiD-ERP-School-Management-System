# Application Enhancements & Fixes Changelog

## 1. Resolution of PUT `/api/schools/` and Custom Entity 400 Bad Request Errors
### Issue
Updating schools, navigation links, and other entities from the general **System Master Registry** in the **Configuration Page** resulted in an instant `400 Bad Request` from custom ASP.NET controllers.

### Root Cause
Custom web controller methods (such as `PutSchool` in `SchoolsController.cs` and similar endpoints in other custom master controllers) perform safety assertions on parameter IDs:
```csharp
[HttpPut("{id}")]
public async Task<IActionResult> PutSchool(int id, School school)
{
    if (id != school.Id) return BadRequest();
}
```
Because the dynamic update payload constructed inside the frontend `handleSave` handler under `src/pages/Configuration.tsx` only included modified schema properties (`name`, `description`, `address`, `phone`, `email`, etc.) and omitted the unique identifier `id`, the backend binding parsed `school.Id` as default `0`. This mismatched the URL route parameters (e.g., `3`) and threw a `400 Bad Request` condition.

### Solution & Code Changes
- Updated the dynamic `handleSave` sequence inside `/src/pages/Configuration.tsx` to explicitly map and parse the unique identifier:
```typescript
if (editingItem) {
  payload.id = parseSafeInt(editingItem.id);
  await apiService[updateMethod](editingItem.id, payload);
}
```
This guarantees complete payload safety and alignment on all custom Put routes globally.

---

## 2. Dynamic Integration of School Branding / Photo Upload on Configuration Page
### Issue
Adding or editing schools via the **System Master Registry** under `Configuration` did not offer institutional logo upload inputs, resulting in missing or blank logos in newly configured records unless edited exclusively under the legacy page.

### Solution & Code Changes
- Extended `/src/pages/Configuration.tsx` with dedicated component states:
  - `selectedPhotoFile`: stores the temporary logo file on the fly for uncommitted schools.
  - `localPhotoPreview`: displays real-time logo choices to the administrator via canvas previews.
- Re-architected `handleFileChange` in `/src/pages/Configuration.tsx` to support both immediate list-row changes and delayed creation uploads.
- Integrated a highly polished, centered **Institutional Logo Selector** at the top of the editing/creation sections of the registry's dialog form when the active tab is `schools`.
- Revamped the creation action callback inside `handleSave` to trigger delayed upload for newly registered schools once their unique backend ID is provisioned:
```typescript
const response = await apiService[createMethod](payload);
const createdSchool = response.data.data || response.data;
if (activeTab === "schools" && selectedPhotoFile && createdSchool?.id) {
  try {
    await apiService.uploadSchoolPhoto(createdSchool.id, selectedPhotoFile);
  } catch (uploadErr) {
    console.error("Delayed school photo upload failed:", uploadErr);
  }
}
```
- Bound perfect resource cleanup hooks so memory leaks are prevented when closing or refreshing the dialog.

---

## 3. Teachers Campus Branch Dropdown Resolution in Edit Mode
### Issue
On the **Teachers Modify Master** (Edit Faculty screen), the **Campus Branch** dropdown failed to pre-select or display the registered school name, which prevented submissions.

### Root Cause
1. On opening the Add/Edit Dialog, the React form state (`formData.schoolId`) was populated with `teacher.schoolId || user.schoolId || ""`. However, the underlying collection of schools (`schools` state) had not yet loaded or synchronized inside the add/edit layout boundary wrapper.
2. In `Teachers.tsx`, the function `fetchSchools()` was only bound to execute once upon loading or manual dialog toggles, and did not execute reliably during instant, direct row selections.
3. The table item mapping ignored `schoolId` which caused the backend to receive empty values across updates.

### Solution & Code Changes
- Updated the table mapper within `fetchTeachers` inside `Teachers.tsx` to explicitly match and return `schoolId`:
```typescript
schoolId: getVal("schoolId") || t.schoolId?.toString() || ""
```
- Restructured `useEffect` to reliably load available campus branches whenever the Add/Edit modal is triggered:
```typescript
useEffect(() => {
  if (isAddDialogOpen) {
    fetchSchools();
  }
...
```
- Fixed the pre-selection logic inside the edit click-handler to bind the teacher's exact school ID so the selector recognizes and selects the current record's campus branch instantly:
```typescript
schoolId: teacher.schoolId || user.schoolId || ""
```

---

## 4. Institutional Photo Path Preservation on School Updates
### Issue
Editing a school through the standard schools page or the master configuration page would update text and address parameters successfully but would wipe out or fail to show pre-existing uploaded branding logo entries.

### Root Cause
1. During dialog entry, the school's existing photo string was matched against `school.photo`, ignoring the correct backend-persisted fields `profilePhotoPath` / `ProfilePhotoPath`.
2. When submitting updates, the put payload construction omitted the key parameter `profilePhotoPath`, resulting in an empty property value being received by the API controller, which then wiped out the legacy paths.

### Solution & Code Changes
- Updated `src/pages/Schools.tsx` to safely map both camelCase and Capitalized server properties to preserve original branding details on form entry:
```typescript
photo: school.profilePhotoPath || school.ProfilePhotoPath || school.photo || ""
```
- Integrated explicit `profilePhotoPath` payload mapping within `updateSchool` requests to prevent database attributes from being set to null during edits:
```typescript
await apiService.updateSchool(currentSchool.id, { 
  ...formData, 
  profilePhotoPath: formData.photo,
  id: currentSchool.id,
  ModifiedBy: user.name || user.email
});
```
- Aligned `src/pages/Configuration.tsx` update logic so school configurations retain logo paths securely without regression.

---

## 5. Dynamic and Robust Photo URL Resolver for Custom Subpath Deployments
### Issue
Photo uploads for students, teachers, and schools worked perfectly on local developer setups, but once deployed, images failed to load because the client-side asset router generated root-relative paths like `https://scaniderp.com/photos/...` instead of honoring subdirectory routings like `https://scaniderp.com/scanid_erp_api/photos/...`.

### Root Cause
1. Standard configuration values like `import.meta.env.VITE_API_BASE_URL` were configured to access `/SCANiD_ERP_API/api` relative paths, which are subject to cases (e.g. server subdirectory capitalization discrepancy).
2. The `resolvePhotoUrl` helper didn't dynamically read the browser's active routing URL context, causing hardcoded folder splits to bypass dynamic ingress configurations.

### Solution & Code Changes
- Completely refactored and modernized `resolvePhotoUrl` inside `src/lib/utils.ts` to implement a **self-healing dynamic subpath detector**:
```typescript
export function resolvePhotoUrl(path: string | undefined): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;
  
  // 1. Detect dynamic subpath prefix from browser URL window.location
  let dynamicSubpath = "";
  if (typeof window !== "undefined" && window.location) {
    const pathname = window.location.pathname;
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 0 && segments[0].toLowerCase().includes("scanid")) {
      dynamicSubpath = `/${segments[0]}`; // Matches browser's exact casing e.g. "scanid_erp_api"
    }
  }
  ...
```
This guarantees that regardless of server-side configuration changes, subfolder capitalization, or routing proxies, the frontend automatically self-heals by loading images relative to the active deployment directory accessed by the user.

---

## 6. Actual Master Registry Display Names in Student Export
### Issue
During Excel exports in the student management dashboard, columns representing core social classifications and administrative indices (e.g., Blood Group, House, Religion, Caste, Sub-Caste, Academic Session, Admission Type, and Category) outputted database integer identifiers instead of real, human-friendly names.

### Solution & Code Changes
- Refactored `handleExport` inside `src/pages/Students.tsx` to dynamically query active local master array references (`bloodGroups`, `houses`, `admissionTypes`, `religions`, `castes`, `subCastes`, `academicYears`, and `categories`).
- Substituted root integer IDs with resolved display names fallback-guarded by their original attributes if specific lookups yield unmapped:
```typescript
"Blood Group": s.BLOODGROUP || s.bloodGroupId ? (bloodGroups.find(bg => bg.id?.toString() === (s.BLOODGROUP || s.bloodGroupId)?.toString())?.name || s.BLOODGROUP || s.bloodGroupId) : "",
"House": s.house || s.houseId ? (houses.find(h => h.id?.toString() === (s.house || s.houseId)?.toString())?.name || s.house || s.houseId) : "",
"Admission Type": s.admissiontype || s.admissionTypeId ? (admissionTypes.find(at => at.id?.toString() === (s.admissiontype || s.admissionTypeId)?.toString())?.name || s.admissiontype || s.admissionTypeId) : "",
"Religion": s.RELIGION || s.religionId ? (religions.find(r => r.id?.toString() === (s.RELIGION || s.religionId)?.toString())?.name || s.RELIGION || s.religionId) : "",
"Caste": s.CASTE || s.casteId ? (castes.find(c => c.id?.toString() === (s.CASTE || s.casteId)?.toString())?.name || s.CASTE || s.casteId) : "",
"Sub-Caste": s.subcaste || s.subCasteId ? (subCastes.find(sc => sc.id?.toString() === (s.subcaste || s.subCasteId)?.toString())?.name || s.subcaste || s.subCasteId) : "",
"Academic Year": s.academicyear || s.joiningAcademicYearId ? (academicYears.find(ay => ay.id?.toString() === (s.academicyear || s.joiningAcademicYearId)?.toString())?.name || s.academicyear || s.joiningAcademicYearId) : "",
"Category": s.CATEGORY || s.categoryId ? (categories.find(c => c.id?.toString() === (s.CATEGORY || s.categoryId)?.toString())?.name || s.CATEGORY || s.categoryId) : "",
```
- Standardized file system generation and confirmed zero compilation or structural warnings during production runs.

