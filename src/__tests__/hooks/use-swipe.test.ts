import type { TouchEvent } from 'react'
import { act, renderHook } from '@testing-library/react'

import { useSwipe } from '@/hooks/use-swipe'

function createTouchEvent(clientX: number, clientY: number) {
  return {
    touches: [{ clientX, clientY }],
    changedTouches: [{ clientX, clientY }],
  } as unknown as TouchEvent<Element>
}

describe('useSwipe', () => {
  it('calls onSwipeLeft on left swipe', () => {
    const onSwipeLeft = vi.fn()
    const { result } = renderHook(() => useSwipe({ onSwipeLeft, threshold: 50 }))

    act(() => {
      result.current.onTouchStart(createTouchEvent(200, 100))
      result.current.onTouchEnd(createTouchEvent(100, 100))
    })

    expect(onSwipeLeft).toHaveBeenCalledTimes(1)
  })

  it('calls onSwipeRight on right swipe', () => {
    const onSwipeRight = vi.fn()
    const { result } = renderHook(() => useSwipe({ onSwipeRight, threshold: 50 }))

    act(() => {
      result.current.onTouchStart(createTouchEvent(100, 100))
      result.current.onTouchEnd(createTouchEvent(250, 100))
    })

    expect(onSwipeRight).toHaveBeenCalledTimes(1)
  })

  it('does not trigger when below threshold', () => {
    const onSwipeLeft = vi.fn()
    const onSwipeRight = vi.fn()
    const { result } = renderHook(() => useSwipe({ onSwipeLeft, onSwipeRight, threshold: 50 }))

    act(() => {
      result.current.onTouchStart(createTouchEvent(100, 100))
      result.current.onTouchEnd(createTouchEvent(130, 100))
    })

    expect(onSwipeLeft).not.toHaveBeenCalled()
    expect(onSwipeRight).not.toHaveBeenCalled()
  })

  it('does not trigger when vertical movement is dominant', () => {
    const onSwipeLeft = vi.fn()
    const { result } = renderHook(() => useSwipe({ onSwipeLeft, threshold: 50 }))

    act(() => {
      result.current.onTouchStart(createTouchEvent(200, 100))
      result.current.onTouchEnd(createTouchEvent(100, 300))
    })

    expect(onSwipeLeft).not.toHaveBeenCalled()
  })

  it('uses default threshold of 50', () => {
    const onSwipeLeft = vi.fn()
    const { result } = renderHook(() => useSwipe({ onSwipeLeft }))

    // 49px swipe - below default 50 threshold
    act(() => {
      result.current.onTouchStart(createTouchEvent(149, 100))
      result.current.onTouchEnd(createTouchEvent(100, 100))
    })

    expect(onSwipeLeft).not.toHaveBeenCalled()
  })
})
