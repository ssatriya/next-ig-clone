import FollowingModal from "../../_components/username/following-modal";

type FollowingModalPageProps = {
  params: {
    username: string;
  };
};

export default function FollowingModalPage({
  params,
}: FollowingModalPageProps) {
  return <FollowingModal username={params.username} />;
}
