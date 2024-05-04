"use client";

import { ExtendedPost } from "@/types/db";
import GeneralProfilePost from "./general-profile-post";
import { useRouter } from "next/navigation";
import { memo, useCallback, useMemo, useState } from "react";

type GeneralProfilePostsProps = {
  userPosts: ExtendedPost[];
};

const GeneralProfilePosts = memo(({ userPosts }: GeneralProfilePostsProps) => {
  const router = useRouter();
  
  return (
    <div className="grid grid-cols-3 gap-1">
      {userPosts.map((post) => {
        const postImages = post.images.split(",");
        return (
          <div
            key={post.id}
            role="button"
            onClick={() => {
              router.push(`/p/${post.id}`);
            }}
          >
            <GeneralProfilePost postImages={postImages} />
          </div>
        );
      })}
    </div>
  );
});
GeneralProfilePosts.displayName = "GeneralProfilePosts";
export default GeneralProfilePosts;
