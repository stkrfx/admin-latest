'use server';

import { connectMongo } from "@/lib/db";
import FAQ from "@/lib/models/FAQ";
import { revalidatePath } from "next/cache";

export async function getFAQs() {
  await connectMongo();
  const faqs = await FAQ.find().sort({ order: 1 }).lean();
  return JSON.parse(JSON.stringify(faqs));
}

export async function saveFAQ(data) {
  await connectMongo();
  if (data.id) {
    await FAQ.findByIdAndUpdate(data.id, data);
  } else {
    await FAQ.create(data);
  }
  revalidatePath('/faqs');
  return { success: true };
}

export async function deleteFAQ(id) {
  await connectMongo();
  await FAQ.findByIdAndDelete(id);
  revalidatePath('/faqs');
  return { success: true };
}