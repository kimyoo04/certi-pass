import type { ReactNode } from 'react'
import { Mail, Monitor, Moon, Sun } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useTheme } from '@/hooks/use-theme'

interface MobileLayoutProps {
  children: ReactNode
  title?: ReactNode
  showBack?: boolean
}

const themeIcon = {
  light: Sun,
  dark: Moon,
  system: Monitor,
} as const

const themeLabel = {
  light: '라이트 모드',
  dark: '다크 모드',
  system: '시스템 설정',
} as const

export function MobileLayout({ children, title, showBack = false }: MobileLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const { theme, cycleTheme } = useTheme()

  const ThemeIcon = themeIcon[theme]

  return (
    <div className="bg-background mx-auto flex min-h-dvh max-w-md flex-col">
      {/* Header */}
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 flex h-14 items-center border-b px-4 backdrop-blur">
        {showBack && !isHome && (
          <button
            onClick={() => navigate(-1)}
            className="hover:bg-accent mr-3 flex h-8 w-8 items-center justify-center rounded-md"
            aria-label="뒤로가기"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        )}
        <h1 className="truncate text-lg font-semibold">{title ?? 'CertiPass'}</h1>
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={cycleTheme}
            className="text-muted-foreground hover:bg-accent hover:text-foreground flex h-8 w-8 items-center justify-center rounded-md transition-colors"
            aria-label={themeLabel[theme]}
          >
            <ThemeIcon className="h-4 w-4" />
          </button>
          {isHome && (
            <button
              onClick={() => navigate('/contact')}
              className="text-muted-foreground hover:bg-accent hover:text-foreground flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors"
              aria-label="문의하기"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>문의</span>
            </button>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 py-4">{children}</main>
    </div>
  )
}
