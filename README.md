# milodo-medical

Next.js (App Router) + TypeScript + Tailwind CSS + ESLint.

## Dev

```bash
npm install
npm run dev
```

## Production

```bash
npm install
npm run build
npm run start
```

### Env checklist

- `NEXT_PUBLIC_SITE_URL` (Prod-URL, z.B. `https://…`)
- `NEXT_PUBLIC_CONTACT_EMAIL`
- Legal/DSGVO (für `/impressum` und `/datenschutz`):
  - `NEXT_PUBLIC_COMPANY_NAME`
  - `NEXT_PUBLIC_COMPANY_LEGAL_FORM`
  - `NEXT_PUBLIC_COMPANY_ADDRESS`
  - `NEXT_PUBLIC_COMPANY_PHONE`
  - `NEXT_PUBLIC_COMPANY_REPRESENTATIVE`
  - optional: `NEXT_PUBLIC_COMPANY_REGISTER`, `NEXT_PUBLIC_COMPANY_VAT_ID`, `NEXT_PUBLIC_COMPANY_SUPERVISORY_AUTHORITY`, `NEXT_PUBLIC_DPO_CONTACT`
  - `NEXT_PUBLIC_PRIVACY_LAST_UPDATED`

### Blog (optional)

- Local export: `BLOG_EXPORT_DIR` (sonst `./data/blog`)
- SFTP (statt local):
  - `BLOG_SFTP_HOST`, `BLOG_SFTP_PORT`, `BLOG_SFTP_USER`, `BLOG_SFTP_PASSWORD`, `BLOG_SFTP_BASE_PATH`
- Diagnostics (optional): `BLOG_DIAG_TOKEN` aktiviert `/api/blog/diag` (nur für interne Checks).

### DSGVO quick notes

- Das Anfrageformular nutzt `mailto:` (kein serverseitiges Speichern über diese Website). Nutzer müssen vor dem Versand der Datenschutzerklärung zustimmen.
- Ergänze die Platzhalter in `/impressum` und `/datenschutz` vor dem Launch und stelle sicher, dass Hosting/Provider inkl. AV-Vertrag (Art. 28 DSGVO) dokumentiert sind.
