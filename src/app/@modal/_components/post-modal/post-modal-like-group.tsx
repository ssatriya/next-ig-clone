"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const PostModalLikeGroup = () => {
  return (
    <div className="flex relative">
      <Avatar>
        <AvatarImage src="/avatar.jpg" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  );
};
export default PostModalLikeGroup;
