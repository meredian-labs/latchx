# Latch

Latch is a local-first safety layer for JavaScript package execution and installation.

The first product is `latchx`: a safer `npx`-style CLI that audits an npm package before any package code runs. It answers practical questions before execution:

- What package and version will run?
- Who published it?
- Does it expose binaries?
- Does it declare lifecycle scripts?
- What files and dependencies are in the tarball?
- Does the package contain code patterns that deserve review?
- What changed from the previous published version?
- Does local policy allow it?

Latch is not a malware detector and does not claim certainty. It is a preflight trust and risk tool.

## Why Safer `npx` Matters

`npx` and `npm exec` are convenient, but they can fetch and execute package-controlled code in one step. That is risky for humans, CI jobs, and AI coding agents because the decision to run often happens before the package is inspected.

`latchx` changes the order:

1. Resolve package metadata from npm.
2. Download the tarball without executing it.
3. Verify integrity when npm provides it.
4. Extract and inspect package contents.
5. Generate a human and JSON report.
6. Evaluate policy in CI/agent mode.
7. Run only after approval.

## Quick Start

```bash
npm install
npm run build

node packages/latchx/dist/index.js audit is-number
node packages/latchx/dist/index.js inspect create-vite
node packages/latchx/dist/index.js run cowsay -- hello
```

During local development:

```bash
npm run dev:latchx -- audit is-number
```

Run the safe demo:

```bash
npm run demo:latchx
```

## Repository Structure

```txt
latch/
  packages/
    core/      shared audit, scanner, risk, cache, policy, and report logic
    latchx/    safer npx replacement CLI
  examples/
    policies/ ready-to-use policy examples
    reports/  report generation notes
  docs/
    release/ release and global install smoke-test docs
```

The repository is intentionally scoped to `latchx`. Contributions should keep shared logic in `packages/core` and avoid duplicating registry, tarball, scanner, risk, cache, or policy behavior inside the CLI package.

## Human Usage

Audit without running:

```bash
latchx audit create-vite
latchx inspect @angular/cli
```

Run after approval:

```bash
latchx run cowsay -- hello
latchx cowsay -- hello
```

Check local readiness:

```bash
latchx doctor
```

Manage cache:

```bash
latchx cache status
latchx cache path
latchx cache clear
```

## CI And Agent Usage

CI mode is deterministic and never prompts.

```bash
latchx audit create-vite --json --ci --policy ./latch.policy.json
```

Exit codes:

- `0`: allowed
- `1`: general error
- `2`: denied by user
- `3`: denied by policy
- `4`: package not found
- `5`: registry/network error
- `6`: integrity verification failed
- `7`: analysis failed

## Policy Examples

Default policy file name:

```txt
latch.policy.json
```

Strict policy:

```json
{
  "minScore": 85,
  "denyCritical": true,
  "denyHigh": true,
  "denyLifecycleScripts": true,
  "denyNewLifecycleScripts": true,
  "denyLikelyObfuscation": true,
  "denyIntegrityMissing": true,
  "allowedRegistries": ["https://registry.npmjs.org"]
}
```

Relaxed policy with trusted scope:

```json
{
  "minScore": 60,
  "denyCritical": true,
  "trustedScopes": ["@your-org"],
  "allowedRegistries": ["https://registry.npmjs.org"]
}
```

See `examples/policies/` for ready-to-use examples.

## Risk Score

Latch scores package execution risk from `0` to `100`.

- `80-100`: low
- `60-79`: medium
- `40-59`: high
- `0-39`: critical

The score is not a malware verdict. It is a local risk signal based on install scripts, executable bins, dependency count, code patterns, obfuscation heuristics, identity metadata, and previous-version deltas.

## Local Cache

Latch stores cache data under:

```txt
~/.latch/cache
```

Reports and tarballs are keyed by package name, version, registry URL, and integrity/shasum. If integrity changes, cache paths change and the old report is not reused.

Use `--no-cache` to force a fresh audit.

## Limitations

- No backend or shared reputation service yet.
- No sandboxing yet.
- No full package-manager implementation yet.
- `latchx` does not yet implement every `npm exec` compatibility mode such as `--package/-p` or multi-package execution.
- Static scanning can miss behavior and can produce false positives.
- Minified or bundled code can be difficult to classify precisely.

## Roadmap

Near term:

- Improve policy ergonomics.
- Improve report explanations and JSON stability.
- Add deeper dependency and diff analysis.

Later:

- Controlled execution directories.
- Optional sandboxing.
- Team policy workflows.
- Registry proxy or registry replacement.
- Shared signed audit results.

## Contributing And Release

Read `CONTRIBUTING.md` before making changes.

Release hardening checks:

```bash
npm run typecheck
npm run build
npm test
npm run demo:latchx
npm pack -w latch-core --dry-run
npm pack -w latchx --dry-run
```

Global install smoke-test steps are documented in `docs/release/latchx-v0.1.md`.
