import { validateRequest } from "@/lib/auth/validate-request";

export default async function SavedPage() {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return;

  return <div>saved</div>;
}
