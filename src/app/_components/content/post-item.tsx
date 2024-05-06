"use client";

import Link from "next/link";
import { useToggle } from "ahooks";
import Image from "next/image";
import { useTheme } from "next-themes";
import useMeasure from "react-use-measure";
import { useState, useEffect } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useWindowScroll } from "@mantine/hooks";
import { Swiper, SwiperSlide } from "swiper/react";
import Placeholder from "@tiptap/extension-placeholder";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper/modules";

import { ExtendedPost } from "@/types/db";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CommentEditor from "@/components/comment-editor";
import PostUserTooltip from "@/components/post-user-tooltip";
import { cn, formatReadableDate, formatTimeToNow } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentSession } from "@/components/provider/session-provider";
import { useScrollHistory } from "@/hooks/use-scroll-history";
import LikeButton from "./button/like-button";
import LikedModal from "./liked/liked-modal";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

type PostItemProps = {
  post: ExtendedPost;
};

const PostItem = ({ post }: PostItemProps) => {
  const [scroll] = useWindowScroll();
  const [ref, bounds] = useMeasure();
  const [usernameRef, usernameBounds] = useMeasure();
  const [openLikedModal, setOpenLikedModal] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const queryClient = useQueryClient();
  const {
    session: { user },
  } = useCurrentSession();
  const { setFromTop } = useScrollHistory((state) => state);
  const [captionOpen, { toggle: toggleCaptionOpen }] = useToggle();
  const [isMounted, setIsMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const images: string[] = post.images!.split(",");

  const stories = false;

  const createdAt = new Date(post.createdAt);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const editor = useEditor({
    onCreate() {
      setIsLoading(false);
    },
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Add a comment...",
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "text-primary text-sm leading-[18px] focus-visible:ring-none focus-visible:outline-none placeholder:text-primary min-h-[100%] min-w-[100%]",
      },
    },
  });

  const onSelect = (data: string) => {
    if (!editor) {
      return;
    }
    editor.chain().focus().insertContent(data).run();
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["createComment"],
    mutationFn: async () => {
      if (!editor || !user) return;
      const res = await fetch("/api/comment", {
        method: "POST",
        body: JSON.stringify({
          comment: editor.getHTML(),
          postId: post.id,
          userId: user.id,
        }),
      });

      return res;
    },
    onError: () => {},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedQuery"] });
      editor?.commands.clearContent();
    },
  });

  const handleComment = () => {
    mutate();
  };

  const ratio = post!.aspectRatio.split("/");
  const ratioX = Number(ratio[0]);
  const ratioY = Number(ratio[1]);

  const height = (ratioY / ratioX) * 468;

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <div className="w-[470px] flex flex-col justify-center pt-5 mb-4">
        <div className="flex items-center justify-between w-full mb-3">
          <div className="flex gap-2 items-center">
            <PostUserTooltip post={post} userId={post.userId}>
              <Link
                href={`/${post.user.username}`}
                onClick={() => setFromTop(scroll.y)}
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
                  <AvatarImage src={post.user.image || ""} asChild>
                    <Image
                      src={post.user.image || ""}
                      priority
                      width={42}
                      height={42}
                      alt={`${post.user.username} avatar`}
                    />
                  </AvatarImage>
                  <AvatarFallback>ss</AvatarFallback>
                </Avatar>
              </Link>
            </PostUserTooltip>
            <div className="flex items-end gap-1">
              <PostUserTooltip post={post} userId={post.userId}>
                <Link
                  onClick={() => setFromTop(scroll.y)}
                  href={`/${post.user.username}`}
                  className="text-sm font-semibold"
                >
                  {post.user.username}
                </Link>
              </PostUserTooltip>
              <span className="scale-75 text-igSecondaryText">•</span>
              <time
                dateTime={createdAt.toISOString()}
                title={formatReadableDate(createdAt)}
                className="text-igSecondaryText text-sm font-medium cursor-pointer"
              >
                {formatTimeToNow(createdAt)}
              </time>
            </div>
          </div>
          <Button
            size="icon"
            className="p-0 h-6 w-6 bg-transparent hover:bg-transparent group"
          >
            <Icons.moreCircle className="fill-primary group-hover:fill-igSecondaryText" />
          </Button>
        </div>
        <div
          className="relative w-[470px] flex justify-center items-center rounded-sm border-[1px]"
          style={{ height: height + 2 }}
        >
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={50}
            slidesPerView={1}
            navigation
            draggable={false}
            noSwiping={true}
            pagination={{ clickable: true }}
            className="rounded-sm"
          >
            {images.map((image, index) => (
              <SwiperSlide key={image + index}>
                <Image
                  src={image}
                  height={468}
                  width={468}
                  priority
                  alt="Post Image"
                  className={cn(
                    "w-auto h-auto",
                    imageLoading ? "hidden" : "block"
                  )}
                  onLoad={() => setImageLoading(false)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          {imageLoading && (
            <Skeleton style={{ height }} className="w-full rounded-sm" />
          )}
        </div>
        <div className="flex justify-between items-center w-full mt-1">
          <div className="flex -ml-2">
            {user && <LikeButton post={post} loggedInUserId={user.id} />}
            <Link href={`/p/${post.id}`}>
              <Button
                size="icon"
                className="p-2 h-10 w-10 bg-transparent hover:bg-transparent group"
                onClick={() => setFromTop(scroll.y)}
              >
                <Icons.comment className="stroke-primary group-hover:stroke-igSecondaryText" />
              </Button>
            </Link>
            <Button
              size="icon"
              className="p-2 h-10 w-10 bg-transparent hover:bg-transparent group"
            >
              <Icons.share className="stroke-primary group-hover:stroke-igSecondaryText" />
            </Button>
          </div>
          <Button
            size="icon"
            className="p-0 h-fit w-fit bg-transparent hover:bg-transparent group"
            aria-label="Save"
          >
            <Icons.save className="stroke-primary group-hover:stroke-igSecondaryText" />
          </Button>
        </div>
        <div className="flex flex-col gap-2 mt-1">
          {post.like.length > 0 && (
            <p className="text-sm">
              Liked by{" "}
              <Link href={`/${post.like[0].user?.username}`}>
                <span className="font-semibold">
                  {post.like[0].user?.username}
                </span>{" "}
              </Link>
              {post.like.length > 1 && (
                <span>
                  and{" "}
                  <a
                    href={`/p/${post.id}/liked_by`}
                    target="_blank"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenLikedModal(true);
                    }}
                    role="link"
                    tabIndex={0}
                    className="w-fit h-fit p-0 hover:no-underline"
                  >
                    <span className="font-semibold">others</span>
                  </a>
                </span>
              )}
            </p>
          )}
          {openLikedModal && (
            <LikedModal
              open={openLikedModal}
              setOpenLikedModal={setOpenLikedModal}
              postId={post.id}
            />
          )}
          <div className="flex flex-col gap-2">
            <div className="relative text-sm inline-flex gap-2 h-full w-auto">
              <span ref={usernameRef} className="font-bold h-fit absolute">
                <Link
                  onClick={() => setFromTop(scroll.y)}
                  href={`/${post.user.username}`}
                >
                  {post.user.username}
                </Link>
              </span>
              <div
                className={cn(
                  "w-full",
                  captionOpen
                    ? "h-auto overflow-hidden"
                    : "max-h-10 overflow-clip"
                )}
              >
                {post.caption && (
                  <p
                    dangerouslySetInnerHTML={{
                      __html: post.caption,
                    }}
                    ref={ref}
                    style={{
                      textIndent: `calc(${usernameBounds.width + 6}px)`,
                    }}
                  />
                )}
              </div>
            </div>
            {bounds.height > 40 && !captionOpen && (
              <Button
                onClick={() => toggleCaptionOpen()}
                className="flex justify-start p-0 h-[18px] text-igSecondaryText hover:no-underline w-fit"
                size="sm"
                variant="link"
              >
                more
              </Button>
            )}
            {post.comment.length > 0 && (
              <Link href={`/p/${post.id}`}>
                <Button
                  className="flex justify-start p-0 h-[18px] text-igSecondaryText hover:no-underline w-fit"
                  size="sm"
                  variant="link"
                >
                  View all {post.comment.length} comments
                </Button>
              </Link>
            )}
            <CommentEditor
              isPending={isPending}
              editor={editor}
              isLoading={isLoading}
              onSelect={onSelect}
              handleComment={handleComment}
            />
          </div>
        </div>
      </div>
      <Separator className="bg-border w-[470px]" />
    </>
  );
};
export default PostItem;
