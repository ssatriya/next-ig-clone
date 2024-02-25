"use server";

import { revalidatePath } from "next/cache";

import db from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { CreatePostPayload } from "@/lib/schema";
import { validateRequest } from "@/lib/auth/validate-request";

export async function createPost(values: CreatePostPayload) {
  const { user } = await validateRequest();

  if (!user) {
    return { error: "Unauthorized" };
  }

  await db.insert(posts).values({
    ...values,
    userId: user.id,
  });

  revalidatePath("/");
  return { success: "Post created" };
}
