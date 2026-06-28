import { describe, expect, it } from "vitest";
import { planAfterAudit } from "./flow.js";

describe("planAfterAudit", () => {
  it("makes --ci no-prompt and report-only when allowed", () => {
    expect(planAfterAudit("run", { ci: true }, { allowed: true })).toEqual({ action: "exit", code: 0 });
  });

  it("makes --ci no-prompt and denied by policy when disallowed", () => {
    expect(planAfterAudit("run", { ci: true }, { allowed: false })).toEqual({ action: "exit", code: 3 });
  });

  it("prompts for non-ci run without --yes", () => {
    expect(planAfterAudit("run", {}, { allowed: true })).toEqual({ action: "prompt" });
  });
});
