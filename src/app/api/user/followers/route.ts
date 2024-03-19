import LikedByPage from "@/app/p/[postId]/liked_by/page";
import { validateRequest } from "@/lib/auth/validate-request";
import db from "@/lib/db";
import {
  LikeWithUserAndFollowers,
  LikeWithUserAndFollowersWithIsFollowing,
} from "@/types/db";

export async function GET(req: Request) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return new Response("Post ID is missing", { status: 422 });
    }

    const alreadyFollowing = await db.query.users.findFirst({
      with: {
        followings: true,
        followers: true,
      },
      where: (users, { eq }) => eq(users.id, user.id),
    });

    const followingsArray = alreadyFollowing?.followings.map(
      (user) => user.followersId
    );

    const likedUser: LikeWithUserAndFollowers[] = await db.query.likes.findMany(
      {
        with: {
          user: {
            with: {
              followers: true,
              followings: true,
            },
          },
          post: true,
        },
        where: (likes, { eq, and, ne }) =>
          and(eq(likes.postId, postId), ne(likes.userId, user.id)),
      }
    );

    const followingsSet = new Set(followingsArray);

    const withIsFollowing: LikeWithUserAndFollowersWithIsFollowing[] =
      likedUser.map((user) => {
        const followed = followingsArray
          ? followingsSet.has(user.userId)
          : false;

        return {
          ...user,
          isFollowing: followed,
        };
      });

    return new Response(JSON.stringify(withIsFollowing));
  } catch (error) {
    return new Response("Failed to fetch liked user", { status: 500 });
  }
}
