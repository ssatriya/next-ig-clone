import db from "@/lib/db";
import { validateRequest } from "@/lib/auth/validate-request";
import ProfileInfo from "./_components/profile-info";
import ProfileHightlight from "./_components/profile-hightlight";
import ProfileFooter from "./_components/profile-footer";
import TabsWrapper from "./_components/tabs-wrapper";

type MetadataProps = {
  params: {
    username: string;
  };
};

export async function generateMetadata({ params }: MetadataProps) {
  const { user } = await validateRequest();

  const userByUsername = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.username, params.username),
  });

  if (userByUsername?.id === user?.id) {
    return {
      title: `${userByUsername?.name} (@${userByUsername?.username}) • Instagram photos and videos`,
    };
  }

  return {
    title: `@${userByUsername?.username} • Instagram photos and videos`,
  };
}

export default async function ProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { username: string };
}) {
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
    <div className="w-[975px] pt-[30px] px-5 mt-2 space-y-14 min-h-screen">
      <ProfileInfo
        userPosts={userPosts}
        userByUsername={userByUsername}
        loggedInUser={loggedInUser}
      />
      <ProfileHightlight
        userByUsername={userByUsername}
        loggedInUser={loggedInUser}
      />
      <TabsWrapper userByUsername={userByUsername}>{children}</TabsWrapper>
      <div className="relative">
        <ProfileFooter />
      </div>
    </div>
  );
}
