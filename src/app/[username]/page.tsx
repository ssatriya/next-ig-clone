import db from "@/lib/db";
import { validateRequest } from "@/lib/auth/validate-request";
import ProfileTabs from "./_components/posts-tabs";

type ProfilePageProps = {
  params: {
    username: string;
  };
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return;

  const [userByUsername] = await db.query.users.findMany({
    with: {
      followers: true,
      followings: true,
    },
    where: (users, { eq }) => eq(users.username, params.username),
  });

  const userPosts = await db.query.posts.findMany({
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
    where: (posts, { eq }) => eq(posts.userId, userByUsername.id),
    orderBy: (posts, { desc }) => desc(posts.createdAt),
  });

  return (
    <ProfileTabs
      loggedInUser={loggedInUser}
      userByUsername={userByUsername}
      userPosts={userPosts}
    />
  );
}
