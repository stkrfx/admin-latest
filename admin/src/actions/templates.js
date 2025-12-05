'use server';

import { connectMongo } from "@/lib/db";
import EmailTemplate from "@/lib/models/EmailTemplate";
import { revalidatePath } from "next/cache";

export async function getTemplates() {
  await connectMongo();
  const templates = await EmailTemplate.find().sort({ name: 1 }).lean();
  return JSON.parse(JSON.stringify(templates));
}

export async function saveTemplate(data) {
  await connectMongo();
  if (data._id) {
    await EmailTemplate.findByIdAndUpdate(data._id, data);
  } else {
    await EmailTemplate.create(data);
  }
  revalidatePath('/email-templates');
  return { success: true };
}

export async function deleteTemplate(id) {
  await connectMongo();
  await EmailTemplate.findByIdAndDelete(id);
  revalidatePath('/email-templates');
  return { success: true };
}