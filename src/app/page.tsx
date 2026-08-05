import Hero from "@/components/home/Hero";
import FeaturedCollection from "@/components/home/FeaturedCollection";
import FeaturedReadyToWear from "@/components/home/FeaturedReadyToWear";
import CustomJourneyCTA from "@/components/home/CustomJourneyCTA";
import { getDesigns, getProducts } from "@/lib/data";

export const revalidate = 60;

export default async function HomePage() {
  const [featured, rtw] = await Promise.all([
    getDesigns({ featured: true }),
    getProducts({ featured: true }),
  ]);

  return (
    <>
      <Hero />
      <FeaturedCollection designs={featured} />
      <FeaturedReadyToWear products={rtw} />
      <CustomJourneyCTA />
    </>
  );
}
