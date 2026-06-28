# Latch Report Examples

This directory is reserved for checked-in report samples.

Generate a JSON report locally:

```bash
npm run build
node ../../packages/latchx/dist/index.js audit is-number --json --ci > is-number.report.json
```

Do not commit reports for large packages unless they are intentionally used for documentation or regression testing.
