// salt.ts — minimal core (ESM/TypeScript)

export interface RandomOpts {
  /** How many words to return */
  n: number;
  /** Deterministic when provided (32-bit int). Omit for non-deterministic. */
  seed?: number;
  /** Default true: sample without replacement. Set false for with-replacement. */
  unique?: boolean;
}

/** Mulberry32: tiny fast deterministic PRNG for seeding. */
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 1);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(xs: T[], rng: () => number) {
  const a = xs.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Random: pick N words. Unique by default. */
export function sample(
  words: readonly string[],
  opts: RandomOpts
): string[] {
  const { n, seed, unique = true } = opts;
  if (!Array.isArray(words) || words.length === 0 || n <= 0) return [];
  const rng = seed == null ? Math.random : mulberry32(seed >>> 0);

  if (unique) {
    const base = Array.from(new Set(words));
    return shuffle(base, rng).slice(0, Math.min(n, base.length));
  } else {
    // with replacement
    const out: string[] = [];
    for (let i = 0; i < n; i++) out.push(words[Math.floor(rng() * words.length)]);
    return out;
  }
}

/**
 * cycleOf: returns a function that yields the next N items on each call,
 * cycling over the provided list (round-robin). It maintains an internal cursor.
 */
export function cycleOf(words: readonly string[], start = 0) {
  const list = Array.from(words); // snapshot; preserves duplicates and order
  let cursor = normalize(start, list.length);

  return (n = 1): string[] => {
    const L = list.length;
    if (!L || n <= 0) return [];
    const out = new Array<string>(n);
    let i = cursor;
    for (let k = 0; k < n; k++) {
      out[k] = list[i];
      i = (i + 1) % L;
    }
    cursor = i; // park after the last yielded item
    return out;
  };
}

function normalize(i: number, L: number) {
  if (L <= 0) return 0;
  return ((i % L) + L) % L;
}

/** Parse one-word-per-line list text into an array. */
export function parseList(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith("#"));
}

/** Node-only helper to load a list file from disk. */
export async function loadList(filePath: string): Promise<string[]> {
  try {
    // Dynamic import keeps browser bundles clean.
    const fs = await import("node:fs/promises");
    return parseList(await fs.readFile(filePath, "utf8"));
  } catch (err) {
    throw new Error(
      `loadList("${filePath}") requires Node 'fs/promises'. ` +
        `If you're in a browser, fetch the file yourself and use parseList().`
    );
  }
}

