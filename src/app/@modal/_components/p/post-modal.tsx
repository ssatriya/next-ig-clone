"use client";

import { useRouter } from "next/navigation";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CommentEditor from "./post-modal/comment-editor";
import Container from "./post-modal/container";
import { Icons } from "@/components/icons";
import useMeasure from "react-use-measure";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentSession } from "@/components/provider/session-provider";
import { useTheme } from "next-themes";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { cn, formatReadableDate, formatTimeToNow } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PostUserTooltip from "@/components/post-user-tooltip";
import { ExtendedComment, ExtendedPost, LikeWithUser } from "@/types/db";
import CommentItem from "./post-modal/comment-item";
import CommentSkeleton from "./post-modal/comment-skeleton";
import LikedModal from "@/app/_components/content/liked/liked-modal";
import LikeButton from "@/app/_components/content/button/like-button";
import { User } from "lucia";

type PostModalProps = {
  post: ExtendedPost;
  loggedInUser: User;
};

export default function PostModal({ post, loggedInUser }: PostModalProps) {
  const router = useRouter();
  const [usernameRef, usernameBounds] = useMeasure();
  const [caption, setCaption] = useState<string>();
  const [openLikedModal, setOpenLikedModal] = useState(false);
  const queryClient = useQueryClient();
  const {
    session: { user },
  } = useCurrentSession();
  const { theme } = useTheme();
  const editor = useEditor({
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

  const images = post.images.split(",");
  const stories = true;
  const createdAt = new Date(post.createdAt);

  const onDismiss = () => {
    router.back();
  };

  const { data: commentsQuery, isLoading } = useQuery({
    queryKey: ["getComments", post.id],
    queryFn: async () => {
      const res = await fetch(`/api/comment?postId=${post.id}`);
      const { comments } = await res.json();

      return comments as ExtendedComment[];
    },
  });

  const { data: likesData } = useQuery({
    queryKey: ["getLikes"],
    queryFn: async () => {
      const res = await fetch(`/api/like?postId=${post.id}`);
      const data = await res.json();

      return data as LikeWithUser[];
    },
    initialData: post.like,
  });

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
    onError: (error) => {},
    onSuccess: () => {
      editor?.commands.clearContent();
      queryClient.invalidateQueries({ queryKey: ["getComments"] });
      queryClient.invalidateQueries({ queryKey: ["feedQuery"] });
    },
  });

  const handleComment = () => {
    mutate();
  };

  const ratio = post.aspectRatio.split(",");
  const ratioX = ratio[0];
  const ratioY = ratio[1];
  const fitWidth = 866 * (Number(ratioX) / Number(ratioY));

  return (
    <Dialog defaultOpen>
      <DialogContent
        className="flex justify-center border-none sm:rounded-r-sm lg:max-h-[866px] mx-auto p-0 gap-0"
        onInteractOutside={onDismiss}
      >
        <div
          style={{ width: fitWidth }}
          className="h-[866px] flex justify-center items-center dark:bg-black bg-zinc-200"
        >
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={50}
            slidesPerView={1}
            navigation
            draggable={false}
            noSwiping={true}
            pagination={{ clickable: true }}
            // onSlideChange={(swiper) => setCurrentImage(swiper.activeIndex)}
            className="h-[866px] w-[692.8px]"
            style={{ width: fitWidth }}
          >
            {images?.map((image, index) => (
              <SwiperSlide key={image + index}>
                <Image
                  src={image}
                  priority
                  fill
                  alt="Post Image"
                  style={{ objectFit: "contain" }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="flex flex-col border-l dark:border-l-igSeparator border-l-igElevatedSeparator">
          <Container className="w-[514px] border-b dark:border-b-igSeparator border-b-igElevatedSeparator">
            <div className="flex justify-between items-center w-full h-fit">
              <div className="flex items-center gap-3">
                {/* <PostUserTooltip post={post} userId={post.userId}> */}
                <Link
                  href={`/${post.user.username}`}
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
                        width={42}
                        height={42}
                        alt="avatar"
                      />
                    </AvatarImage>
                    <AvatarFallback>ss</AvatarFallback>
                  </Avatar>
                </Link>
                {/* </PostUserTooltip> */}
                {/* <PostUserTooltip post={post} userId={post.userId}> */}
                <Link
                  href={`/${post.user.username}`}
                  className="text-sm font-semibold"
                >
                  {post.user.username}
                </Link>
                {/* </PostUserTooltip> */}
              </div>
              <Button
                size="icon"
                className="p-2 h-10 w-10 bg-transparent hover:bg-transparent group"
              >
                <Icons.moreCircle className="fill-primary group-hover:fill-igSecondaryText" />
              </Button>
            </div>
          </Container>
          <Container className="pb-0 pt-1">
            <div className="w-full h-[626px] overflow-y-auto">
              <div className="flex items-start gap-3">
                <PostUserTooltip post={post} userId={post.userId}>
                  <Link
                    href={`/${post.user.username}`}
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
                          width={42}
                          height={42}
                          alt="avatar"
                        />
                      </AvatarImage>
                      <AvatarFallback>ss</AvatarFallback>
                    </Avatar>
                  </Link>
                </PostUserTooltip>
                <div className="flex flex-col gap-1">
                  <div className="text-sm inline-flex gap-1 relative">
                    <span className="font-bold absolute" ref={usernameRef}>
                      {post.user.username}
                    </span>
                    {post.caption && (
                      <p
                        dangerouslySetInnerHTML={{ __html: post.caption }}
                        style={{
                          textIndent: `calc(${usernameBounds.width + 6}px)`,
                        }}
                      />
                    )}
                  </div>
                  <time
                    dateTime={createdAt.toISOString()}
                    title={formatReadableDate(createdAt)}
                    className="text-igSecondaryText text-xs font-medium cursor-default"
                  >
                    {formatTimeToNow(createdAt)}
                  </time>
                </div>
              </div>
              {isLoading && (
                <>
                  <CommentSkeleton />
                  <CommentSkeleton />
                  <CommentSkeleton />
                  <CommentSkeleton />
                  <CommentSkeleton />
                </>
              )}
              {!isLoading &&
                commentsQuery &&
                commentsQuery.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
            </div>
          </Container>
          <div className="relative mt-1 border-t dark:border-t-igSeparator border-t-igElevatedSeparator w-full bg-background h-fit sm:rounded-br-sm">
            <div className="absolute inset-0">
              <Container>
                <div className="flex justify-between items-center w-full">
                  <div className="flex -ml-2">
                    <LikeButton loggedInUserId={loggedInUser.id} post={post} />
                    <Button
                      onClick={() => editor?.commands.focus()}
                      size="icon"
                      className="p-2 h-10 w-10 bg-transparent hover:bg-transparent group"
                    >
                      <Icons.comment className="stroke-primary group-hover:stroke-igSecondaryText" />
                    </Button>
                    <Button
                      size="icon"
                      className="p-2 h-10 w-10 bg-transparent hover:bg-transparent group"
                    >
                      <Icons.share className="stroke-primary group-hover:stroke-igSecondaryText" />
                    </Button>
                  </div>
                  <Button
                    size="icon"
                    className="p-2 h-10 w-10 bg-transparent hover:bg-transparent group"
                    aria-label="Save"
                  >
                    <Icons.save className="stroke-primary group-hover:stroke-igSecondaryText" />
                  </Button>
                </div>
              </Container>
              <Container className="pt-0">
                {likesData.length > 0 && (
                  <p className="text-sm">
                    Liked by{" "}
                    {/* <Link href={`/${likesData[0].user?.username}`}> */}
                    <span className="font-semibold">
                      {likesData[0].user?.username}
                    </span>{" "}
                    {/* </Link> */}
                    {likesData.length > 1 && (
                      <span>
                        and{" "}
                        <a
                          href={`/p/${post.id}/liked_by`}
                          target="_blank"
                          onClick={(e) => {
                            e.preventDefault();
                            // setOpenLikedModal(true);
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
              </Container>
              <div className="border-t dark:border-t-igSeparator border-t-igElevatedSeparator my-1">
                <Container className="pr-4 h-[53px]">
                  <CommentEditor
                    editor={editor}
                    onSelect={onSelect}
                    setCaption={setCaption}
                    handleComment={handleComment}
                    isPending={isPending}
                  />
                </Container>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
