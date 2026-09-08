import { revalidatePath, revalidateTag } from "next/cache";

export function revalidateProducts(slug?: string) {
  revalidateTag("products");
  revalidatePath("/");
  revalidatePath("/shop");
  if (slug) {
    revalidatePath(`/shop/${slug}`);
  }
}

export function revalidateDesigns(slug?: string) {
  revalidateTag("designs");
  revalidatePath("/");
  revalidatePath("/collections");
  if (slug) {
    revalidatePath(`/collections/${slug}`);
  }
}

export function revalidateTestimonials() {
  revalidateTag("testimonials");
  revalidatePath("/testimonials");
}
