import FollowersModal from "../../_components/username/followers-modal";

type FollowersModalPageProps = {
  params: {
    username: string;
  };
};

export default function FollowersModalPage({
  params,
}: FollowersModalPageProps) {
  return <FollowersModal username={params.username} />;
}
