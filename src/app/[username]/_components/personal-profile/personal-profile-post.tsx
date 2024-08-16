"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Copy } from "lucide-react";

import { cn } from "@/lib/utils";
import { ExtendedPost } from "@/types/db";
import { Icons } from "@/components/icons";
import { Skeleton } from "@/components/ui/skeleton";

type PersonalProfilePostProps = {
  postImages: string[];
  post: ExtendedPost;
};

const PersonalProfilePost = ({
  postImages,
  post,
}: PersonalProfilePostProps) => {
  const [imageLoading, setImageLoading] = useState(true);

  const cleanSrc = postImages[0].replace("https://", "");
  // const imgRef = useRef<HTMLImageElement>(null);

  // function onLoad() {
  //   setImageLoading(false);
  // }

  // useEffect(() => {
  //   if (imgRef.current?.complete) {
  //     onLoad();
  //   }
  // }, []);

  return (
    <div className="relative h-[309px] w-[309px] cursor-pointer flex items-center justify-center group">
      {postImages.length > 1 && (
        <Copy className="absolute top-4 right-4 w-4 h-4 z-30" />
      )}
      <div className="absolute inset-0 bg-transparent group-hover:bg-black/25 z-20" />
      <Image
        // src={postImages[0]}
        src={`https://wsrv.nl/?url=${cleanSrc}&w=450&h=450&output=webp`}
        fill
        priority
        alt="post image"
        style={{ objectFit: "cover" }}
        sizes="400px"
        // className={cn(imageLoading ? "hidden" : "block")}
        // onLoad={() => setImageLoading(false)}
        unoptimized={true}
      />
      {/* <img
        ref={imgRef}
        src={`https://wsrv.nl/?url=${cleanSrc}&w=450&h=450&output=webp`}
        alt="test"
        className={cn(
          "h-full w-full object-cover"
          // cn(imageLoading ? "hidden" : "block")
        )}
        sizes="400px"
        onLoad={onLoad}
      /> */}
      {/* {imageLoading && (
        <Skeleton className="h-[309px] w-[309px] rounded-none" />
      )} */}
      <div className="absolute top-1/2  gap-9 hidden group-hover:flex z-30">
        <div className="flex items-start gap-2">
          <Icons.loveActive className="text-white h-5 w-5" fill="white" />
          <span className="font-bold text-sm text-white">
            {post.like.length}
          </span>
        </div>
        <div className="flex items-start gap-2">
          <Icons.comment
            className="fill-white stroke-white h-5 w-5"
            fill="white"
          />
          <span className="font-bold text-sm text-white">
            {post.comment.length}
          </span>
        </div>
      </div>
    </div>
  );
};
export default PersonalProfilePost;
