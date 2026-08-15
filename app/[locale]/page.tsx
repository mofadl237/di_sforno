import BestSeller from "@/src/Components/BestSeller/BestSeller";
import Slider from "@/src/Components/Slider/Slider";
import { FloatingMenuCta } from "@/src/Components/Shared/FloatingMenuCta";
import { PublicOffers } from "@/src/Components/Offers/PublicOffers";
import { TableResolver } from "@/src/Components/Table/TableResolver";

interface IHomePageProps {
  searchParams: Promise<{ tableId?: string }>;
}

export default async function Home({ searchParams }: IHomePageProps) {
  const params = await searchParams;

  return (
    <>
      <TableResolver tableId={params.tableId} />
      <main className="flex min-h-screen w-full flex-col justify-center">
        <Slider />
        <BestSeller />
        <PublicOffers />
        <FloatingMenuCta />
      </main>
    </>
  );
}
