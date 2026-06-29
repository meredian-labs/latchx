# Landing Copy

## Hero

Trust packages before they run or install.

## Subhero

Latch is a local-first package preflight layer for JavaScript developers. `latchx` audits before `npx`-style execution. `latchpm` audits before npm-style installation.

## Problem

JavaScript package workflows are fast, but they often collapse inspection and action into one step.

Developers run package commands. CI installs dependencies. AI coding agents suggest tools. Packages can expose binaries, declare lifecycle scripts, read files, access environment variables, spawn processes, and change behavior between versions.

The missing step is a clear preflight review before package-controlled code affects a machine or project.

## Solution

Latch adds a local approval gate before package execution and installation.

It resolves package metadata, inspects the exact version, downloads and verifies the tarball when metadata allows, scans package files, checks lifecycle scripts and bin entries, compares previous versions where possible, evaluates local policy, and produces human-readable and JSON reports.

Latch does not claim certainty. It provides scanner signals, risk findings, review prompts, and policy decisions.

## How It Works

1. Resolve the package and exact version.
2. Download the tarball before running or installing package code.
3. Verify integrity when npm metadata provides it.
4. Inspect package metadata, scripts, binaries, dependencies, files, and previous-version changes.
5. Generate a risk report.
6. Evaluate local policy.
7. Run or install only after approval.

## latchx

Audit before package execution.

```bash
latchx audit create-vite
latchx inspect @angular/cli
latchx cowsay -- hello
```

`latchx` is the safer `npx`-style workflow for package commands. It asks what a package is, who published it, what changed, what it can access, and whether local policy allows it before execution.

## latchpm

Audit before package installation.

```bash
latchpm audit zod
latchpm install zod
latchpm install
latchpm ci
```

`latchpm` is the safer npm-style local workflow for installs. It audits individual packages before install and can audit direct project dependencies before `npm install` or `npm ci`.

Current project install and CI workflows audit direct dependencies only. Transitive dependency auditing is not implemented yet.

## CI And Agents

Latch supports deterministic JSON output and CI-friendly exit codes.

```bash
latchx audit create-vite --json --ci --policy ./latch.policy.json
latchpm install zod --json --ci --policy ./latch.policy.json
latchpm install --json --ci
```

This gives CI jobs and coding agents a structured preflight report before package execution or installation.

## Roadmap

Current focus:

- local-first `latchx`,
- local-first `latchpm`,
- shared `latch-core`,
- clearer reports,
- better policy ergonomics,
- deeper dependency and diff analysis.

Future Cloud direction:

- shared organization policy,
- audit history,
- team decisions,
- repository views,
- signed reports,
- agent and CI governance.

Cloud should be built from real local usage of both product surfaces.

## CTA

Start local.

```bash
npm install -g @meredian-labs/latchx @meredian-labs/latchpm
latchx audit create-vite
latchpm audit zod
```

Use Latch where package code would otherwise run or install before review.
