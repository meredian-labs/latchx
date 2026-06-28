# Contributing

Thanks for contributing to Latch.

## Current Scope

This repository is scoped to `latchx`.

Do not add backend, sandboxing, full npm exec compatibility, Cloud, or `latchpm` behavior in this repository unless a maintainer explicitly changes the repo scope.

## Development

```bash
npm install
npm run typecheck
npm run build
npm test
npm run demo:latchx
```

Use npm for this repository. Do not migrate to pnpm, yarn, or bun without explicit approval.

## Project Layout

- `packages/core`: shared registry, tarball, scanner, risk, cache, policy, and report logic
- `packages/latchx`: safer `npx` replacement CLI
- `examples`: policy and report examples
- `docs`: dogfood and release docs

## Pull Requests

Before opening a pull request:

1. Keep the change scoped.
2. Add tests for behavior changes.
3. Run `npm run typecheck`.
4. Run `npm run build`.
5. Run `npm test`.
6. Run `npm run demo:latchx` when CLI behavior changes.

## Security Language

Do not describe scanner findings as malware verdicts. Use careful language: signals, risk, review prompts, and policy decisions.
