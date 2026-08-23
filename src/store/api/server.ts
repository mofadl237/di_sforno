/**
 * Server-side read of the restaurant's public settings.
 *
 * The RTK Query store (`publicApi.ts`) is client-only, but `generateMetadata`
 * runs on the server, so this helper performs the SAME tenant-scoped request
 * as the `getRestaurant` endpoint: same URL (`/api/v1/public/restaurant`),
 * same `x-restaurant-id` header + `restaurantId` query param injected from the
 * `NEXT_PUBLIC_RESTORA_RESTAURANT_ID` env var, same `{ success, data }`
 * envelope, same `IPublicSettings` DTO. It is NOT a second API client — just
 * the server leg of the existing contract, needed because relative
 * `fetchBaseQuery` URLs cannot be used in server components.
 *
 * Wrapped in React `cache()` so every consumer within one render pass (layout
 * metadata + any server page) shares a single request. Never throws — callers
 * receive `null` and fall back to localized defaults.
 */

import { cache } from "react";

import type { IPublicSettings } from "./types";

const API_URL = process.env.NEXT_PUBLIC_RESTORA_API_URL ?? "";
const RESTAURANT_ID = process.env.NEXT_PUBLIC_RESTORA_RESTAURANT_ID ?? "";

export const getPublicSettings = cache(
  async (locale: string): Promise<IPublicSettings | null> => {
    if (!API_URL) return null;

    const params = new URLSearchParams({ locale });
    if (RESTAURANT_ID) params.set("restaurantId", RESTAURANT_ID);

    try {
      const response = await fetch(
        `${API_URL}/api/v1/public/restaurant?${params.toString()}`,
        {
          headers: RESTAURANT_ID ? { "x-restaurant-id": RESTAURANT_ID } : undefined,
          // ISR: branding/metadata refresh without redeploying each tenant site.
          next: { revalidate: 300 },
        },
      );
      if (!response.ok) return null;

      const body = (await response.json()) as {
        success: boolean;
        data?: IPublicSettings;
      };
      if (!body?.success || !body.data) return null;
      return body.data;
    } catch {
      return null;
    }
  },
);
