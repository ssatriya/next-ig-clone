import { validateRequest } from "@/lib/auth/validate-request";

export default async function SavedPage() {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return;

  return (
    <div className="flex flex-1 flex-col items-center justify-center space-y-3">
      <div className="icon saved" />
      <span className="font-bold text-3xl leading-9">Save</span>
      <span className="text-sm max-w-96 text-center">
        Save photos and videos that you want to see again. No one is notified,
        and only you can see what you&apos;ve saved.
      </span>
    </div>
  );
}
