## Security Notes (Concept)

This repository is a concept/prototype. The following measures are included to promote safe defaults for demos and local runs:

- Authentication: Django REST Framework TokenAuthentication; all API endpoints require auth by default.
- Authorization: File queries are owner-scoped; soft deletes prevent data loss and preserve analytics.
- Throttling: DRF user/anon throttles (configurable via env: `DRF_THROTTLE_USER`, `DRF_THROTTLE_ANON`).
- CORS: Open in DEBUG. In non-DEBUG, restrict to `CORS_ALLOWED_ORIGINS` env var.
- Security headers: In non-DEBUG, HSTS, SSL redirect, secure cookies, no-sniff, X-Frame-Options, and strict referrer policy.
- Upload validation: Basic extension allowlist and 1GB per-file limit for the demo.
- Downloads: Streamed via `FileResponse` with correct filename; exposes `Content-Disposition` for frontend.
- Secrets: Read `DJANGO_SECRET_KEY` from env if provided.

### Deployment Guidance (if adapted beyond concept)
- Use HTTPS everywhere; terminate TLS at the edge.
- Replace token auth with session auth or short-lived JWTs and CSRF protection.
- Store secrets in a vault; rotate keys regularly.
- Scan uploads with AV (e.g., ClamAV) and store in object storage (S3/GCS) with signed URLs.
- Add object-level permissions in the ORM and API serializers.
- Add audit logs for auth/file actions; centralize logs.
- Set `DEBUG=False`, configure `ALLOWED_HOSTS`, and restrict CORS.
- Enable database backups and encryption at rest (provider-managed where possible).

This is not production security guidance, but a pragmatic baseline for a demo.


