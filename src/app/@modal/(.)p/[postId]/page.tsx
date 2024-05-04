import db from "@/lib/db";
import { ExtendedPost } from "@/types/db";
import PostModal from "../../_components/p/post-modal";
import { validateRequest } from "@/lib/auth/validate-request";

type PageProps = {
  params: {
    postId: string;
  };
};

export const dynamic = "force-dynamic";

export default async function Page({ params }: PageProps) {
  const { user } = await validateRequest();

  if (!user) return;

  const [postData]: ExtendedPost[] = await db.query.posts.findMany({
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
    where: (posts, { eq }) => eq(posts.id, params.postId),
    orderBy: (posts, { desc }) => desc(posts.createdAt),
  });

  return (
    <div>
      <PostModal post={postData} loggedInUser={user} />
    </div>
  );
}
