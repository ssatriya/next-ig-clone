import { validateRequest } from "@/lib/auth/validate-request";
import db from "@/lib/db";
import { ExtendedPost } from "@/types/db";

export async function GET(req: Request) {
  try {
    const { user: userSession } = await validateRequest();

    if (!userSession) {
      return new Response("Unauthorize", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page")!;
    const limit = searchParams.get("limit")!;

    // I'am following this user
    // So I query using my id and get the followersId
    // as a person that I follow
    const followings = await db.query.followers.findMany({
      where: (followers, { eq }) => eq(followers.followingsId, userSession.id),
    });
    const followingsArray = followings.map(
      (user) => user.followersId || userSession.id
    );
    const followingsSet = new Set([...followingsArray, userSession.id]);

    const postsData: ExtendedPost[] = await db.query.posts.findMany({
      with: {
        user: {
          with: {
            followers: true,
            followings: true,
          },
        },
        comment: true,
        like: {
          with: {
            user: true,
          },
        },
      },
      where: (posts, { inArray }) =>
        inArray(posts.userId, Array.from(followingsSet)),
      orderBy: (posts, { desc }) => desc(posts.createdAt),
      offset: (parseInt(page) - 1) * parseInt(limit),
      limit: parseInt(limit),
    });

    return new Response(JSON.stringify(postsData));
  } catch (error) {
    return new Response("Could not fetch posts", {
      status: 500,
    });
  }
}
