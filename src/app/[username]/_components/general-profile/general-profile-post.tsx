"use client";

import Image from "next/image";

import { Copy } from "lucide-react";
import { memo } from "react";

type GeneralProfilePostProps = {
  postImages: string[];
};

const GeneralProfilePost = memo(({ postImages }: GeneralProfilePostProps) => {
  return (
    <div className="relative h-[309px] w-[309px] cursor-pointer flex items-center justify-center">
      {postImages.length > 1 && (
        <Copy className="absolute top-4 right-4 w-4 h-4 z-30" />
      )}
      <Image
        src={postImages[0]}
        fill
        priority
        alt="post image"
        style={{ objectFit: "cover" }}
      />
    </div>
  );
});
GeneralProfilePost.displayName = "GeneralProfilePost";
export default GeneralProfilePost;
