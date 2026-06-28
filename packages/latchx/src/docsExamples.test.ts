import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("documentation examples", () => {
  it("keeps README sections for demo and publishability", async () => {
    const readme = await readFile("../../README.md", "utf8");

    expect(readme).toContain("## Quick Start");
    expect(readme).toContain("## Human Usage");
    expect(readme).toContain("## CI And Agent Usage");
    expect(readme).toContain("## Policy Examples");
    expect(readme).toContain("## Risk Score");
    expect(readme).toContain("## Limitations");
    expect(readme).toContain("## Roadmap");
    expect(readme).toContain("npm run demo:latchx");
  });

  it("parses policy example files", async () => {
    const files = ["strict.policy.json", "relaxed.policy.json", "deny-lifecycle.policy.json"];

    for (const file of files) {
      const raw = await readFile(`../../examples/policies/${file}`, "utf8");
      expect(() => JSON.parse(raw)).not.toThrow();
    }
  });
});
