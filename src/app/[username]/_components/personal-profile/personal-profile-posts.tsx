"use client";

import { ExtendedPost } from "@/types/db";
import PersonalProfilePost from "./personal-profile-post";
import { useRouter } from "next/navigation";

type PersonalProfilePostsProps = {
  userPosts: ExtendedPost[];
};

const PersonalProfilePosts = ({ userPosts }: PersonalProfilePostsProps) => {
  const router = useRouter();
  return (
    <>
      <div className="grid grid-cols-3 gap-1">
        {userPosts.map((post) => {
          const postImages = post.images.split(",");
          return (
            <div
              role="button"
              key={post.id}
              onClick={() => {
                router.push(`/p/${post.id}`);
              }}
            >
              <PersonalProfilePost post={post} postImages={postImages} />
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
};
export default PersonalProfilePosts;
