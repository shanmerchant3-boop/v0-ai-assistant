export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
        <p className="text-muted-foreground">Loading users...</p>
      </div>
    </div>
  )
}
