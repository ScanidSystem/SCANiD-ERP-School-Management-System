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
