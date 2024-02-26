import FollowingModal from "@/app/@modal/_components/username/following-modal";
import { validateRequest } from "@/lib/auth/validate-request";

type FollowingPageProps = {
  params: {
    username: string;
  };
};

export default async function FollowingPage({ params }: FollowingPageProps) {
  const { user } = await validateRequest();

  if (!user) return null;

  const reload = true;

  // return <FollowingModal username={params.username} loggedInUserId={user.id} />;
  return <span>WIP</span>;
}
