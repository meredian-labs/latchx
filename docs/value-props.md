# Latch Value Props

## Core Value Prop

Latch is a local-first package preflight layer for JavaScript developers.

It helps developers, CI jobs, and coding agents inspect npm packages before package-controlled code runs or enters a project. Latch turns package execution and installation into an explicit review step with scanner signals, risk findings, review prompts, and policy decisions.

## One-Line Pitch

Trust packages before they run or install.

## Product-Specific Value Props

### latchx

`latchx` audits before `npx`-style execution.

It resolves the exact package version, downloads and verifies the tarball, inspects package metadata and files, evaluates local policy, and only runs the exact inspected version after approval.

Use `latchx` when the question is:

```text
Should this package command run on my machine?
```

### latchpm

`latchpm` audits before npm-style installation.

It audits a package before install, supports exact-version install after approval, and provides daily local workflow commands for project install, CI install, remove, script run, and explicit npm passthrough. Project `install` and `ci` currently audit direct dependencies only.

Use `latchpm` when the question is:

```text
Should this package enter my project?
```

### latch-core

`latch-core` is the shared audit, policy, scanner, risk, cache, registry, tarball, diff, and report engine used by Latch tools.

It keeps package inspection behavior consistent across `latchx`, `latchpm`, and future Latch surfaces.

## Target Users

- JavaScript developers who frequently run one-off package commands.
- Maintainers who want a local review step before adding dependencies.
- AI coding agent users who need preflight checks before tools execute package code.
- CI owners who want deterministic JSON reports and policy exits.
- Security-minded engineering teams that want package trust decisions before Cloud workflows exist.

## Use Cases

- Audit a package before running a CLI command.
- Audit a package before installing it into a project.
- Review lifecycle scripts, bin entries, dependency counts, metadata, file contents, and previous-version changes.
- Produce JSON reports for CI and agent workflows.
- Enforce local policy decisions before execution or install.
- Use explicit npm passthrough for unsupported commands while making the lack of audit visible.

## Current Scope

Latch is local-first today.

Current product surfaces:

- `latchx`: safer `npx`-style execution wrapper.
- `latchpm`: safer npm-style local workflow wrapper.
- `latch-core`: shared package audit and policy engine.

Current `latchpm install` and `latchpm ci` project workflows audit direct dependencies only. Transitive dependency auditing is not implemented yet.

## Future Cloud Direction

Latch Cloud should come after first-hand local usage of both product surfaces:

- `latchx`: audit before run.
- `latchpm`: audit before install.

Future Cloud direction can include shared policy, organization workflows, audit history, team decisions, repository views, signed reports, and richer governance across developer machines, CI, and agents.

Cloud should build on the local product behavior rather than replace it.

## What Latch Does Not Claim

Latch does not claim:

- malware detection,
- guaranteed safety,
- full npm replacement behavior,
- sandboxed execution,
- complete transitive dependency auditing,
- vulnerability database coverage,
- or certainty about package intent.

Latch provides scanner signals, risk findings, review prompts, and policy decisions before package-controlled code runs or installs.
