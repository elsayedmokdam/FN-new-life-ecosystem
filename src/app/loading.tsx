"use client";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      {/* Animated Financial Logo */}
      <div className="relative mb-8 flex h-24 w-24 items-center justify-center">
        {/* Ambient Glow */}
        <div className="absolute inset-0 animate-pulse rounded-full bg-primary/10 blur-2xl" />

        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border border-border/60" />

        {/* Rotating Ring */}
        <div className="absolute inset-1 animate-spin rounded-full border-2 border-transparent border-t-primary border-r-primary/30 nimation-duration-[3s]" />

        {/* Orbiting Dots */}
        <div className="absolute inset-0 animate-spin animation-duration-[4s]">
          <div className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-primary shadow-lg shadow-primary/30" />
        </div>

        <div className="absolute inset-2 animate-spin animation-duration-[5s] shimmer-reverse">
          <div className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-emerald-500" />
        </div>

        {/* Brand Container */}
        <div className="relative flex h-16 w-16 flex-col items-center justify-center overflow-hidden rounded-2xl border border-border/70 bg-background shadow-xl shadow-primary/5">
          {/* Subtle Background */}
          <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-emerald-500/10" />

          {/* Brand */}
          <div className="relative flex items-center gap-0.5">
            <span className="text-3xl font-black tracking-tighter text-primary">
              N
            </span>
            <span className="text-3xl font-black tracking-tighter text-emerald-500">
              L
            </span>
          </div>

          {/* Brand Accent */}
          <div className="relative mt-0.5 h-0.5 w-7 rounded-full bg-linear-to-r from-primary to-emerald-500" />
        </div>
      </div>

      {/* Brand Name */}
      <h2 className="text-2xl font-bold tracking-tight text-foreground">
        New Life
      </h2>

      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Ecosystem
      </p>

      {/* Description */}
      <p className="mt-4 text-sm text-muted-foreground">
        Securely preparing your workspace
      </p>

      {/* Progress Bar */}
      <div className="mt-7 h-1 w-40 overflow-hidden rounded-full bg-muted">
        <div className="h-full w-1/2 animate-[loading_1.8s_ease-in-out_infinite] rounded-full bg-linear-to-r from-primary via-emerald-500 to-primary" />
      </div>

      {/* Status */}
      <div className="mt-4 flex items-center gap-2">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />

        <p className="text-[10px] font-semibold tracking-[0.2em] text-muted-foreground/70">
          INITIALIZING SYSTEM
        </p>
      </div>

      {/* Footer */}
      <p className="mt-10 text-[10px] tracking-wide text-muted-foreground/40">
        Financial Management System
      </p>

      <style jsx>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(300%);
          }
        }
      `}</style>
    </div>
  );
}
