# UI Refactor Migration Checklist

## 1. Folder and File Structure

- [ ] Create feature folders under `src/Mind.Client/src/components/`:
  - `education/`, `project/`, `company/`, `skill/`
- [ ] Inside each feature folder, create subfolders:
  - `edit/`, `create/`, `get/`, `list/`
- [ ] Move existing UI/logic components from route files to these subfolders, renaming as needed for clarity (e.g. `EducationEditForm.tsx`).

## 2. Parent Loader Components

- [ ] In each route file (e.g. `routes/education/edit.tsx`), create a parent component responsible for:
  - Data loading (queries, mutations)
  - State management
  - Passing data/handlers to the feature component (e.g. `<EducationEditForm ... />`)
- [ ] Remove UI/logic from route files, keeping only orchestration and data loading.

## 3. Refactor Imports

- [ ] Update all imports in route files to use new component locations.
- [ ] Update any cross-feature imports to use the new structure.

## 4. Test Strategy

- [ ] Ensure all routes render the correct parent and feature components.
- [ ] Test all CRUD flows for each feature (education, project, company, skill):
  - Create, Edit, Get/View, List
- [ ] Verify modal and handler logic still works after file moves.
- [ ] Run existing unit/integration tests and update as needed.

## 5. Documentation

- [ ] Update README or developer docs to describe the new structure and migration rationale.

## 6. Code Review & Approval

- [ ] Review the migration plan and checklist with the team.
- [ ] Get approval before starting the migration.

---

**Note:**

- Migrate one feature at a time to reduce risk.
- Use git branches for each migration step.
- Keep PRs focused and incremental for easier review.
