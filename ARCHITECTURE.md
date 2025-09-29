## Architecture (Concept)

### Frontend
- HTML pages: `index.html`, `login.html`, `register.html`, `pricing.html`, `dashboard.html`
- Styling: `style.css` (theme tokens, components, layout)
- Logic: `main.js` (auth flows, file CRUD, analytics charts, UI wiring)
- Charts: Chart.js; colors centralized via a palette

### Backend (Demo Shape)
- Django/DRF structure illustrated in `backend/main/apps/*`
- Endpoints used by the frontend in concept: `/api/files/`, `/api/analytics/`, `/api/user-subscription/`, `/api/files/<id>/download/`
- Soft delete and download filename handling are demonstrated

### Data Flow (Files → UI)
1. User authenticates → token stored (concept)
2. Frontend requests files → categorizes by extension → storage visualization
3. Analytics aggregate counts and trends from the same file list
4. Download and delete actions update backend state; UI refreshes

### Not Production Ready
- No production auth/session hardening
- No storage provider integration (S3, GCS, etc.)
- No CI/CD, monitoring, or infra definitions


