import { FiCreditCard, FiLock, FiShield, FiBarChart2 } from "react-icons/fi";
import logo from "../../../../public/images/logo.png";
import Image from "next/image";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  appName: string;
  tagline: string;
  highlights: string[];
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  appName,
  tagline,
  highlights,
  children,
  footer,
}: AuthLayoutProps) {
  const icons = [FiLock, FiShield, FiBarChart2];
  return (
    <section className="min-h-dvh py-10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="hidden lg:block">
            <div className="rounded-[32px] bg-linear-to-br from-main-color to-sky-500 p-16 text-white shadow-xl">
              {/* <FiCreditCard className="mb-8 size-20 opacity-90" /> */}
              <Image
                className="mb-8 mx-auto size-30 rounded-3xl"
                src={logo}
                alt="New Life Group"
              />
              <h1 className="text-4xl text-center font-bold tracking-tight">
                {tagline}
              </h1>
            </div>
            <div className="mt-10 flex items-center justify-center gap-8">
              {highlights.map((h, i) => {
                const Icon = icons[i % icons.length];
                return (
                  <div
                    key={h}
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <Icon className="text-main-color" />
                    <p className="text-xs font-semibold">{h}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] lg:p-10">
            <div className="mb-8 text-center">
              <p className="text-3xl font-semibold text-main-color">
                {appName}
              </p>
              <p className="mt-4 text-2xl font-bold text-foreground">{title}</p>
              {subtitle && (
                <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
            {children}
            {footer && (
              <>
                <div className="my-5 h-px w-full bg-linear-to-r from-transparent via-border to-transparent" />
                <div className="text-center text-sm text-muted-foreground">
                  {footer}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
