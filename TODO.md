# TODO / Auth fix tracking

- [x] Add JWT auth endpoints to backend: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`, `/api/auth/logout`
- [x] Hash passwords with bcryptjs on register; compare hash on login
- [x] Add `requireAuth` middleware using `Authorization: Bearer <token>`
- [x] Update CORS config to allow Authorization header
- [x] Update frontend axios client to automatically attach token from `localStorage`
- [x] Build frontend to ensure no syntax issues
- [x] Smoke test backend endpoints with curl (register/login/me)

