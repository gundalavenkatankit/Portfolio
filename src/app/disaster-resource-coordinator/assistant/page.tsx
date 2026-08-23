import type { Metadata } from "next";
import { ReliefChat } from "./relief-chat";

export const metadata: Metadata = {
  title: "Ask ReliefReady",
  description: "Ask questions grounded in official United States disaster alerts, declarations, shelter records, and recovery center data.",
};

export default function ReliefAssistantPage() {
  return <ReliefChat />;
}
