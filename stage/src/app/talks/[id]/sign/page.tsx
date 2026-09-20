import { notFound } from "next/navigation";
import { SignUpload } from "@/features/sign/SignUpload";
import { getTalk } from "@/server/store";

export default async function SignUploadPage(props: PageProps<"/talks/[id]/sign">) {
  const { id } = await props.params;
  const talk = await getTalk(id);
  if (!talk) notFound();
  return <SignUpload talkId={talk.id} title={talk.title} />;
}
