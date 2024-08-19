"use server";

import { revalidatePath } from "next/cache";

import db from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { CreatePostPayload } from "@/lib/schema";
import { validateRequest } from "@/lib/auth/validate-request";

export async function createPost(values: CreatePostPayload) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      throw new Error("Unauthorized");
    }

    await db.insert(posts).values({
      ...values,
      userId: user.id,
    });

    revalidatePath("/");
    return { success: "Post created" };
  } catch (error) {
    return { error: "Failed to create post. Please try again later." };
  }
}
