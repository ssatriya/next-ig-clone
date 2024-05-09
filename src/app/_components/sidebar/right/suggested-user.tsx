import { follow } from "@/actions/follow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserSelectType } from "@/lib/db/schema";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";

type SuggestedUserProps = {
  user: UserSelectType;
};

const SuggestedUser = ({ user }: SuggestedUserProps) => {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const followHandler = (userId: string) => {
    startTransition(() => {
      follow(userId).then((data) => {
        if (data.success) {
          queryClient.invalidateQueries({ queryKey: ["suggestedUser"] });
        }
        if (data.error) {
        }
      });
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-3">
        <Avatar className="h-11 w-11">
          <AvatarImage src={user.image || ""} asChild>
            <Image
              src={user.image || ""}
              width={44}
              height={44}
              alt={`${user.username} avatar`}
            />
          </AvatarImage>
          <AvatarFallback>ss</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <Link href={`/${user.username}`}>
            <p className="font-semibold text-sm">{user.username}</p>
          </Link>
          <p className="text-xs font-medium text-igSecondaryText">
            {user.name}
          </p>
        </div>
      </div>
      {isPending ? (
        <div className="w-10 flex justify-center">
          <Image
            src="/assets/loading-spinner.svg"
            height={12}
            width={12}
            alt="Loading"
            className="animate-spin"
          />
        </div>
      ) : (
        <Button
          disabled={isPending}
          onClick={() => followHandler(user.id)}
          variant="text"
          className="text-igPrimary text-xs font-medium p-0"
        >
          Follow
        </Button>
      )}
    </div>
  );
};
export default SuggestedUser;
