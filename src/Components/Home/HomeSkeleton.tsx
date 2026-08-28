"use client";

export function HomeSkeleton() {
  return (
    <main
      className="flex min-h-screen w-full flex-col"
      aria-busy="true"
      aria-label="Loading content"
    >
      {/* Hero */}
      <div className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-muted/30 md:min-h-screen">
        <div className="absolute inset-0 animate-pulse bg-muted/50" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 mx-auto w-full max-w-3xl px-6">
          <div className="mx-auto mb-5 h-9 w-32 animate-pulse rounded-full bg-white/30" />
          <div className="mx-auto h-12 w-4/5 animate-pulse rounded-lg bg-white/30 sm:h-16" />
          <div className="mx-auto mt-4 h-12 w-3/5 animate-pulse rounded-lg bg-white/30 sm:h-16" />
          <div className="mx-auto mt-6 h-5 w-1/2 max-w-sm animate-pulse rounded bg-white/20" />
          <div className="mt-9 flex items-center justify-center gap-3">
            <div className="h-12 w-44 animate-pulse rounded-full bg-white/30" />
            <div className="h-12 w-12 animate-pulse rounded-full bg-white/20" />
          </div>
        </div>
      </div>

      {/* Categories section */}
      <section className="py-8 md:py-12 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 px-4 text-center md:px-6 lg:px-0">
            <div className="mx-auto mb-3 h-3 w-28 animate-pulse rounded-full bg-muted/60" />
            <div className="mx-auto h-8 w-48 animate-pulse rounded-lg bg-muted/60" />
            <div className="mx-auto mt-4 h-px w-16 animate-pulse bg-muted/60" />
          </div>
          <div className="flex gap-4 overflow-hidden px-4 md:px-6 lg:px-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex w-24 shrink-0 flex-col items-center gap-2"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="h-20 w-20 animate-pulse rounded-full bg-muted/60" />
                <div className="h-3 w-16 animate-pulse rounded bg-muted/60" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product sections */}
      {[0, 1].map((section) => (
        <section key={section} className="py-8 md:py-14 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="px-4 md:px-6 lg:px-0">
              <div className="h-3 w-28 animate-pulse rounded bg-muted/60" />
              <div className="mt-2 h-7 w-52 animate-pulse rounded-lg bg-muted/60" />
            </div>
            <div className="mt-8 flex gap-4 overflow-hidden px-4 md:px-6 lg:px-0">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex w-[260px] min-w-[260px] shrink-0 flex-col overflow-hidden rounded-2xl border border-border/50 bg-card sm:w-[280px] sm:min-w-[280px]"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <div className="aspect-[4/3] w-full animate-pulse bg-muted/60" />
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <div className="h-3.5 w-3/4 animate-pulse rounded bg-muted/60" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-muted/60" />
                    <div className="mt-auto h-4 w-12 animate-pulse rounded bg-muted/60" />
                  </div>
                  <div className="px-4 pb-4">
                    <div className="h-11 w-full animate-pulse rounded-xl bg-muted/60" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}
