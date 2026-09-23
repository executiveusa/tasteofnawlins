# Taste of Nawlins — Hostinger Production Handoff

## Goal
Move production from Netlify to Hostinger while keeping GitHub as the canonical source of truth.

## Canonical source
- Repository: executiveusa/tasteofnawlins
- Production branch: main
- Release commit prepared for migration: 6c610d3373066fb7e60300d385a5e72910de06ab
- Domain owned in Hostinger: tasteofnawlins.food

## Non-negotiables
1. Do not rebuild the website in Hostinger AI Builder.
2. Do not change the visual design during infrastructure migration.
3. Do not introduce Netlify Forms or any other Netlify-only runtime dependency.
4. Keep Future Champs Gym and Asc3nd resources completely separate.
5. GitHub main remains the source of truth.
6. Preserve an easy rollback until the Hostinger deployment and forms are verified.

## Browser-agent mission
1. Open Hostinger hPanel and identify the regular web-hosting plan that can host tasteofnawlins.food.
2. Connect/import executiveusa/tasteofnawlins from GitHub using Hostinger's supported Git deployment workflow. Use main as production.
3. Configure the Vite/React production build from the repository. Do not copy/paste or recreate the site in AI Builder.
4. Attach tasteofnawlins.food to this deployment and configure SSL/HTTPS.
5. Preserve Hostinger email DNS records (MX/SPF/DKIM/DMARC where already configured) while changing web-hosting DNS. Do not break mail.
6. Build a Hostinger-owned backend for the two existing website forms:
   - Follow the Kitchen: capture email/customer signup.
   - Catering: capture catering lead details and trigger a restaurant notification.
   Do not use Netlify Forms.
7. Use a dedicated Taste of Nawlins mailbox/destination. Do not route leads to social@asc3nd.org or any Future Champs address. If no Taste mailbox exists, stop at that decision point and ask the owner what mailbox name to create (recommended: hello@tasteofnawlins.food or catering@tasteofnawlins.food).
8. Wire the existing React forms to the Hostinger backend without changing their approved UI.
9. Test both forms end-to-end with harmless test submissions and verify storage plus email notification.
10. Verify production on phone and desktop: no horizontal overflow, hero loads, five menu items appear, cabbage copy is current, links work, forms work, HTTPS is valid.
11. Only after Hostinger production passes, make tasteofnawlins.food the canonical production destination.
12. Keep the Netlify project temporarily as rollback/staging. Do not delete it during migration.

## Current known state
- GitHub PR #5 was merged successfully into main as commit 6c610d3373066fb7e60300d385a5e72910de06ab.
- PR checks observed before merge: CodeRabbit success and Netlify deploy-preview success.
- Netlify project: tasteofnawlins, site id fdbddd6a-4860-48cc-9b40-254caa2e5bd8.
- Netlify Forms are not enabled and must remain unnecessary.
- Hostinger Mail connector currently exposes only social@asc3nd.org; that mailbox must not be used for Taste of Nawlins.
- Hostinger AI Builder connection is working, but Taste of Nawlins must not be recreated there.

## Acceptance proof required before calling migration complete
Return:
- Hostinger production URL
- tasteofnawlins.food HTTPS proof
- deployed Git commit SHA
- successful Follow the Kitchen test receipt
- successful Catering test receipt
- notification destination used
- mobile + desktop verification
- rollback path
- confirmation that GitHub main remains canonical
- confirmation that Netlify is no longer a production runtime dependency
