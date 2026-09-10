import Hero from "@/components/home/Hero";
import FeaturedCollection from "@/components/home/FeaturedCollection";
import NewArrivalsSection from "@/components/home/NewArrivalsSection";
import ShopCategoryHeroes from "@/components/home/ShopCategoryHeroes";
import BridalStatement from "@/components/home/BridalStatement";
import CustomJourneyCTA from "@/components/home/CustomJourneyCTA";
import { getDesigns, getProducts } from "@/lib/data";

export const revalidate = 60;

export default async function HomePage() {
  const [featured, allProducts, luxePret, semiFormals, formals] =
    await Promise.all([
      getDesigns({ featured: true }),
      getProducts(),
      getProducts({ category: "luxe-pret" }),
      getProducts({ category: "semi-formals" }),
      getProducts({ category: "formals" }),
    ]);

  const productsByCategory = {
    "luxe-pret": luxePret,
    "semi-formals": semiFormals,
    formals,
  };

  return (
    <>
      <Hero />
      <NewArrivalsSection
        allProducts={allProducts}
        productsByCategory={productsByCategory}
      />
      <ShopCategoryHeroes productsByCategory={productsByCategory} />
      <BridalStatement />
      <FeaturedCollection designs={featured} />
      <CustomJourneyCTA />
    </>
  );
}
