import { and, eq } from "drizzle-orm";

import db from "@/lib/db";
import { followers } from "@/lib/db/schema";
import { validateRequest } from "@/lib/auth/validate-request";

export async function PUT(req: Request) {
  try {
    const { user: userSession } = await validateRequest();

    if (!userSession) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const targetId = searchParams.get("targetId") as string;

    const isFollowed = await db.query.followers.findFirst({
      where: (followers, { eq, and }) =>
        and(
          eq(followers.followersId, targetId),
          eq(followers.followingsId, userSession.id)
        ),
    });

    if (!isFollowed) {
      await db
        .insert(followers)
        .values({ followingsId: userSession.id, followersId: targetId });

      return new Response("User followed", { status: 201 });
    }

    await db
      .delete(followers)
      .where(
        and(
          eq(followers.followersId, targetId),
          eq(followers.followingsId, userSession.id)
        )
      );

    // return { success: "User un-followed" };

    return new Response("User un-followed", { status: 201 });
  } catch (error) {
    console.log(error);
  }
}
