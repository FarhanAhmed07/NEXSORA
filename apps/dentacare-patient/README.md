# TAJ DENTAL

A dental clinic management and patient-care mobile app preview developed by Nexora Solutions for Taj Dental.

## Included workspaces

### Patient portal
- Sign-in and account creation screens (preview only)
- Patient onboarding and profile details
- Home dashboard and dental-care routine
- Appointment booking flow
- Care hub: treatment plans, prescriptions, FDI dental chart, bills, documents and notifications
- Dental Care Assistant with general educational FAQs and urgent-care signposting

### Clinic staff workspace
- Doctor dashboard and clinical schedule
- Reception dashboard and front-desk queue
- Admin dashboard and clinic overview
- Patient search and patient profile preview
- Appointment management with local status changes
- Doctor directory and inventory overview
- Clinical workspace: treatment plan, dental chart and prescription previews
- Billing and payment history preview
- Reports and analytics
- Clinic administration: branches, staff roles, services and settings
- Communications templates, consent forms, audit log and subscription preview

## Technology
- Expo SDK 58
- React Native 0.88
- React 19.3
- TypeScript

## Run on Android or iOS
1. Install Node.js LTS and Git on your computer.
2. Clone this repository and switch to `feature/dentacare-patient-app`.
3. Open a terminal in `apps/dentacare-patient`.
4. Run:

```bash
npm install
npx expo start
```

5. Install Expo Go on your phone and scan the QR code shown in the terminal.

## Current release status

This is a frontend prototype. All patient, appointment, revenue, staff and inventory entries are sample data. Local preview interactions do not write to a database.

Not connected yet:
- Supabase authentication, database, row-level security and private file storage
- Verified staff roles and clinic/branch data isolation
- Live appointment availability and server-side conflict prevention
- SMS, WhatsApp, email and push notification providers
- Payment gateway and real receipts
- AI service integration (the current Dental Care Assistant is a static educational preview)
- Production audit events, consent e-signatures and subscription billing

No live database schema has been changed as part of this frontend work. The main Nexora website and main branch are not modified. The final custom tooth logo/app icon and production build are still pending.
