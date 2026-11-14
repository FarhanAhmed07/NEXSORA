# Nexora Solutions — Platform Upgrade Roadmap

## Product direction
Build Nexora into a professional international software agency platform with a clear client journey, secure operations workspace, and carefully governed AI automation. Preserve the current dark visual identity and existing production workflows.

## Current foundation
- Next.js 15 / React 19 application deployed on Vercel.
- Supabase client integration for enquiries, meeting requests, newsletter subscriptions, and the private admin workspace.
- Public pages for services, showcase, projects, about, pricing, blog, and meeting booking.
- Existing admin modules for enquiries, meetings, subscribers, client projects, testimonials, and portfolio items.
- Existing enquiry form uses the `submit_nexora_enquiry` RPC; meeting booking uses the existing scheduling RPCs.

## Phase 1 — Client acquisition and conversion
- [x] Add a project estimator with service, scope, integrations, and timeline selections.
- [x] Send estimator briefs into the existing enquiry workflow so they appear with regular enquiries in the admin workspace.
- [x] Add estimator links to desktop navigation, mobile navigation, and footer.
- [x] Add the estimator route to the sitemap.
- [ ] Replace illustrative portfolio concepts with verified, permissioned case studies as real work becomes available.
- [ ] Add a lead-focused service landing page for each core service.
- [ ] Add verified social proof and client testimonials only with permission.

## Phase 2 — Agency operations
- [ ] Improve CRM lead pipeline: new, qualified, proposal sent, won, lost, with owner and next-follow-up date.
- [ ] Add proposal records, reusable proposal templates, and PDF export.
- [ ] Expand project management with milestones, tasks, files, progress history, and client-visible updates.
- [ ] Add invoice and payment-status tracking; connect a payment provider only after merchant account setup.
- [ ] Add team roles and least-privilege permissions; keep admin access server-verified and avoid relying on client-side email checks.
- [ ] Add activity history and exportable operational reports.

## Phase 3 — Client portal and AI
- [ ] Add client sign-in and a tenant-safe portal for each client's own projects, milestones, files, invoices, and messages.
- [ ] Add an AI website assistant using a server-side model gateway, with clear disclosure, rate limits, privacy-safe context, and human handoff.
- [ ] Add AI-assisted proposal drafts and lead summaries; require human approval before sending anything externally.
- [ ] Add AI content drafting for blog and marketing channels, with review before publishing.
- [ ] Add email notifications for enquiry receipt, meeting confirmation, and project milestone updates after a transactional email provider is configured.

## Phase 4 — Quality, security, and launch readiness
- [ ] Verify database Row Level Security for every exposed table and RPC.
- [ ] Review authentication, session handling, role authorization, spam protection, and rate limits.
- [ ] Add automated tests for enquiry submission, meeting booking, estimator calculations, and access boundaries.
- [ ] Check mobile layouts, keyboard navigation, contrast, metadata, structured data, sitemap, and Core Web Vitals.
- [ ] Configure a custom domain, production email sender, analytics, backups, and monitoring.
- [ ] Run a production smoke test and document rollback steps.

## Delivery principles
- Keep the current production site available while features are built and verified.
- Do not fabricate client logos, testimonials, performance metrics, or case studies.
- Do not expose Supabase service-role keys or AI provider secrets in browser code.
- Do not enable payment collection, automated email sending, or public AI endpoints until credentials, access rules, costs, and abuse controls are configured.
- Deploy incrementally and verify each production deployment before moving to the next phase.
