import { useCallback, useEffect, useMemo, useState } from 'react'

const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

interface CacheEntry<T> {
  data: T
  timestamp: number
}

const cache = new Map<string, CacheEntry<unknown>>()
const inflight = new Map<string, Promise<unknown>>()

function getCached<T>(url: string): T | undefined {
  const entry = cache.get(url)
  if (!entry) return undefined
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(url)
    return undefined
  }
  return entry.data as T
}

export async function cachedFetch<T>(url: string): Promise<T> {
  const cached = getCached<T>(url)
  if (cached !== undefined) return cached

  const existing = inflight.get(url)
  if (existing) return existing as Promise<T>

  const promise = fetch(url)
    .then((res) => res.json() as Promise<T>)
    .then((data) => {
      cache.set(url, { data, timestamp: Date.now() })
      inflight.delete(url)
      return data
    })
    .catch((err) => {
      inflight.delete(url)
      throw err
    })

  inflight.set(url, promise)
  return promise
}

export function clearFetchCache() {
  cache.clear()
  inflight.clear()
}

interface UseCachedFetchResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
  retry: () => void
}

export function useCachedFetch<T>(url: string | null): UseCachedFetchResult<T> {
  // Track a version counter to trigger re-renders on retry
  const [retryCount, setRetryCount] = useState(0)

  // Compute initial/cached state synchronously during render
  const cachedData = useMemo(() => {
    if (!url) return undefined
    return getCached<T>(url)
    // retryCount dependency ensures re-read after cache clear
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, retryCount])

  const [asyncData, setAsyncData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Only fetch when there's no cached data
  useEffect(() => {
    if (!url) return
    if (getCached(url) !== undefined) return

    setLoading(true)
    setError(null)
    let cancelled = false

    cachedFetch<T>(url)
      .then((result) => {
        if (!cancelled) {
          setAsyncData(result)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)))
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [url, retryCount])

  const retry = useCallback(() => {
    if (url) cache.delete(url)
    setAsyncData(null)
    setRetryCount((c) => c + 1)
  }, [url])

  // Determine the final data: prefer cached (synchronous), fallback to async
  const data = url === null ? null : (cachedData ?? asyncData ?? null)
  const isLoading = url !== null && data === null && !error && (loading || cachedData === undefined)

  return { data, loading: isLoading, error: url === null ? null : error, retry }
}
