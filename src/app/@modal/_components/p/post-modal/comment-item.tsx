"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";

import { cn, formatReadableDate, formatTimeToNow } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { ExtendedComment } from "@/types/db";
import { Button } from "@/components/ui/button";
import CommentUserTooltip from "@/components/comment-user-tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type CommentItemProps = {
  comment: ExtendedComment;
};

const CommentItem = ({ comment }: CommentItemProps) => {
  const { theme } = useTheme();

  const stories = false;
  const createdAt = new Date(comment.createdAt);
  return (
    <div className="mt-4">
      <div className="flex justify-between items-center w-full h-fit">
        <div className="flex items-center gap-3">
          <CommentUserTooltip comment={comment} userId={comment.userId}>
            <Link
              href={`/${comment.user.username}`}
              className={cn(
                "h-[42px] w-[42px] flex items-center justify-center p-3 rounded-full",
                stories
                  ? "bg-gradient-to-br from-yellow-400 to-pink-500"
                  : "bg-transparent"
              )}
            >
              <Avatar
                className={cn(
                  "h-[38px] w-[38px] border-[3px] flex items-center justify-center",
                  theme === "light" ? "border-white" : "border-black"
                )}
              >
                <AvatarImage src={comment.user.image || ""} asChild>
                  <Image
                    src={comment.user.image || ""}
                    width={42}
                    height={42}
                    alt="avatar"
                  />
                </AvatarImage>
                <AvatarFallback>ss</AvatarFallback>
              </Avatar>
            </Link>
          </CommentUserTooltip>
          <div className="flex flex-col gap-1">
            <div className="text-sm inline-flex gap-1">
              <CommentUserTooltip comment={comment} userId={comment.userId}>
                <Link
                  href={`/${comment.user.username}`}
                  className="text-sm font-semibold"
                >
                  {comment.user.username}
                </Link>
              </CommentUserTooltip>
              {comment.comment && (
                <p dangerouslySetInnerHTML={{ __html: comment.comment }} />
              )}
            </div>
            <div className="flex gap-4">
              <time
                dateTime={createdAt.toISOString()}
                title={formatReadableDate(createdAt)}
                className="text-igSecondaryText text-xs font-medium cursor-default"
              >
                {formatTimeToNow(createdAt)}
              </time>
              <span className="text-igSecondaryText text-xs font-medium cursor-default">
                128 likes
              </span>
              <Button
                variant="text"
                className="text-igSecondaryText text-xs font-medium h-fit w-fit p-0"
              >
                Reply
              </Button>
            </div>
          </div>
        </div>
        <Button
          size="icon"
          className="p-2 h-10 w-10 bg-transparent hover:bg-transparent group"
        >
          <Icons.likeSmall className="fill-primary group-hover:fill-igSecondaryText" />
        </Button>
      </div>
    </div>
  );
};
export default CommentItem;
