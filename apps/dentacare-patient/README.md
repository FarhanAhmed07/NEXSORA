# TAJ DENTAL

A dental clinic management and patient-care mobile app developed by Nexora Solutions.

## Included workspaces

### Patient portal
- Supabase email/password sign-in and account creation (patient or clinic owner)
- Patient sign-up creates a secure auth account; linking a patient record to a clinic is a separate pending workflow
- Password recovery email request (deep-link password update flow still pending)
- Persisted authentication session
- Patient onboarding preview
- Home dashboard and dental-care routine
- Appointment booking flow
- Care hub: treatment plans, prescriptions, FDI dental chart, bills, documents and notifications
- Dental Care Assistant with general educational FAQs and urgent-care signposting

### Clinic staff workspace
- Clinic-owner sign-up creates a clinic, its main branch and an owner membership
- Doctor, reception and admin dashboard previews
- Staff access is routed by active clinic membership from Supabase
- Live clinic-scoped patient directory, patient registration, patient profile view and active/inactive status updates
- Live clinic appointment schedule with patient/doctor/service lookups and status transitions (requested → confirmed → arrived → in progress → completed, or cancelled)
- Clinic ID and verified membership role passed into the staff workspace
- Live doctor directory for authorized clinic owners/admins (add, search, activate/deactivate)
- Inventory overview remains clearly marked as sample preview data
- Clinical workspace, billing, reports and clinic administration previews

## Technology
- Expo SDK 58
- React Native 0.88
- React 19.3
- TypeScript
- Supabase Auth and Postgres (separate TAJ DENTAL project)

## Configure Supabase

1. Copy `.env.example` to `.env` inside this folder.
2. Set `EXPO_PUBLIC_SUPABASE_URL` to the TAJ DENTAL project URL.
3. Set `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to the project's publishable key. Never use a service-role or secret key in the mobile app.
4. Keep `.env` private; it is excluded by this folder's `.gitignore`.

## Run on Android or iOS

1. Install Node.js LTS and Git.
2. Clone this repository and switch to `feature/dentacare-patient-app`.
3. Open a terminal in `apps/dentacare-patient`.
4. Run:

```bash
npm install
npm run typecheck
npx expo start -c
```

5. Install Expo Go on your phone and scan the QR code shown in the terminal.

## Current release status

**Authentication and initial clinic provisioning are connected in the app code**, including sign-in, sign-up, recovery-email requests, persisted sessions and membership-based staff routing. Clinic owners provision a clinic, main branch and owner membership. Staff patient-directory and appointment modules are connected to live clinic-scoped database operations. The app still requires local environment configuration, TypeScript/build checks and device/end-to-end testing.

The clinic patient directory, appointment management and doctor directory now use live Supabase queries and clinic-scoped writes. The dashboard summary cards are explicitly marked as preview and sample rows are hidden for authenticated clinic accounts. Patient-side appointment booking, clinic discovery/linking, clinical notes, treatment plans, prescriptions, invoices, payments, inventory, document storage, consent records and notifications still need live workflows. No demo patient data should be treated as real clinical information.

The main Nexora website, its main branch and its original Supabase project are not part of this work. TAJ DENTAL changes remain on the separate development branch and new Supabase project. The final standalone GitHub repository, custom app icon, production build and full end-to-end verification remain pending.
