# Latch Positioning

## Category

Local-first package preflight for JavaScript developers, CI systems, and coding agents.

Latch sits before package execution and installation. It is not a vulnerability scanner alone, not a full package manager, and not a sandbox. It is a preflight trust and risk layer for npm package workflows.

## ICPs

### Individual JavaScript Developers

Developers who regularly run package CLIs with `npx`, `npm exec`, or project scripts and want more visibility before code runs.

### AI Coding Agent Users

Developers using coding agents that may suggest or run package commands. These users need deterministic preflight reports and approval gates.

### Small Engineering Teams

Teams that want a local-first workflow before adopting organization-level Cloud policy and audit history.

### CI Maintainers

Engineers who want JSON reports, stable exit codes, and policy decisions before install or execution steps.

## Problem Statements

- JavaScript package execution is often too immediate: fetch and run happen close together.
- Package installation can run lifecycle scripts and mutate project state before a developer has reviewed the package.
- Existing workflows do not always make exact inspected version, publisher metadata, lifecycle scripts, bin entries, file contents, and previous-version changes visible before action.
- AI agents can amplify package execution risk because they move quickly and may run commands on behalf of users.
- Teams need a local workflow that can later become a shared Cloud policy workflow.

## Differentiators

- Preflight order: inspect first, approve second, run or install third.
- Exact-version discipline: package installs and runs use the inspected package version.
- Local-first: useful without Cloud, accounts, organizations, or a registry proxy.
- Execution and install coverage: `latchx` covers run-time package commands; `latchpm` covers install-time package workflows.
- Policy-ready JSON: CI and agents can consume deterministic reports and exit codes.
- Careful risk language: scanner signals and policy decisions, not malware verdicts.

## Comparison Framing

### npm audit

`npm audit` is valuable for known vulnerability information in dependency trees.

Latch focuses on a different moment: before package code runs or installs. It looks at package metadata, lifecycle scripts, bin entries, tarball contents, scanner signals, and local policy decisions. Latch complements vulnerability scanning rather than replacing it.

### Snyk

Snyk provides mature vulnerability intelligence, project scanning, and security workflows.

Latch is focused on lightweight local package preflight for execution and install decisions. It is designed to be useful before Cloud and before a package is allowed to affect a local machine, CI job, or agent session.

### Socket

Socket provides supply-chain analysis and package risk signals.

Latch is positioned as a local-first command workflow: a developer-facing gate that audits before `npx`-style execution and npm-style installation. Latch can coexist with broader supply-chain intelligence tools.

## Messaging Do/Don't

## Do

- Say "audit before run" for `latchx`.
- Say "audit before install" for `latchpm`.
- Say "scanner signals", "risk findings", "review prompts", and "policy decisions".
- Say "local-first" and "works without Cloud".
- Say "exact inspected version".
- Say "direct dependencies only" for current project install and CI workflows.
- Position Latch as complementary to vulnerability scanners and supply-chain platforms.

## Don't

- Do not claim malware detection.
- Do not claim guaranteed safety.
- Do not claim complete npm replacement.
- Do not claim sandboxing.
- Do not claim full transitive dependency auditing.
- Do not attack npm, Snyk, Socket, or other tools.
- Do not imply Cloud exists today.
