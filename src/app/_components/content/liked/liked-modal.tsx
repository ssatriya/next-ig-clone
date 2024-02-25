"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { XIcon } from "lucide-react";
import UserItem from "./user-item";
import { Dispatch, SetStateAction } from "react";
import { LikeWithUserAndFollowersWithIsFollowing } from "@/types/db";
import { useCurrentSession } from "@/components/provider/session-provider";
import UserItemSkeleton from "./user-item-skeleton";
import { useQuery } from "@tanstack/react-query";

const LikedModal = ({
  open,
  setOpenLikedModal,
  postId,
}: {
  open: boolean;
  setOpenLikedModal: Dispatch<SetStateAction<boolean>>;
  postId: string;
}) => {
  const {
    session: { user: userSession },
  } = useCurrentSession();

  const { data: likedUserData, isLoading } = useQuery({
    queryKey: ["getLikedUsers"],
    queryFn: async () => {
      const req = await fetch(`/api/user/followers/?postId=${postId}`);
      const likedUser = await req.json();

      return likedUser as LikeWithUserAndFollowersWithIsFollowing[];
    },
    enabled: open,
  });

  return (
    <Dialog
      defaultOpen
      open={open}
      onOpenChange={() => setOpenLikedModal(false)}
    >
      <DialogContent
        onInteractOutside={() => setOpenLikedModal(false)}
        className="w-[400px] border-none dark:bg-igSeparator bg-background p-0 sm:rounded-xl gap-0"
      >
        <div className="flex w-full h-[43px] items-center justify-between border-b-[1px] dark:border-igElevatedSeparatorV2 border-igElevatedSeparator">
          <div className="h-[43] w-[48px] block bg-transparent"></div>
          <span className="font-bold">Likes</span>
          <Button
            onClick={() => setOpenLikedModal(false)}
            variant="text"
            size="icon"
            className="h-[43] w-[48px]"
          >
            <XIcon />
          </Button>
        </div>
        <div className="my-2 overflow-y-auto max-h-[400px]">
          {isLoading && (
            <>
              <UserItemSkeleton />
              <UserItemSkeleton />
              <UserItemSkeleton />
            </>
          )}
          {!isLoading &&
            likedUserData &&
            likedUserData.map((like) => (
              <UserItem key={like.id} like={like} userSession={userSession} />
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default LikedModal;
