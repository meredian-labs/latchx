# latchx v0.1 Release Checklist

## Package Metadata

Verify `packages/latchx/package.json` includes:

- `name`
- `version`
- `description`
- `license`
- `repository`
- `keywords`
- `bin.latchx`
- `files`

## Validation

```bash
npm install
npm run typecheck
npm run build
npm test
npm run demo:latchx
npm pack -w latch-core --dry-run
npm pack -w @meredian-labs/latchx --dry-run
```

Confirm the `@meredian-labs/latchx` dry run includes:

- `dist/index.js`
- `dist/index.d.ts`
- `package.json`
- `README.md`
- docs included by the `files` whitelist

Confirm the bin points to:

```json
{
  "bin": {
    "latchx": "dist/index.js"
  }
}
```

## Global Install Smoke Test

`latch-core` must be published before `latchx`, because `latchx` depends on it.

```bash
npm run build
npm pack -w latch-core
npm pack -w @meredian-labs/latchx
npm install -g ./packages/core/latch-core-0.1.0.tgz
npm install -g ./packages/latchx/meredian-labs-latchx-0.1.0.tgz
latchx doctor
latchx audit is-number
latchx audit is-number --json --ci
latchx cowsay --yes -- hello
npm uninstall -g @meredian-labs/latchx
```

The `cowsay` command intentionally executes only after `latchx` audits the exact package version and `--yes` approves execution.
