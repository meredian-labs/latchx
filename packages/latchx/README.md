# latchx

`latchx` is a safer `npx` replacement that audits npm packages before execution. It is the first product in the Latch family: local-first tooling for package execution trust.

`npx` and `npm exec` are convenient, but they can fetch and run package-controlled code in one step. `latchx` changes the order: resolve metadata, download the tarball, verify integrity when available, inspect package contents, evaluate policy, and only run after approval.

## Quick Start

```bash
npm install -g @meredian-labs/latchx

latchx doctor
latchx audit is-number
latchx inspect is-number --json --ci
latchx cowsay --yes -- hello
```

## Common Usage

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

Use deterministic CI or agent mode:

```bash
latchx audit create-vite --json --ci --policy ./latch.policy.json
```

## What It Checks

- package identity and publisher metadata
- tarball integrity from npm metadata
- extracted `package/package.json`
- bin entries and lifecycle scripts
- dependency counts
- suspicious static patterns such as process, filesystem, network, shell, and obfuscation signals
- previous-version differences when npm publish-time metadata is available
- local policy from `latch.policy.json` or `--policy <path>`

## Important Limits

`latchx` is not a malware detector and does not claim certainty. Findings are risk signals for review. The first release does not provide full sandboxing, a backend reputation service, or complete `npm exec` compatibility.

See the repository README for full documentation.
