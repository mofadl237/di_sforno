"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { notFound } from "next/navigation";
import {
  useGetOrderByIdQuery,
  useGetRestaurantQuery,
} from "@/src/store/api/publicApi";
import {
  buildInvoice,
  buildRestaurant,
  mapOrderDetail,
} from "@/src/lib/orderDisplay";
import OrderDetailsClient from "./OrderDetailsClient";

export default function OrderDetailsPage() {
  const params = useParams<{ orderId: string }>();
  const locale = useLocale();

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const orderId = params?.orderId;

  const { data: order, isLoading, isError } = useGetOrderByIdQuery(
    { id: orderId ?? "", locale },
    { skip: !mounted || !orderId },
  );
  const { data: settings } = useGetRestaurantQuery(
    { locale },
    { skip: !mounted },
  );

  useEffect(() => {
    if (!mounted) return;
    if (isLoading) return;
    if (isError || order === null || order === undefined) {
      notFound();
    }
  }, [mounted, isLoading, isError, order, orderId]);

  if (!mounted || isLoading || !order || !settings) {
    return (
      <div className="container marginSection" aria-busy="true">
        {/* Back navigation */}
        <div className="mb-6 flex items-center gap-3">
          <div className="h-4 w-20 animate-pulse rounded bg-muted/70" />
          <span className="h-3 w-1 animate-pulse rounded bg-muted/60" />
          <div className="h-4 w-16 animate-pulse rounded bg-muted/70" />
          <div className="ms-auto h-8 w-28 animate-pulse rounded-lg bg-muted/60" />
        </div>

        {/* Success banner */}
        <div
          className="mb-6 h-24 animate-pulse rounded-2xl border border-border/40 bg-card"
          style={{ animationDelay: "60ms" }}
        />

        {/* Header */}
        <div
          className="mb-6 h-36 animate-pulse rounded-2xl border border-border/40 bg-card"
          style={{ animationDelay: "120ms" }}
        />

        {/* Two-column grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px] lg:items-start xl:grid-cols-[1fr_400px]">
          <div className="space-y-6">
            <div
              className="h-64 animate-pulse rounded-2xl border border-border/40 bg-card"
              style={{ animationDelay: "180ms" }}
            />
            <div
              className="h-40 animate-pulse rounded-2xl border border-border/40 bg-card"
              style={{ animationDelay: "240ms" }}
            />
          </div>
          <div className="space-y-6">
            <div
              className="h-64 animate-pulse rounded-2xl border border-border/40 bg-card"
              style={{ animationDelay: "300ms" }}
            />
            <div
              className="h-48 animate-pulse rounded-2xl border border-border/40 bg-card"
              style={{ animationDelay: "360ms" }}
            />
          </div>
        </div>
      </div>
    );
  }

  const currencyCode = settings.currency || null;
  const orderDetail = mapOrderDetail(order, locale, currencyCode);
  const invoice = buildInvoice(order, locale, currencyCode);
  const restaurant = buildRestaurant(settings);

  return (
    <OrderDetailsClient
      order={orderDetail}
      invoice={invoice}
      restaurant={restaurant}
    />
  );
}
