# latchpm v0.1 Release Checklist

`latchpm` v0.1 is the narrow local safer npm workflow wrapper.

It must stay focused on local daily npm workflows. Do not add Cloud, registry/proxy, marketplace, sandboxing, full npm replacement internals, or full project-level install auditing for this release.

## Package Metadata

Verify `packages/latchpm/package.json` includes:

- `name`: `@meredian-labs/latchpm`
- `version`: `0.1.0`
- `description`
- `license`
- `repository`: `git+ssh://git@github.com/meredian-labs/latchpm.git`
- `keywords`
- `bin.latchpm`
- `files`
- dependency on `latch-core@^0.1.1`

## Validation

```bash
npm install
npm run typecheck
npm run build
npm test
npm pack -w @meredian-labs/latchpm --dry-run
```

Confirm the dry run includes:

- `dist/index.js`
- `dist/index.d.ts`
- `package.json`
- `README.md`

Confirm the bin points to:

```json
{
  "bin": {
    "latchpm": "dist/index.js"
  }
}
```

## Smoke Tests

```bash
npm run build
node packages/latchpm/dist/index.js doctor
node packages/latchpm/dist/index.js audit is-number --json --ci
node packages/latchpm/dist/index.js inspect zod --json --ci
node packages/latchpm/dist/index.js install zod --json --ci
node packages/latchpm/dist/index.js install zod --ci --yes --ignore-scripts
node packages/latchpm/dist/index.js install --json --ci
node packages/latchpm/dist/index.js ci --json --ci
node packages/latchpm/dist/index.js run test --yes
node packages/latchpm/dist/index.js npm view react version
```

The final install command may modify the local project. Run it only in a disposable smoke-test directory.

## Required Product Checks

- `latchpm install zod` audits before install.
- User can choose normal install or `--ignore-scripts` install.
- Installed version equals inspected version.
- `latchpm add zod` works as an alias for install.
- `latchpm remove zod` delegates to `npm uninstall zod`.
- `latchpm uninstall zod` works as an alias for remove.
- `latchpm install` audits direct dependencies only, then can run `npm install` after approval.
- `latchpm ci` audits direct dependencies only, then can run `npm ci` after approval.
- `latchpm run <script>` shows the package script before running `npm run`.
- `latchpm npm <args...>` warns that no Latch audit is applied and delegates to npm.
- `latchpm audit` and `latchpm inspect` work.
- `latchpm doctor` works.
- `latchpm cache status`, `path`, and `clear` work.
- JSON/CI mode works.
- Policy denial exits `3`.
- Package not found exits `4`.
- Registry/network error exits `5`.
- Integrity failure exits `6`.
- Analysis failure exits `7`.
