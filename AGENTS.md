# latchx Repository Instructions

This repository is scoped to `latchx`, the safer `npx` replacement.

Do not build Latch Cloud, full `latchpm`, sandboxing, a registry, a dashboard, accounts, billing, or full `npm exec` compatibility in this repository unless explicitly requested.

## Independence Rule For Primary Packages

Every primary Latch package/product must be able to stand on its own.

That means each primary package should have its own:

- GitHub repository or clearly isolated repo boundary,
- README,
- changelog,
- security policy,
- contributing notes when public,
- license,
- release checklist,
- demo or smoke-test script,
- dogfood notes,
- examples where relevant,
- tests,
- publish metadata,
- CI plan or workflow.

Do not treat primary packages as hidden internals once they become release targets.

Current primary packages:

```txt
@latch/core   shared audit/policy/risk engine, published from latch-core
@latch/latchx safer npx replacement CLI, published from latchx
```

`@latch/core` and `@latch/latchx` should be independently publishable and documentable. `latchx` may depend on the published `@latch/core`, but the `latchx` GitHub repository must not absorb the whole `latch-core` project as ordinary tracked source.

Local development may keep `packages/core/` checked out beside `packages/latchx/`, but the root `latchx` git repo ignores `packages/core/`. The core package has its own remote:

```txt
git@github.com:meredian-labs/latch-core.git
```

The GitHub remote for this repo is intended to be:

```txt
git@github.com:meredian-labs/latchx.git
```

## Product Definition

`latchx` audits npm packages before execution.

The core question is:

```txt
Before this package runs code on my machine, what is it, who published it, what changed, what can it access, and how risky is it?
```

The most important rule:

```txt
Package code must never execute before inspection and approval.
```

## Repository Scope

This repo contains:

```txt
packages/core   shared audit, registry, tarball, cache, scanner, risk, policy, output, and runner logic
packages/latchx safer npx replacement CLI
examples/       policies and report docs
docs/           dogfood and release docs
```

`packages/core` is included because `latchx` depends on it. It is not a separate product surface here.

## Current Commands

`latchx` supports:

```bash
latchx audit <package>
latchx inspect <package>
latchx run <package> -- [...args]
latchx <package> -- [...args]
latchx doctor
latchx cache status
latchx cache path
latchx cache clear
```

CI/agent usage:

```bash
latchx audit is-number --json --ci --policy ./latch.policy.json
```

## Required Development Checks

Use npm only.

```bash
npm install
npm run typecheck
npm run build
npm test
npm run demo:latchx
npm pack -w @latch/latchx --dry-run
```

If local npm cache permissions break `npm pack`, use a temporary npm cache:

```bash
npm --cache /private/tmp/latch-npm-cache pack -w @latch/latchx --dry-run
```

## Release Scope

The v0.1 release target is `@latch/latchx`.

Before release, verify:

- package name
- version `0.1.0`
- description
- license
- repository
- keywords
- `bin.latchx`
- package `files` whitelist
- dry-run package contents include built `dist/index.js`

## Security Language

Do not claim that a package is malware.

Use careful language:

- scanner signal
- risk finding
- review prompt
- policy denial
- execution risk

The scanner is a preflight risk tool, not a malware oracle.

## Explicit Non-Goals For This Repo

Do not build:

- Latch Cloud
- `apps/cloud`
- auth or organizations
- registry/proxy
- marketplace
- full `latchpm`
- project-level install auditing
- sandboxed execution
- full `npm exec --package/-p` compatibility

Those may exist in separate future repositories or milestones, but this repository stays focused on `latchx`.
