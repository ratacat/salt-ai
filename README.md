# salt-ai

A tiny library for salting LLM calls.

Minimal utilities for word sampling and cycling, aimed at procedural generation workflows.

### Install

- Requires Node >= 18
- Install deps: `npm i`

### Build and Dev

- Dev (watch): `npm run dev`
- Type-check: `npm run typecheck`
- Lint: `npm run lint`
- Build: `npm run build` (emits to `dist/`)

### Usage

Import from the package entry (ESM):

```ts
import { sample, cycleOf, parseList, loadList } from "salt-ai";

// Random sample of unique words
const words = ["red", "blue", "green", "green"]; // duplicates ok
const picks = sample(words, { n: 2, seed: 42 });

// With replacement (can repeat results)
const picksWithReplacement = sample(words, { n: 4, unique: false });

// Round-robin cycling
const next = cycleOf(["a", "b", "c"], 1);
next(2); // ["b", "c"]
next(3); // ["a", "b", "c"]

// Parse one-word-per-line text
const list = parseList(`# colors\nred\nblue\n# comment\n`); // ["red","blue"]

// Node-only: load list file from disk
const fileList = await loadList("./data/colors.txt");
```

Notes
- `seed`: deterministic PRNG (Mulberry32) when provided; omit for non-deterministic.
- `unique` (default true): samples without replacement. Set `false` for with-replacement.

### Git Workflow (brief)

- Current branch: `main` (repo initialized, no remote yet)
- Add a remote later: `git remote add origin <url>`
- Create a feature branch: `git checkout -b feat/my-change`
- Stage and commit: `git add -A && git commit -m "feat: my change"`
- Push first time: `git push -u origin feat/my-change`
- Open a PR on your hosting provider

### License

ISC
