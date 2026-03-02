/** Client-side utilities for writing JSON back to disk via the Vite dev server. */

type Timer = ReturnType<typeof setTimeout>

function debounce<T extends (...args: never[]) => void>(fn: T, ms: number): T {
  let timer: Timer | undefined
  return ((...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }) as unknown as T
}

async function postJson(url: string, body: unknown): Promise<void> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const err = await res.text()
      console.error(`[dev-persist] ${url} failed:`, err)
    }
  } catch (e) {
    console.error(`[dev-persist] ${url} error:`, e)
  }
}

/** Write a JSON file relative to `public/data/`. No-op in production. */
export const saveJsonFile: (relativePath: string, data: unknown) => void = import.meta.env.DEV
  ? debounce((relativePath: string, data: unknown) => {
      postJson('/__dev-api/write-json', { filePath: relativePath, data })
    }, 300)
  : () => {}

/** Patch questions in quiz JSON files. No-op in production. */
export const patchQuestions: (
  subjectDir: string,
  questionEdits: Record<string, Record<string, unknown>>,
) => void = import.meta.env.DEV
  ? debounce((subjectDir: string, questionEdits: Record<string, Record<string, unknown>>) => {
      postJson('/__dev-api/patch-questions', { subjectDir, questionEdits })
    }, 300)
  : () => {}
