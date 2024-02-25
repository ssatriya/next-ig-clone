import { Skeleton } from "@/components/ui/skeleton";

const CommentSkeleton = () => {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex gap-3 items-center">
        <div className="h-[42px] w-[42px] rounded-full bg-transparent flex justify-center items-center">
          <Skeleton className="w-[32px] h-[32px] rounded-full" />
        </div>
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-[200px]" />
          <div className="flex gap-4">
            <Skeleton className="h-3 w-4" />
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-8" />
          </div>
        </div>
      </div>
      <div className="h-10 w-10 p-2 flex items-center justify-center">
        <Skeleton className="h-3 w-3" />
      </div>
    </div>
  );
};
export default CommentSkeleton;
