# Latch Repository Instructions

This repository is currently scoped to local-first Latch package trust tools.

`latchx` v0.1 is published and should remain feature-frozen except for bug fixes.

The current milestone is `latchpm`, a narrow local safer npm install wrapper.

Do not build Latch Cloud, a registry/proxy, marketplace, sandboxing, a full npm replacement, full project-level install auditing, a dashboard, accounts, billing, or full `npm exec` compatibility in this repository unless explicitly requested.

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
latch-core shared audit/policy/risk engine, published from latch-core
latchx     safer npx replacement CLI, published from latchx
latchpm    safer npm install wrapper CLI, published from latchpm
```

`latch-core`, `latchx`, and `latchpm` should be independently publishable and documentable. `latchx` and `latchpm` may depend on the published `latch-core`, but their GitHub repositories must not absorb the whole `latch-core` project as ordinary tracked source.

Local development may keep `packages/core/` checked out beside `packages/latchx/`, but the root `latchx` git repo ignores `packages/core/`. The core package has its own remote:

```txt
git@github.com:meredian-labs/latch-core.git
```

The GitHub remote for this repo is intended to be:

```txt
git@github.com:meredian-labs/latchx.git
```

The GitHub remote for the `latchpm` product is intended to be:

```txt
git@github.com:meredian-labs/latchpm.git
```

## Product Definition

`latchx` audits npm packages before execution.

`latchpm` audits npm packages before installation.

The core question is:

```txt
Before this package runs or installs code on my machine, what is it, who published it, what changed, what can it access, and how risky is it?
```

The most important rule:

```txt
Package code must never execute before inspection and approval.
```

For `latchpm`, npm install must never run before audit and approval.

## Repository Scope

This repo contains:

```txt
packages/core   shared audit, registry, tarball, cache, scanner, risk, policy, output, and runner logic
packages/latchx safer npx replacement CLI
packages/latchpm safer npm install wrapper CLI
examples/       policies and report docs
docs/           dogfood and release docs
```

`packages/core` is included because `latchx` and `latchpm` depend on it.

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

`latchpm` supports:

```bash
latchpm install <package>
latchpm install
latchpm add <package>
latchpm remove <package>
latchpm uninstall <package>
latchpm audit <package>
latchpm inspect <package>
latchpm ci
latchpm run <script> -- [...args]
latchpm npm <args...>
latchpm doctor
latchpm cache status
latchpm cache path
latchpm cache clear
```

CI/agent usage:

```bash
latchx audit is-number --json --ci --policy ./latch.policy.json
latchpm audit is-number --json --ci --policy ./latch.policy.json
```

## Required Development Checks

Use `latchpm` and `latchx` as the default daily local workflow:

```bash
latchpm install
latchpm ci
latchpm run test --yes
latchpm npm <args...>
latchx <package> -- [...args]
```

Use plain `npm` only for bootstrap, release, publish, and repo maintenance commands where `latchpm` intentionally delegates or does not implement full npm replacement behavior.

Required release checks:

```bash
npm install
npm run typecheck
npm run build
npm test
npm run demo:latchpm
npm pack -w @meredian-labs/latchpm --dry-run
```

If local npm cache permissions break `npm pack`, use a temporary npm cache:

```bash
npm --cache /private/tmp/latch-npm-cache pack -w @meredian-labs/latchpm --dry-run
```

## Release Scope

The current v0.1 release target is `latchpm`.

Before release, verify:

- package name
- version `0.1.0`
- description
- license
- repository
- keywords
- `bin.latchpm`
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

Those may exist in separate future repositories or milestones, but this milestone stays focused on narrow local `latchpm`.
