"use server";

import { and, eq } from "drizzle-orm";

import db from "@/lib/db";
import { followers } from "@/lib/db/schema";
import { validateRequest } from "@/lib/auth/validate-request";
import { revalidatePath } from "next/cache";

export async function follow(targetId: string) {
  const { user } = await validateRequest();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const isFollowed = await db.query.followers.findFirst({
    where: (followers, { eq, and }) =>
      and(
        eq(followers.followersId, targetId),
        eq(followers.followingsId, user.id)
      ),
  });

  if (!isFollowed) {
    await db
      .insert(followers)
      .values({ followingsId: user.id, followersId: targetId });

    revalidatePath(`/${user.username}`);
    return { success: "User followed" };
  }

  await db
    .delete(followers)
    .where(
      and(
        eq(followers.followersId, targetId),
        eq(followers.followingsId, user.id)
      )
    );

  revalidatePath(`/${user.username}`);
  return { success: "User un-followed" };
}
