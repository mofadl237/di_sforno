"use client";

export function MenuSkeleton() {
  return (
    <div className="min-h-screen" aria-busy="true" aria-label="Loading menu">
      {/* Menu header */}
      <div className="flex items-center justify-between px-0 py-3">
        <div className="h-4 w-24 animate-pulse rounded bg-muted/70" />
        <div className="h-5 w-28 animate-pulse rounded-md bg-muted/70" />
        <div className="h-4 w-14 animate-pulse rounded bg-muted/70" />
      </div>

      {/* Sticky filter bar */}
      <div className="sticky top-[4.75rem] z-30 -mx-4 border-b border-border/40 bg-background/95 px-4 pb-2.5 pt-2 backdrop-blur-md md:-mx-6 md:px-6 lg:-mx-12 lg:px-12">
        <div className="h-10 w-full animate-pulse rounded-xl bg-muted/60" />
        <div className="mt-3 flex gap-2 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-20 shrink-0 animate-pulse rounded-full bg-muted/60"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
      </div>

      {/* Product grid */}
      <div className="space-y-6 pb-12 pt-4">
        {[0, 1].map((group) => (
          <div key={group}>
            <div className="mb-2 h-3 w-24 animate-pulse rounded bg-muted/60" />
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-2.5 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} index={group * 4 + i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductCardSkeleton({ index }: { index: number }) {
  return (
    <div
      className="flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="aspect-[4/3] w-full animate-pulse bg-muted/60" />
      <div className="flex flex-1 flex-col gap-2 p-2.5">
        <div className="h-3.5 w-3/4 animate-pulse rounded bg-muted/60" />
        <div className="h-3 w-16 animate-pulse rounded bg-muted/60" />
      </div>
      <div className="px-2.5 pb-2.5">
        <div className="h-8 w-full animate-pulse rounded-xl bg-muted/60" />
      </div>
    </div>
  );
}
