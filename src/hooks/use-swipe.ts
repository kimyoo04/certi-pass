import { useCallback, useRef, type TouchEvent } from 'react'

interface UseSwipeOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  threshold?: number
}

export function useSwipe({ onSwipeLeft, onSwipeRight, threshold = 50 }: UseSwipeOptions) {
  const startX = useRef(0)
  const startY = useRef(0)

  const onTouchStart = useCallback((e: TouchEvent) => {
    startX.current = e.touches[0].clientX
    startY.current = e.touches[0].clientY
  }, [])

  const onTouchEnd = useCallback(
    (e: TouchEvent) => {
      const deltaX = e.changedTouches[0].clientX - startX.current
      const deltaY = e.changedTouches[0].clientY - startY.current

      // Only trigger if horizontal movement is dominant
      if (Math.abs(deltaX) < threshold || Math.abs(deltaY) > Math.abs(deltaX)) {
        return
      }

      if (deltaX < 0) {
        onSwipeLeft?.()
      } else {
        onSwipeRight?.()
      }
    },
    [onSwipeLeft, onSwipeRight, threshold],
  )

  return { onTouchStart, onTouchEnd }
}
