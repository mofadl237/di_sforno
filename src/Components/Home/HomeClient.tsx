"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  useGetHomeQuery,
  useGetCategoriesQuery,
} from "@/src/store/api/publicApi";
import { Hero } from "@/src/Components/Home/Hero";
import { CategoryRail } from "@/src/Components/Home/CategoryRail";
import { OffersHorizontalRail } from "@/src/Components/Home/OffersHorizontalRail";
import { HomeSectionRenderer } from "@/src/Components/Home/HomeSectionRenderer";
import { StorySection } from "@/src/Components/Home/StorySection";
import { FinalCta } from "@/src/Components/Home/FinalCta";
import { FloatingMenuCta } from "@/src/Components/Shared/FloatingMenuCta";
import type { IHomeProduct } from "@/src/Interfaces";

const OFFER_SECTION_KEY = "offers";

export function HomeClient() {
  const locale = useLocale();
  const tHome = useTranslations("home.categories");

  const { data: home } = useGetHomeQuery({ locale });
  const { data: categories = [] } = useGetCategoriesQuery({ locale });

  const allSections = home?.sections ?? [];
  const bestSellers = home?.bestSellers ?? [];

  const offerSection = allSections.find((s) => s.key === OFFER_SECTION_KEY);

  const nonOfferSections = allSections
    .filter((s) => s.key !== OFFER_SECTION_KEY && s.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const sectionDataMap: Record<string, IHomeProduct[]> = {
    "best-sellers": bestSellers,
  };

  const sectionData = nonOfferSections.map((section) => ({
    key: section.key,
    products: sectionDataMap[section.key] ?? [],
  }));

  const hasCategories = categories.length > 0;
  const hasNonOfferSections = sectionData.some((s) => s.products.length > 0);

  return (
    <main className="flex min-h-screen w-full flex-col">
      <Hero />

      {hasCategories && (
        <section className="py-8 md:py-12 lg:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="px-4 md:px-6 lg:px-0">
              <div className="text-center mb-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                  <span className="mr-2 text-primary">&mdash;</span>
                  {tHome("eyebrow")}
                  <span className="ml-2 text-primary">&mdash;</span>
                </p>
                <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {tHome("title")}
                </h2>
                <div
                  className="mx-auto mt-4 h-px w-16"
                  style={{
                    background:
                      "linear-gradient(to right, transparent, var(--color-primary), transparent)",
                  }}
                />
              </div>
            </div>
            <CategoryRail categories={categories} />
          </div>
        </section>
      )}

      {offerSection && (
        <OffersHorizontalRail
          sectionName={offerSection.name}
          sectionSubtitle="Deals and bundles available right now"
        />
      )}

      {hasNonOfferSections && (
        <HomeSectionRenderer
          sections={nonOfferSections}
          sectionData={sectionData}
        />
      )}

      <StorySection />
      <FinalCta />
      <FloatingMenuCta />
    </main>
  );
}
