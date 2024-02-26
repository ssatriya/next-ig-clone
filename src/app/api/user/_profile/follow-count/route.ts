import db from "@/lib/db";
import { validateRequest } from "@/lib/auth/validate-request";
import { ExtendedUser } from "@/types/db";

export async function GET(req: Request) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const followType = searchParams.get("type");
    const username = searchParams.get("username");

    if (!followType) {
      return new Response("Follow type is missing", { status: 422 });
    }
    if (!username) {
      return new Response("Username is missing", { status: 422 });
    }

    const followData: ExtendedUser | undefined = await db.query.users.findFirst(
      {
        with: {
          followers: true,
          followings: true,
        },
        where: (users, { eq }) => eq(users.username, username),
      }
    );

    if (followType === "followers") {
      const followersArray = followData?.followers.map(
        (user) => user.followingsId || ""
      );

      if (followersArray) {
        const userProfile = await db.query.users.findMany({
          with: {
            followers: true,
            followings: true,
            post: true,
          },
          where: (users, { inArray }) => inArray(users.id, followersArray),
        });
        return new Response(JSON.stringify(userProfile));
      }
    } else {
      const followingArray = followData?.followings.map(
        (user) => user.followersId || ""
      );

      if (followingArray) {
        const userProfile = await db.query.users.findMany({
          with: {
            followers: true,
            followings: true,
            post: true,
          },
          where: (users, { inArray }) => inArray(users.id, followingArray),
        });
        return new Response(JSON.stringify(userProfile));
      }
    }
  } catch (error) {
    return new Response("Failed to fetch user profile", { status: 500 });
  }
}
