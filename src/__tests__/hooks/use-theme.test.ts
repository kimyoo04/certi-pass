import { act, renderHook } from '@testing-library/react'

import { useTheme } from '@/hooks/use-theme'
import { STORAGE_KEYS } from '@/constants'

describe('useTheme', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark')
  })

  it('defaults to system theme when no stored value', () => {
    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('system')
  })

  it('reads stored theme from localStorage', () => {
    localStorage.setItem(STORAGE_KEYS.THEME, 'dark')

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('dark')
  })

  it('setTheme updates theme and localStorage', () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.setTheme('dark')
    })

    expect(result.current.theme).toBe('dark')
    expect(localStorage.getItem(STORAGE_KEYS.THEME)).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('setTheme to light removes dark class', () => {
    document.documentElement.classList.add('dark')
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.setTheme('light')
    })

    expect(result.current.theme).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('cycleTheme cycles through light -> dark -> system', () => {
    localStorage.setItem(STORAGE_KEYS.THEME, 'light')
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.cycleTheme()
    })
    expect(result.current.theme).toBe('dark')

    act(() => {
      result.current.cycleTheme()
    })
    expect(result.current.theme).toBe('system')

    act(() => {
      result.current.cycleTheme()
    })
    expect(result.current.theme).toBe('light')
  })
})
