"use client";

import Image from "next/image";
import { Copy } from "lucide-react";
import { memo, useState } from "react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type GeneralProfilePostProps = {
  postImages: string[];
};

const GeneralProfilePost = memo(({ postImages }: GeneralProfilePostProps) => {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <div className="relative h-[309px] w-[309px] cursor-pointer flex items-center justify-center">
      {postImages.length > 1 && (
        <Copy className="absolute top-4 right-4 w-4 h-4 z-30" />
      )}
      <Image
        src={postImages[0]}
        fill
        priority
        sizes="400px"
        alt="post image"
        style={{ objectFit: "cover" }}
        className={cn(imageLoading ? "hidden" : "block")}
        onLoad={() => setImageLoading(false)}
      />
      {imageLoading && (
        <Skeleton className="h-[309px] w-[309px] rounded-none" />
      )}
    </div>
  );
});
GeneralProfilePost.displayName = "GeneralProfilePost";
export default GeneralProfilePost;
