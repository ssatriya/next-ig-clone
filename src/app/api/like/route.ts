import { z } from "zod";
import { and, eq } from "drizzle-orm";

import db from "@/lib/db";
import { likes } from "@/lib/db/schema";
import { CreateLikeSchema } from "@/lib/schema";
import { validateRequest } from "@/lib/auth/validate-request";
import { LikeWithUser } from "@/types/db";

export async function POST(req: Request) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const validatedFields = CreateLikeSchema.safeParse(body);

    if (!validatedFields.success) {
      return new Response("Invalid input", { status: 422 });
    }

    const { postId } = validatedFields.data;

    const isLiked = await db.query.likes.findFirst({
      where: (likes, { eq, and }) =>
        and(eq(likes.postId, postId), eq(likes.userId, user.id)),
    });

    if (!isLiked) {
      await db.insert(likes).values({ postId, userId: user.id });

      return new Response("Post liked", { status: 201 });
    }

    await db
      .delete(likes)
      .where(and(eq(likes.postId, postId), eq(likes.userId, user.id)));

    return new Response("Post like deleted", { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new Response(
      "Could not create a like at this time, please try again later.",
      {
        status: 500,
      }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return new Response("Post ID is missing", { status: 404 });
    }

    const likes: LikeWithUser[] = await db.query.likes.findMany({
      with: {
        user: true,
      },
      where: (likes, { eq }) => eq(likes.postId, postId),
    });

    return new Response(JSON.stringify(likes));
  } catch (error) {
    return new Response("Could not fetch likes", { status: 500 });
  }
}
