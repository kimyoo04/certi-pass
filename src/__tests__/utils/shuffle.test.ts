import { fisherYatesShuffle } from '@/utils/shuffle'

describe('fisherYatesShuffle', () => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  it('returns array of same length', () => {
    const result = fisherYatesShuffle(items)
    expect(result).toHaveLength(items.length)
  })

  it('contains all original elements', () => {
    const result = fisherYatesShuffle(items)
    expect(result.sort((a, b) => a - b)).toEqual(items)
  })

  it('does not mutate original array', () => {
    const original = [...items]
    fisherYatesShuffle(items)
    expect(items).toEqual(original)
  })

  it('produces deterministic results with same seed', () => {
    const result1 = fisherYatesShuffle(items, 'test-seed')
    const result2 = fisherYatesShuffle(items, 'test-seed')
    expect(result1).toEqual(result2)
  })

  it('produces different results with different seeds', () => {
    const result1 = fisherYatesShuffle(items, 'seed-a')
    const result2 = fisherYatesShuffle(items, 'seed-b')
    expect(result1).not.toEqual(result2)
  })

  it('handles empty array', () => {
    expect(fisherYatesShuffle([])).toEqual([])
  })

  it('handles single element array', () => {
    expect(fisherYatesShuffle([42])).toEqual([42])
  })
})
