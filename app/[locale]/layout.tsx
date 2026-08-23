import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Noto_Sans,
  Playfair_Display,
} from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/src/i18n/routing";
import { getI18nRuntimeConfig } from "@/src/i18n/config";
import { getPublicSettings } from "@/src/store/api/server";
import "../globals.css";
import { cn } from "@/lib/utils";
import { MarketingChrome } from "./MarketingChrome";
import { Providers } from "@/src/Providers/Providers";
import { ToastProvider } from "@/src/Providers/ToastProvider";

const playfairDisplayHeading = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Tenant metadata, resolved from the Public Restaurant API of the configured
 * restaurant (`NEXT_PUBLIC_RESTORA_RESTAURANT_ID`) — never hardcoded. The
 * social share preview (WhatsApp/Facebook/Telegram/…) uses the API's
 * `branding.coverImage`, falling back to `branding.logo`. Child pages inherit
 * openGraph/twitter and only override title/description.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [settings, tCommon, tFooter] = await Promise.all([
    getPublicSettings(locale),
    getTranslations({ locale, namespace: "common" }),
    getTranslations({ locale, namespace: "footer" }),
  ]);

  const name = settings?.restaurantName?.trim() || tCommon("brandName");
  const description = tFooter("description");
  const socialImage =
    settings?.branding?.coverImage?.trim() || settings?.branding?.logo?.trim() || "";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");

  return {
    ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
    title: name,
    description,
    openGraph: {
      title: name,
      description,
      type: "website",
      siteName: name,
      locale,
      ...(siteUrl ? { url: siteUrl } : {}),
      ...(socialImage ? { images: [{ url: socialImage, alt: name }] } : {}),
    },
    twitter: {
      card: socialImage ? "summary_large_image" : "summary",
      title: name,
      description,
      ...(socialImage ? { images: [socialImage] } : {}),
    },
  };
}

export async function generateStaticParams() {
  const { locales } = await getI18nRuntimeConfig();
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        notoSans.variable,
        playfairDisplayHeading.variable,
      )}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <MarketingChrome>{children}</MarketingChrome>
            <ToastProvider />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
