import db from "@/lib/db";
import { ExtendedPost } from "@/types/db";
import Feed from "./_components/content/feed";
import { User } from "lucia";
import { comments, followers, posts, users } from "@/lib/db/schema";
import { and, count, desc, eq, inArray, or, sql } from "drizzle-orm";
import Temp from "@/components/temp";

async function getPosts(userId: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // I'am following this user
  // So I query using my id and get the followersId
  // as a person that I follow
  const followings = await db.query.followers.findMany({
    where: (followers, { eq }) => eq(followers.followingsId, userId),
  });
  const followingsArray = followings.map((user) => user.followersId || userId);
  const followingsSet = new Set([...followingsArray, userId]);

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
    limit: 10,
  });

  return postsData;
}

type FeedWrapperProps = {
  user: User;
};

export default async function FeedWrapper({ user }: FeedWrapperProps) {
  const postsData = await getPosts(user.id);

  return <Feed posts={postsData} />;
}
