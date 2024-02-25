import { Skeleton } from "@/components/ui/skeleton";

const UserItemSkeleton = () => {
  return (
    <div className="flex items-center px-4 py-2 gap-3">
      <Skeleton className="w-11 h-11 rounded-full dark:bg-igSecondaryText" />
      <div className="flex flex-col gap-1">
        <Skeleton className="w-64 h-4 dark:bg-igSecondaryText" />
        <Skeleton className="w-56 h-4 dark:bg-igSecondaryText" />
      </div>
    </div>
  );
};
export default UserItemSkeleton;
