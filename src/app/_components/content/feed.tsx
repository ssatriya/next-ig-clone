"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";

import PostItem from "./post-item";
import { ExtendedPost } from "@/types/db";
import { SplashScreen } from "../splash-screen";
import { useScrollHistory } from "@/hooks/use-scroll-history";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";

type FeedProps = {
  posts: ExtendedPost[];
};

const Feed = ({ posts }: FeedProps) => {
  const lastPostRef = useRef();
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 0.4,
  });

  const {
    data,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["feedQuery"],
    queryFn: async ({ pageParam }) => {
      const query = `/api/post?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}`;

      const res = await fetch(query);
      const data = await res.json();

      return data as ExtendedPost[];
    },
    getNextPageParam: (_, pages) => {
      return pages.length + 1;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetching) {
      fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry?.isIntersecting]);

  const feedPosts: ExtendedPost[] =
    data?.pages.flatMap((page) => page) ?? posts;

  // useLayoutEffect(() => {
  //   requestAnimationFrame(() => {
  //     window.scrollTo({ top: fromTop });
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <div className="w-auto md:w-[630px] flex flex-col">
      <ul className="flex flex-col items-center h-full">
        {feedPosts &&
          feedPosts.map((post, index) => {
            if (index === feedPosts.length - 1) {
              return (
                <li key={post.id} ref={ref} className="list-none">
                  <PostItem post={post} />
                </li>
              );
            } else {
              return (
                <li key={post.id} className="list-none">
                  <PostItem post={post} />
                </li>
              );
            }
          })}

        {hasNextPage && (
          <li className="flex items-center justify-center h-14">
            {!isFetching && (
              <span className="text-sm font-semibold text-igSecondaryText">
                End of content
              </span>
            )}
            {isFetching && (
              <Image
                src="/assets/loading-spinner.svg"
                className="animate-spin"
                height={24}
                width={24}
                alt="loading spinner"
              />
            )}
          </li>
        )}
      </ul>
      {isLoading && <SplashScreen />}
    </div>
  );
};
export default Feed;
