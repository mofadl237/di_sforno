"use client";

import { usePathname } from "next/navigation";

import Header from "@/src/Components/header/Header";
import { Footer, usePublicSettings } from "@/src/Components/Footer";

const DASHBOARD_SEGMENTS = ["dashboard", "admin"];

/** Renders the marketing chrome only on non-dashboard routes. */
export function MarketingChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChromeFree = DASHBOARD_SEGMENTS.some((segment) =>
    pathname.split("/").includes(segment),
  );
  const publicSettings = usePublicSettings(!isChromeFree);
  const primaryColor = publicSettings?.branding.primaryColor;

  if (isChromeFree) {
    return <>{children}</>;
  }

  const brandStyle = primaryColor
    ? ({ "--primary": primaryColor, "--ring": primaryColor } as React.CSSProperties)
    : undefined;

  return (
    <div className="flex flex-1 flex-col" style={brandStyle}>
      <div className="container flex-1">
        <Header />
        {children}
      </div>
      <Footer />
    </div>
  );
}
