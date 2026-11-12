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
