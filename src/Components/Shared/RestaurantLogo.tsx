"use client";

import Image from "next/image";
import { FaPizzaSlice } from "react-icons/fa6";
import { cn } from "@/lib/utils";

interface IRestaurantLogoProps {
  /** `branding.logo` from the Public Restaurant API. Empty/missing → icon mark. */
  logo?: string | null;
  className?: string;
  iconClassName?: string;
}

/**
 * Restaurant logo mark. Renders the tenant's `branding.logo` (never a
 * hardcoded URL) via next/image when the API provides one; otherwise falls
 * back to the built-in pizza icon, preserving the original placeholder.
 *
 * With a logo, the component IS the circular composition: the API image is
 * clipped by a rounded-full overflow-hidden disc (border/shadow/background
 * included) and contained with proportional padding — never a rectangle
 * dropped inside someone else's circle.
 */
export function RestaurantLogo({ logo, className, iconClassName }: IRestaurantLogoProps) {
  const src = logo?.trim();
  if (!src) {
    // Fallback mark inherits the host circle (bg-primary/text-primary-foreground).
    return <FaPizzaSlice className={cn("text-lg md:text-xl", iconClassName)} />;
  }
  return (
    <span
      className={cn(
        "relative block h-full w-full overflow-hidden rounded-full border-border/60 bg-background shadow-sm border",
        className,
      )}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="(min-width: 768px) 64px, 44px"
        className="object-contain p-[9%]"
      />
    </span>
  );
}
