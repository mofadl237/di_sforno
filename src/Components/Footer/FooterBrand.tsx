"use client";

import { motion, Variants } from "framer-motion";
import { Link } from "@/src/i18n/routing";
import { useTranslations } from "next-intl";
import { usePublicSettings } from "./data";
import { RestaurantLogo } from "../Shared/RestaurantLogo";

export function FooterBrand({ variants }: { variants?: Variants }) {
  const t = useTranslations("footer");
  const tCommon = useTranslations("common");
  const publicSettings = usePublicSettings();
  const brandName = publicSettings?.restaurantName?.trim() || tCommon("brandName");

  return (
    <motion.div variants={variants} className="flex flex-col gap-5">
      <Link
        href="/"
        className="group inline-flex items-center gap-3 transition-colors duration-300"
        aria-label={tCommon("homeAria")}
      >
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform duration-300 group-hover:scale-110 md:h-16 md:w-16">
          <RestaurantLogo
            logo={publicSettings?.branding?.logo}
            iconClassName="text-xl md:text-2xl"
          />
        </span>
        <span className="font-heading text-xl font-semibold tracking-[0.18em] text-foreground">
          {brandName}
        </span>
      </Link>
      <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
        {t("description")}
      </p>
    </motion.div>
  );
}
