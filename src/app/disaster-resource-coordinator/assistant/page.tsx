import { redirect } from "next/navigation";

export default function ReliefAssistantPage() {
  redirect("/disaster-resource-coordinator?assistant=open");
}
