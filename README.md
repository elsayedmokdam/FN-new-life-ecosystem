# Cards Finance – Web

Next.js 16 (App Router) front-end for the Cards & Financial Transactions Management System. Built with the same conventions as your previous project:
`services/` (one file per endpoint + `*.repo.ts` + `service.repo.ts`), `services/actions` (server actions), `httpClient` returning `HttpResult`,
NextAuth credentials session whose API token lives only in the encrypted httpOnly cookie, `proxy.ts` route guard, Redux Toolkit, react-hook-form + zod,
shadcn/ui, `components/shared/*` reusable components, react-hot-toast / sweetalert helpers.

## Run
```bash
npm install
cp .env.example .env.local    # NEXT_PUBLIC_API_URL, NEXTAUTH_URL, NEXTAUTH_SECRET
npm run dev                   # http://localhost:3001   (start the API first)
npm run build && npm start
npm run typecheck && npm run check:i18n
```

## What is inside
* **Sign-in** with e-mail + password, then the e-mailed OTP (resend with cool-down). 30-minute absolute session; expiry signs the user out.
* **Dashboard** with period filters (today … custom), all financial + operational KPIs, 6 charts from real data, recent transactions, **privacy mode** (eye icon – hides every amount and blurs charts; visual only).
* **Cards** (search, filters, sort, pagination, column visibility, responsive), add/edit card (existing or new client), **card details** (financial overview, ledger check, history), status changes.
* **Transactions**: list, details (financials, receipt, cancellation, audit history), add (from a card or from the menu) with a live *estimate* panel (the API is the authority), edit with mandatory reason, cancellation request → admin approve/reject.
* **Clients** overview/details, **Machines** (including machine-specific withdrawal commission rates), **Employees** (admin), **Reports** (12 kinds, preview, PDF/Excel export through a server proxy, print), **Notifications**, **Activity logs** (admin), **Settings** (admin: system information + required card fields), **Profile** (change password).
* **Arabic (default, RTL) and English** (switch in the top bar); logical Tailwind classes, Cairo font.
* Page guards in `proxy.ts` hide admin pages from employees, but **the API enforces every permission**.

## Notes
* Amounts are integers in piasters end-to-end (`src/lib/money.ts` parses/formats with string math, never floats).
* Actual profit is calculated from intermediary commissions on withdrawals.
* Receipt images and report files are fetched through Next route handlers (`/api/receipts/[id]`, `/api/reports/export`) so the API token never reaches the browser.
