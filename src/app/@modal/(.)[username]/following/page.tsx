import { validateRequest } from "@/lib/auth/validate-request";
import FollowingModal from "../../_components/username/following-modal";

type FollowingModalPageProps = {
  params: {
    username: string;
  };
};

export default async function FollowingModalPage({
  params,
}: FollowingModalPageProps) {
  const { user } = await validateRequest();

  if (!user) return null;

  return <FollowingModal username={params.username} loggedInUserId={user.id} />;
}
