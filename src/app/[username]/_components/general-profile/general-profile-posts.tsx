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
    <>
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
      {!userPosts.length && (
        <div className="flex flex-1 flex-col items-center justify-center space-y-3">
          <div className="icon no-posts" />
          <span className="font-bold text-3xl leading-9">No Posts Yet</span>
        </div>
      )}
    </>
  );
});
GeneralProfilePosts.displayName = "GeneralProfilePosts";
export default GeneralProfilePosts;
