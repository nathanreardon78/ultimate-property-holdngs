# Ultimate Property Holdings — Next.js (App Router)

- App Router with reusable components and Tailwind styles matching your approved design
- No renting on site; users **view** units and **contact** via forms
- Email sending powered by **Resend** API (server routes only)

## Quick start

```bash
pnpm i   # or npm i / yarn
cp .env.example .env.local
# edit .env.local with your keys
pnpm dev
```

## Environment

```
RESEND_API_KEY=your_resend_api_key
CONTACT_TO=nathan@membershipauto.com
MAINTENANCE_TO=nathan@membershipauto.com
```

## Availability

Edit `lib/data.ts` — set `unit.available = true | false` and adjust rents/bedrooms as needed.
