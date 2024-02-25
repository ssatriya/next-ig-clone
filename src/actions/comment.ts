"use server";

import { validateRequest } from "@/lib/auth/validate-request";
import db from "@/lib/db";
import { comments } from "@/lib/db/schema";
import { CreateCommentPayload } from "@/lib/schema";
import { revalidatePath } from "next/cache";

export async function createComment(
  values: CreateCommentPayload,
  postId: string
) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return { error: "Unauthorized" };
    }

    const data = await db.insert(comments).values({
      comment: values.comment,
      postId: values.postId,
      userId: values.userId,
    });

    revalidatePath(`/p/${postId}`);
    return { success: "Comment created" };
  } catch (error) {
    return { error: "Comment failed" };
  }
}
