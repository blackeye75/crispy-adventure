# Fretkey

Music theory on the instrument: guitar and piano. See `CLAUDE.md` and `docs/BLUEPRINT.md`.

## Run it

```bash
cp .env.example .env.local
```

Fill in `MONGODB_URI` and `BETTER_AUTH_SECRET` (accounts and progress need both), then:

```bash
npm install
```

```bash
npm run seed
```

```bash
npm run dev
```

Without `MONGODB_URI` the landing page, the path map and the practice room still work; signing in does not.

## Tests

```bash
npm run test
```

The database-backed service tests and the Playwright suite need a local MongoDB:

```bash
docker run -d -p 27017:27017 mongo:7
```

```bash
MONGODB_TEST_URI=mongodb://127.0.0.1:27017/fretkey_test npm run test
```

```bash
npm run test:e2e
```

The Playwright suite never contacts Razorpay: it runs `e2e/fake-razorpay.mjs` in its place and signs its own webhooks.

## Payments

Set the `RAZORPAY_*` values in `.env.local` (see `.env.example`). In the Razorpay dashboard, create a monthly and a yearly plan, and a webhook pointing at `/api/v1/billing/webhook` with every `subscription.*` event enabled. Access is granted only when that webhook arrives.
