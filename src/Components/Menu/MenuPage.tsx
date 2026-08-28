"use client";

import { useLocale } from "next-intl";
import {
  useGetCategoriesQuery,
  useGetHomeQuery,
  useGetMenuPageQuery,
} from "@/src/store/api/publicApi";
import { MenuPageClient } from "./MenuPageClient";
import { MenuSkeleton } from "./MenuSkeleton";

export default function MenuPage() {
  const locale = useLocale();

  const { data: home, isLoading: homeLoading } = useGetHomeQuery({ locale });
  const { data: categories = [], isLoading: categoriesLoading } =
    useGetCategoriesQuery({ locale });
  const { data: menuPage, isLoading: menuLoading } = useGetMenuPageQuery({
    locale,
    page: 1,
    limit: 100,
  });

  const homeSections = (home?.sections ?? []).map((section) => ({
    id: section.id,
    key: section.key,
    name: section.name,
  }));
  const products = menuPage?.items ?? [];

  if (homeLoading || categoriesLoading || menuLoading) {
    return <MenuSkeleton />;
  }

  return (
    <MenuPageClient
      homeSections={homeSections}
      categories={categories}
      products={products}
      initialSection="featured"
      initialCategory="all"
      initialQuery=""
    />
  );
}
