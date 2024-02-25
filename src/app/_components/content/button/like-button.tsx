"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ExtendedPost, LikeWithUser } from "@/types/db";
import { LikesSelectType } from "@/lib/db/schema";
import { useEffect, useState } from "react";
import { usePrevious } from "@mantine/hooks";
import { generateId } from "lucia";

type LikeButtonProps = {
  loggedInUserId: string;
  post: ExtendedPost;
};

const LikeButton = ({ loggedInUserId, post }: LikeButtonProps) => {
  const queryClient = useQueryClient();
  const [localLike, setLocalLike] = useState<LikesSelectType[]>(post.like);
  const previousLikes = usePrevious<LikesSelectType[]>(localLike);

  const { data: likeData } = useQuery({
    queryKey: ["likesQuery", post.id],
    queryFn: async () => {
      const res = await fetch(`/api/like?postId=${post.id}`);
      const data = await res.json();

      return data as LikeWithUser[];
    },
    initialData: post.like,
    gcTime: 60 * 1000,
  });

  useEffect(() => {
    if (likeData) {
      setLocalLike(likeData);
    }
  }, [likeData]);

  const { mutate: addLike, isPending } = useMutation({
    mutationKey: ["createLike", post.id],
    mutationFn: async () => {
      const res = await fetch("/api/like", {
        method: "POST",
        body: JSON.stringify({ postId: post.id }),
      });

      const data = await res.json();
      return data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["likesQuery", post.id] });

      const likedIndex = localLike.findIndex(
        (like) => like.postId === post.id && like.userId === loggedInUserId
      );

      if (likedIndex === 0) {
        setLocalLike((prev) => {
          const newLikes = [...prev];
          newLikes.splice(likedIndex, 1);
          return newLikes;
        });
      } else {
        setLocalLike((prev) => [
          ...prev,
          {
            id: generateId(16),
            postId: post.id,
            userId: loggedInUserId,
            createdAt: new Date(),
          },
        ]);
      }
    },
    onError: (error) => {
      if (error && previousLikes) {
        setLocalLike(previousLikes);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["likesQuery", post.id] });
      queryClient.invalidateQueries({ queryKey: ["feedQuery"] });
      queryClient.invalidateQueries({ queryKey: ["getLikes"] });
    },
  });

  let isLiked: boolean = false;

  if (loggedInUserId) {
    isLiked = localLike.some(
      (like) => like.postId === post.id && like.userId === loggedInUserId
    );
  }

  return (
    <Button
      disabled={isPending}
      onClick={() => addLike()}
      size="icon"
      className="p-2 h-10 w-10 bg-transparent hover:bg-transparent group"
    >
      {isLiked ? (
        <Icons.liked className="fill-red-500" />
      ) : (
        <Icons.like className="fill-primary group-hover:fill-igSecondaryText" />
      )}
    </Button>
  );
};
export default LikeButton;
