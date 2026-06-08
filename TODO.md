# TODO - Frontend restructuring (PMS)

- [ ] Move panel components from `frontend/src/components/*Panel.jsx` into `frontend/src/pages/`
- [ ] Update `frontend/src/App.jsx` imports to point to `frontend/src/pages/*Panel.jsx`
- [ ] Extract inline form components into `frontend/src/forms/` (VehicleForm, CustomerForm, UserForm, PromoForm)
- [ ] Update page components to import the extracted form components
- [ ] Run frontend lint/build to ensure app still works
- [ ] Run backend and frontend dev servers (or confirm compile) to ensure no runtime import issues

