"use client";

"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { XIcon } from "lucide-react";
import UserItem from "@/app/_components/content/liked/user-item";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useTransition,
} from "react";
import { UserLikedPost } from "@/types/db";
import { useCurrentSession } from "@/components/provider/session-provider";
import UserItemSkeleton from "@/app/_components/content/liked/user-item-skeleton";

const FollowersModal = ({
  open,
  setOpenFollowersModal,
}: {
  open: boolean;
  setOpenFollowersModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    session: { user: userSession },
  } = useCurrentSession();
  const [_, startTransition] = useTransition();
  const [likedList, setLikedList] = useState<UserLikedPost[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (open) {
      startTransition(() => {});
    }
  }, [open]);

  return (
    <Dialog
      defaultOpen
      open={open}
      onOpenChange={() => setOpenFollowersModal(false)}
    >
      <DialogContent
        onInteractOutside={() => setOpenFollowersModal(false)}
        className="w-[400px] border-none dark:bg-igSeparator bg-background p-0 sm:rounded-xl gap-0"
      >
        <div className="flex w-full h-[43px] items-center justify-between border-b-[1px] dark:border-igElevatedSeparatorV2 border-igElevatedSeparator">
          <div className="h-[43] w-[48px] block bg-transparent"></div>
          <span className="font-bold">Followers</span>
          <Button
            onClick={() => setOpenFollowersModal(false)}
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
          {/* {!isLoading &&
            likedList &&
            likedList.map((like) => (
              <UserItem key={like.id} like={like} userSession={userSession} />
            ))} */}
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default FollowersModal;
