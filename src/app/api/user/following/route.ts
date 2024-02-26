import { validateRequest } from "@/lib/auth/validate-request";
import db from "@/lib/db";
import { followers } from "@/lib/db/schema";
import {
  ExtendedUser,
  UserFollowersPost,
  UserFollowersPostWithIsFollowing,
} from "@/types/db";
import { and, eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { user: userSession } = await validateRequest();

    if (!userSession) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return new Response("Username is missing", { status: 422 });
    }

    // List of current user following
    const alreadyFollowing = await db.query.followers.findMany({
      where: (followers, { eq }) => eq(followers.followingsId, userSession.id),
    });

    if (alreadyFollowing.length === 0) {
      return new Response(JSON.stringify([]));
    }

    // Contain the list of array ID of user current user already follow
    const currentUserFollowingsArray = alreadyFollowing.map(
      (following) => following.followersId
    );

    // User profile that we see (including our own profile)
    const userProfile = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.username, username),
    });

    if (!userProfile) {
      return new Response(JSON.stringify([]));
    }

    const followingOtherUser = await db.query.followers.findMany({
      where: (followers, { eq }) => eq(followers.followingsId, userProfile.id),
    });

    if (followingOtherUser.length === 0) {
      return new Response("You're not following anyone yet", { status: 200 });
    }

    const otherUserFollowingArray = followingOtherUser.map(
      (following) => following.followersId || ""
    );

    // List of user profile, the profile we see (including our own)
    const listOfUserProfile: UserFollowersPost[] =
      await db.query.users.findMany({
        with: {
          followers: true,
          followings: true,
          post: true,
        },
        where: (users, { inArray }) =>
          inArray(users.id, otherUserFollowingArray),
      });

    const withIsFollowing: UserFollowersPostWithIsFollowing[] =
      listOfUserProfile.map((user) => {
        const followed = currentUserFollowingsArray.includes(user.id);

        return {
          ...user,
          isFollowing: followed,
        };
      });

    return new Response(JSON.stringify(withIsFollowing));
  } catch (error) {
    return new Response("Failed to fetch following data", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new Response("User id is missing", { status: 422 });
    }

    const isFollowed = await db.query.followers.findFirst({
      where: (followers, { eq, and }) =>
        and(
          eq(followers.followersId, userId),
          eq(followers.followingsId, user.id)
        ),
    });

    if (!isFollowed) {
      await db
        .insert(followers)
        .values({ followingsId: user.id, followersId: userId });

      return new Response("User followed", { status: 201 });
    }

    await db
      .delete(followers)
      .where(
        and(
          eq(followers.followersId, userId),
          eq(followers.followingsId, user.id)
        )
      );

    return new Response("User un-followed", { status: 200 });
  } catch (error) {
    return new Response("Failed to modify user", { status: 500 });
  }
}
