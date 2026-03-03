export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div
        role="status"
        aria-label="로딩 중"
        className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
      />
    </div>
  )
}
