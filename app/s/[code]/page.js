import { redirect } from "next/navigation";
import { getShareLink } from "../../../lib/store";

export default async function ShortLinkPage({ params }) {
  const { code } = await params;
  const auditId = await getShareLink(code);

  if (!auditId) {
    redirect("/");
  }

  redirect(`/share/${auditId}`);
}
