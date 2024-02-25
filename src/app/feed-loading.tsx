import { Skeleton } from "@/components/ui/skeleton";

export default function FeedLoading() {
  return (
    <div className="flex flex-col gap-6">
      <FeedLoading.Skeleton />
      <FeedLoading.Skeleton />
      <FeedLoading.Skeleton />
      <FeedLoading.Skeleton />
    </div>
  );
}

FeedLoading.Skeleton = function SkeletonFeedLoading() {
  return (
    <div className="w-[630px] h-full flex flex-col items-center pt-4">
      <div className="w-[470px] flex flex-col justify-center pt-5 mb-4">
        <div className="flex items-center justify-between w-full mb-3">
          <div className="flex gap-2 items-center">
            <Skeleton className="h-[38px] w-[38px] rounded-full" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
        <Skeleton className="h-[468px] w-[468px]" />
      </div>
    </div>
  );
};
