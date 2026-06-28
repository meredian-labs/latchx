import type { PolicyDecision } from "latch-core";

export type FlowMode = "audit" | "run";

export type FlowOptions = {
  ci?: boolean;
  yes?: boolean;
};

export type FlowPlan =
  | { action: "exit"; code: 0 | 3 }
  | { action: "audit-only" }
  | { action: "policy-denied"; code: 3 }
  | { action: "run" }
  | { action: "prompt" };

export function planAfterAudit(mode: FlowMode, options: FlowOptions, policyDecision: Pick<PolicyDecision, "allowed">): FlowPlan {
  if (options.ci) {
    return { action: "exit", code: policyDecision.allowed ? 0 : 3 };
  }

  if (mode === "audit") {
    return { action: "audit-only" };
  }

  if (!policyDecision.allowed) {
    return { action: "policy-denied", code: 3 };
  }

  if (options.yes) {
    return { action: "run" };
  }

  return { action: "prompt" };
}
