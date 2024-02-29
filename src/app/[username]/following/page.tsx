import db from "@/lib/db";
import PostsTabs from "../_components/posts-tabs";
import { validateRequest } from "@/lib/auth/validate-request";
import FollowingModal from "@/app/@modal/_components/username/following-modal";

type FollowingPageProps = {
  params: {
    username: string;
  };
};

export default async function FollowingPage({ params }: FollowingPageProps) {
  const { user: loggedInUser } = await validateRequest();
  const reload = true;
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
    <div>
      <PostsTabs
        loggedInUser={loggedInUser}
        userByUsername={userByUsername}
        userPosts={userPosts}
      />
      <FollowingModal
        username={params.username}
        loggedInUserId={loggedInUser.id}
        reload={reload}
      />
    </div>
  );
}
