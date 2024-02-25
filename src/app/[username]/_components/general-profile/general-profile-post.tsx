"use client";

import Image from "next/image";

import { Copy } from "lucide-react";

type GeneralProfilePostProps = {
  postImages: string[];
};

const GeneralProfilePost = ({ postImages }: GeneralProfilePostProps) => {
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
};
export default GeneralProfilePost;
