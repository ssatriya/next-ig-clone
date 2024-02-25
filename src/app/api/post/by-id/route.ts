import { validateRequest } from "@/lib/auth/validate-request";
import db from "@/lib/db";

export async function GET(req: Request) {
  const { user } = await validateRequest();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("id");

  if (!userId) {
    return new Response("User not found", { status: 401 });
  }

  const dbPosts = await db.query.posts.findMany({
    with: {
      user: true,
    },
    where: (posts, { eq }) => eq(posts.userId, userId),
  });

  return Response.json({ posts: dbPosts });
}
