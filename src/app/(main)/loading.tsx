export default function Loading() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-7xl flex-col items-center justify-center px-4">
      <div className="h-10 w-48 animate-pulse rounded-lg bg-muted" />
      <div className="mt-6 w-full max-w-md space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    </div>
  );
}