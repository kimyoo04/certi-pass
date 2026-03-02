/**
 * Fisher-Yates shuffle with optional seed for deterministic results.
 * Returns a new array; does not mutate the input.
 */
export function fisherYatesShuffle<T>(array: T[], seed?: string): T[] {
  const result = [...array]
  let random: () => number

  if (seed) {
    // Simple seeded PRNG (mulberry32)
    let h = 0
    for (let i = 0; i < seed.length; i++) {
      h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0
    }
    random = () => {
      h |= 0
      h = (h + 0x6d2b79f5) | 0
      let t = Math.imul(h ^ (h >>> 15), 1 | h)
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
  } else {
    random = Math.random
  }

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }

  return result
}
