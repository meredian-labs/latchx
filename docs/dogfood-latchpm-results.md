# latchpm Dogfood Results

Use this table to record real package checks while developing `latchpm`.

| Package | Command | Expected | Actual | Issue | Status |
| --- | --- | --- | --- | --- | --- |
| `is-number` | `latchpm audit is-number --json --ci` | Emits JSON and exits 0 | Emits JSON and exits 0 | None | Pass |
| `zod` | `latchpm install zod --json --ci` | Emits JSON and does not install without `--yes` | Emits JSON with `installMode: report-only` and exits 0 | Scanner reports review prompts for lifecycle/obfuscation signals | Pass |
| `zod` | `latchpm add zod --json --ci` | Alias emits JSON and does not install without `--yes` | Emits JSON with `installMode: report-only` and exits 0 | Same scanner signals as install | Pass |
| `zod` | `latchpm install zod --ci --yes --ignore-scripts` | Audits exact version, then installs exact version with scripts disabled | Audited `zod@4.4.3`, installed `zod@4.4.3` in `/private/tmp/latchpm-smoke-EHFZbU` | Scanner reports review prompts for lifecycle/obfuscation signals | Pass |
| `zod` | `latchpm install zod --yes` | Audits exact version, then installs exact version | Audited `zod@4.4.3`, installed `zod@4.4.3` in `/private/tmp/latchpm-daily-smoke-b3nJou` | Scanner reports review prompts for lifecycle/obfuscation signals | Pass |
| `zod` | `latchpm remove zod --yes` | Shows command, then delegates to `npm uninstall zod` | Printed no-audit warning and ran `npm uninstall zod` | None | Pass |
| project | `latchpm install --json --ci` | Emits project JSON and does not run `npm install` without `--yes` | Emitted clean JSON with direct-dependency-only scope | No direct dependencies in smoke project after remove | Pass |
| project | `latchpm ci --json --ci` | Emits project JSON and does not run `npm ci` without `--yes` | Emitted clean JSON with direct-dependency-only scope | No direct dependencies in smoke project after remove | Pass |
| project | `latchpm run test --yes` | Shows script command, then delegates to `npm run test` | Printed script command and ran passing test script | None | Pass |
| project | `latchpm npm view react version` | Warns no audit, then delegates to npm | Printed no-audit warning and returned `19.2.7` | None | Pass |
| `slotsslot` | `latchpm audit slotsslot --ci` | Package-not-found exit code 4 | Package-not-found exit code 4 | None | Pass |
| `is-number` | `latchpm audit is-number --json --ci --registry http://127.0.0.1:9` | Registry/network error exits 5 | Registry/network error exits 5 | None | Pass |
