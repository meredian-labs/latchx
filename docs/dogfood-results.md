# Dogfood Results

Use this table to record real package checks while developing `latchx`.

| Package | Command | Expected | Actual | Issue | Status |
| --- | --- | --- | --- | --- | --- |
| `is-number` | `latchx audit is-number --json --ci` | Emits JSON and exits 0 | Emits JSON and exits 0 | None | Pass |
| `cowsay` | `latchx run cowsay -- hello` | Shows report, asks before running | Shows report and waits for approval | CLI packages score conservatively because bins/process signals are expected | Known |
| `create-vite` | `latchx audit create-vite --ci` | Audits without creating a project | Audits without executing package code | High-risk recommendation due to CLI process/env signals | Known |
| `@angular/cli` | `latchx run @angular/cli -- --help` | Executes only exact inspected version after approval | Exact version is used; may fail if local Node is unsupported | Node engine mismatch is surfaced by npm/CLI | Pass |
| `slotsslot` | `latchx audit slotsslot` | Package-not-found exit code 4 | Package-not-found exit code 4 | None | Pass |
