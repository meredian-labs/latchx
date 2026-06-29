#!/usr/bin/env node
import { Command } from "commander";
import prompts from "prompts";
import { auditPackage, evaluatePolicy, formatHumanReport, loadPolicy, runNpmExec } from "latch-core";
import type { LatchAuditReport, PolicyDecision } from "latch-core";
import { clearCache, formatCacheStatus, getCacheStatus, getDefaultCachePath } from "./cacheCommands.js";
import { formatDoctorReport, runDoctor } from "./doctor.js";
import { planAfterAudit } from "./flow.js";

const exitCodes = {
  generalError: 1,
  deniedByUser: 2,
  deniedByPolicy: 3,
  packageNotFound: 4,
  registryError: 5,
  integrityFailed: 6,
  analysisFailed: 7
} as const;

type GlobalOptions = {
  json?: boolean;
  yes?: boolean;
  ci?: boolean;
  registry?: string;
  noCache?: boolean;
  cache?: boolean;
  policy?: string;
};

type CommandMode = "audit" | "run";

const program = new Command();

program
  .name("latchx")
  .description("Inspect npm packages before executing them.")
  .option("--json", "output structured JSON")
  .option("-y, --yes", "approve execution without prompting")
  .option("--ci", "evaluate policy without prompts or execution")
  .option("--policy <path>", "policy file path")
  .option("--registry <url>", "npm registry URL")
  .option("--no-cache", "force re-analysis")
  .allowUnknownOption(true)
  .argument("[packageSpec]", "package spec to run")
  .argument("[packageArgs...]", "arguments to pass to the package after approval")
  .action(async (packageSpec: string | undefined, packageArgs: string[] = []) => {
    if (!packageSpec) {
      program.help({ error: true });
      return;
    }

    await handlePackage("run", packageSpec, packageArgs, program.opts<GlobalOptions>());
  });

addAuditCommand("audit", "Audit a package without executing it.");
addAuditCommand("inspect", "Inspect a package without executing it.");
addDoctorCommand();
addCacheCommands();

program
  .command("run")
  .description("Audit a package and run it only after approval.")
  .argument("<packageSpec>", "package spec to run")
  .argument("[packageArgs...]", "arguments to pass to the package after approval")
  .option("--json", "output structured JSON")
  .option("-y, --yes", "approve execution without prompting")
  .option("--ci", "evaluate policy without prompts or execution")
  .option("--policy <path>", "policy file path")
  .option("--registry <url>", "npm registry URL")
  .option("--no-cache", "force re-analysis")
  .allowUnknownOption(true)
  .action(async (packageSpec: string, packageArgs: string[] = [], ...rest: Array<Command | GlobalOptions>) => {
    await handlePackage("run", packageSpec, packageArgs, mergeOptions(actionOptions(...rest)));
  });

program.parseAsync(process.argv).catch((error: unknown) => {
  handleError(error);
});

function addAuditCommand(name: "audit" | "inspect", description: string): void {
  program
    .command(name)
    .description(description)
    .argument("<packageSpec>", "package spec to audit")
    .option("--json", "output structured JSON")
    .option("--ci", "evaluate policy without prompts")
    .option("--policy <path>", "policy file path")
    .option("--registry <url>", "npm registry URL")
    .option("--no-cache", "force re-analysis")
    .action(async (packageSpec: string, ...rest: Array<Command | GlobalOptions>) => {
      await handlePackage("audit", packageSpec, [], mergeOptions(actionOptions(...rest)));
    });
}

function addDoctorCommand(): void {
  program
    .command("doctor")
    .description("Check local latchx readiness.")
    .option("--registry <url>", "npm registry URL")
    .option("--json", "output structured JSON")
    .action(async (...rest: Array<Command | GlobalOptions>) => {
      const options = mergeOptions(actionOptions(...rest));
      const report = await runDoctor({ registryUrl: options.registry });
      if (options.json) {
        process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
      } else {
        process.stdout.write(`${formatDoctorReport(report)}\n`);
      }
      process.exit(report.ready ? 0 : exitCodes.generalError);
    });
}

function addCacheCommands(): void {
  const cache = program.command("cache").description("Inspect or clear the local latchx cache.");

  cache
    .command("status")
    .description("Show local cache status.")
    .option("--json", "output structured JSON")
    .action(async (...rest: Array<Command | GlobalOptions>) => {
      const options = mergeOptions(actionOptions(...rest));
      const status = await getCacheStatus();
      process.stdout.write(options.json ? `${JSON.stringify(status, null, 2)}\n` : `${formatCacheStatus(status)}\n`);
    });

  cache
    .command("path")
    .description("Print local cache path.")
    .action(() => {
      process.stdout.write(`${getDefaultCachePath()}\n`);
    });

  cache
    .command("clear")
    .description("Clear local latchx cache.")
    .option("--json", "output structured JSON")
    .action(async (...rest: Array<Command | GlobalOptions>) => {
      const options = mergeOptions(actionOptions(...rest));
      const status = await clearCache();
      process.stdout.write(options.json ? `${JSON.stringify(status, null, 2)}\n` : `${formatCacheStatus(status)}\n`);
    });
}

async function handlePackage(mode: CommandMode, packageSpec: string, packageArgs: string[], options: GlobalOptions): Promise<void> {
  const report = await auditPackage(packageSpec, {
    tool: "latchx",
    action: mode,
    registryUrl: options.registry,
    noCache: shouldBypassCache(options)
  });
  const policy = await loadPolicy(options.policy);
  const policyDecision = evaluatePolicy(report, policy.policy);

  emitReport(report, options);

  if (!policyDecision.allowed) {
    process.stderr.write(`latchx policy: ${policyDecision.reason}\n`);
  }

  const plan = planAfterAudit(mode, options, policyDecision);
  if (plan.action === "exit") {
    process.exit(plan.code);
  }

  if (plan.action === "audit-only") {
    return;
  }

  if (plan.action === "policy-denied") {
    process.exit(plan.code);
  }

  if (plan.action === "prompt") {
    const approved = await askForDecision(report, policyDecision);
    if (!approved) {
      process.exit(exitCodes.deniedByUser);
    }
  }

  const code = await runNpmExec(`${report.package.name}@${report.package.resolvedVersion}`, packageArgs);
  process.exit(code);
}

function emitReport(report: LatchAuditReport, options: GlobalOptions): void {
  if (options.json) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    return;
  }

  process.stdout.write(`${formatHumanReport(report)}\n`);
}

async function askForDecision(report: LatchAuditReport, policyDecision: PolicyDecision): Promise<boolean> {
  for (;;) {
    process.stdout.write(formatDecisionSummary(report, policyDecision));
    const response = await prompts({
      type: "select",
      name: "decision",
      message: "Decision",
      choices: [
        { title: "Run", value: "run" },
        { title: "Deny", value: "deny" },
        { title: "View full findings", value: "findings" },
        { title: "View diff", value: "diff" },
        { title: "Print JSON", value: "json" }
      ],
      initial: 1
    });

    if (response.decision === "run") {
      return true;
    }

    if (!response.decision || response.decision === "deny") {
      return false;
    }

    if (response.decision === "findings") {
      process.stdout.write(formatFindings(report));
    }

    if (response.decision === "diff") {
      process.stdout.write(formatDiff(report));
    }

    if (response.decision === "json") {
      process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    }
  }
}

function formatDecisionSummary(report: LatchAuditReport, policyDecision: PolicyDecision): string {
  const topFindings = report.risk.findings
    .filter((finding) => finding.severity !== "info")
    .slice(0, 3)
    .map((finding) => `  - [${finding.severity}] ${finding.title}: ${finding.message}`)
    .join("\n");

  return [
    "",
    "Decision Summary",
    `  Risk: ${report.risk.score}/100 (${report.risk.level})`,
    `  Recommendation: ${report.decision.recommended}`,
    `  Policy: ${policyDecision.allowed ? "allow" : "deny"} - ${policyDecision.reason}`,
    "  Top findings:",
    topFindings || "  - none",
    ""
  ].join("\n");
}

function formatFindings(report: LatchAuditReport): string {
  return [
    "",
    "Findings",
    ...report.risk.findings.map((finding) => {
      const location = finding.file ? ` (${finding.file})` : "";
      const evidence = finding.evidence ? ` Evidence: ${finding.evidence}` : "";
      return `  - [${finding.severity}] ${finding.category}/${finding.code}${location}: ${finding.message}${evidence}`;
    }),
    ""
  ].join("\n");
}

function formatDiff(report: LatchAuditReport): string {
  const diff = report.diff;
  if (!diff?.previousVersion) {
    return "\nDiff\n  Previous version: none\n";
  }

  return [
    "",
    "Diff",
    `  Previous version: ${diff.previousVersion}`,
    `  Scripts added: ${formatList(diff.scriptsAdded)}`,
    `  Scripts removed: ${formatList(diff.scriptsRemoved)}`,
    `  Scripts changed: ${formatList(diff.scriptsChanged)}`,
    `  Dependencies added: ${formatList(diff.dependenciesAdded)}`,
    `  Dependencies removed: ${formatList(diff.dependenciesRemoved)}`,
    `  Bin changed: ${diff.binChanged ? "yes" : "no"}`,
    `  File count delta: ${formatMaybeNumber(diff.fileCountDelta)}`,
    `  Unpacked size delta: ${formatMaybeNumber(diff.unpackedSizeDelta)}`,
    `  Suspicious pattern delta: ${formatMaybeNumber(diff.suspiciousPatternDelta)}`,
    ""
  ].join("\n");
}

function formatList(values: string[]): string {
  return values.length ? values.join(", ") : "none";
}

function formatMaybeNumber(value?: number): string {
  return value === undefined ? "unknown" : String(value);
}

function mergeOptions(options: GlobalOptions): GlobalOptions {
  return { ...program.opts<GlobalOptions>(), ...options };
}

function shouldBypassCache(options: GlobalOptions): boolean {
  return options.noCache === true || options.cache === false || process.argv.includes("--no-cache");
}

function actionOptions(...values: Array<Command | GlobalOptions>): GlobalOptions {
  return values.reduce<GlobalOptions>((acc, value) => {
    if (typeof (value as Command).opts === "function") {
      return { ...acc, ...(value as Command).opts<GlobalOptions>() };
    }

    return { ...acc, ...(value as GlobalOptions) };
  }, {});
}

function handleError(error: unknown): never {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : undefined;
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`latchx: ${message}\n`);

  if (code === "PACKAGE_NOT_FOUND") {
    process.exit(exitCodes.packageNotFound);
  }

  if (code === "REGISTRY_ERROR") {
    process.exit(exitCodes.registryError);
  }

  if (code === "INTEGRITY_FAILED") {
    process.exit(exitCodes.integrityFailed);
  }

  if (code === "ANALYSIS_FAILED") {
    process.exit(exitCodes.analysisFailed);
  }

  if (code === "POLICY_ERROR") {
    process.exit(exitCodes.deniedByPolicy);
  }

  process.exit(exitCodes.generalError);
}
