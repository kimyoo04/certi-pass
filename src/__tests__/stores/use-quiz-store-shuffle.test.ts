import { useQuizStore } from '@/stores/use-quiz-store'

describe('useQuizStore - shuffle', () => {
  describe('shuffleEnabled', () => {
    it('defaults to false', () => {
      expect(useQuizStore.getState().shuffleEnabled).toBe(false)
    })

    it('toggles on', () => {
      useQuizStore.getState().toggleShuffle()
      expect(useQuizStore.getState().shuffleEnabled).toBe(true)
    })

    it('toggles off after second call', () => {
      useQuizStore.getState().toggleShuffle()
      useQuizStore.getState().toggleShuffle()
      expect(useQuizStore.getState().shuffleEnabled).toBe(false)
    })
  })
})
