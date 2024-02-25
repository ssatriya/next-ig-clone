import { z } from "zod";

import db from "@/lib/db";
import { comments } from "@/lib/db/schema";
import { CreateCommentSchema } from "@/lib/schema";
import { validateRequest } from "@/lib/auth/validate-request";

export async function GET(req: Request) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return new Response("Unauthorize", { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const postId = searchParams.get("postId");

    if (!postId) {
      return new Response("Post ID is missing", { status: 404 });
    }

    const comments = await db.query.comments.findMany({
      with: {
        user: {
          with: {
            post: true,
            followers: true,
            followings: true,
          },
        },
      },
      where: (comments, { eq }) => eq(comments.postId, postId),
      orderBy: (comments, { desc }) => desc(comments.createdAt),
    });

    return Response.json({ comments });
  } catch (error) {
    return new Response("Failed to fetch comments", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return new Response("Unauthorize", { status: 401 });
    }

    const body = await req.json();

    const validatedFields = CreateCommentSchema.safeParse(body);

    if (!validatedFields.success) {
      return new Response("Invalid input", { status: 422 });
    }

    const {
      data: { comment, postId, userId },
    } = validatedFields;

    await db.insert(comments).values({
      comment: comment,
      postId: postId,
      userId: userId,
    });

    return new Response("Comment created", { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new Response(
      "Could not create a comment at this time, please try again later.",
      {
        status: 500,
      }
    );
  }
}
