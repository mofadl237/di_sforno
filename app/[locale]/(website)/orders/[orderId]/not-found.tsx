import { Link } from "@/src/i18n/routing";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "order" });
  return { title: t("notFoundTitle") };
}

const OrderNotFound = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "order" });
  const menuT = await getTranslations({ locale, namespace: "menu" });

  return (
    <div className="container marginSection flex flex-col items-center text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-border bg-muted">
        <span className="text-4xl" aria-hidden>
          🔍
        </span>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {t("notFoundTitle")}
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {t("notFoundDescription")}
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/menu"
          className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-[filter] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {menuT("browseMenu")}
        </Link>
        <Link
          href="/"
          className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          {t("backToHome")}
        </Link>
      </div>
    </div>
  );
};

export default OrderNotFound;
