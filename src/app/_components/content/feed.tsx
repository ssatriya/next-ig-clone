"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";

import PostItem from "./post-item";
import { ExtendedPost } from "@/types/db";
import FeedLoading from "@/app/feed-loading";
import { useScrollHistory } from "@/hooks/use-scroll-history";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";

type FeedProps = {
  posts: ExtendedPost[];
};

const Feed = ({ posts }: FeedProps) => {
  const { fromTop } = useScrollHistory((state) => state);
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

  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: fromTop });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ul className="w-[630px] h-full flex flex-col items-center pt-4">
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
      {hasNextPage && isFetchingNextPage && (
        <li className="pb-6 h-full flex justify-center items-start mt-6">
          <Image
            src="/assets/loading-spinner.svg"
            className="animate-spin"
            height={24}
            width={24}
            alt="loading spinner"
          />
        </li>
      )}
      {!hasNextPage && !isFetching && !isLoading && (
        <li className="pb-6 h-full flex justify-center items-start mt-6">
          <span className="text-sm font-semibold text-igSecondaryText">
            End of content
          </span>
        </li>
      )}
      {isLoading && <FeedLoading />}
    </ul>
  );
};
export default Feed;
