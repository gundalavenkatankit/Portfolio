"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import Link from "next/link";
import { FormEvent, useState } from "react";
import type { ReliefAgentMessage } from "@/lib/agents/relief-agent";

const suggestions = [
  "Are there active weather alerts in Texas?",
  "Find shelters near 98121 in Washington",
  "What recent disasters were declared in Florida?",
  "Find a FEMA recovery center near Asheville, North Carolina",
];

function toolLabel(type: string) {
  if (type === "tool-getActiveAlerts") return "Checking National Weather Service alerts";
  if (type === "tool-getDisasterDeclarations") return "Checking OpenFEMA declarations";
  if (type === "tool-findShelters") return "Checking FEMA shelter records";
  if (type === "tool-findRecoveryCenters") return "Checking FEMA recovery centers";
  return "Resolving the location";
}

export function ReliefChat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error, stop, regenerate } = useChat<ReliefAgentMessage>({
    transport: new DefaultChatTransport({ api: "/api/disaster-chat" }),
  });
  const busy = status === "submitted" || status === "streaming";

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = input.trim();
    if (!question || busy) return;
    void sendMessage({ text: question });
    setInput("");
  }

  function askSuggestion(question: string) {
    if (busy) return;
    void sendMessage({ text: question });
  }

  return <>
    <a className="reliefSkip" href="#assistantMain">Skip to disaster assistant</a>
    <header className="reliefHeader"><Link href="/disaster-resource-coordinator" className="reliefBrand"><span>RR</span><strong>ReliefReady</strong></Link><nav aria-label="Primary navigation"><Link href="/disaster-resource-coordinator/my-area">My area</Link><Link href="/disaster-resource-coordinator/shelters">Shelters</Link><Link href="/disaster-resource-coordinator/declarations">Declarations</Link><Link href="/disaster-resource-coordinator/recovery-centers">Recovery</Link></nav><Link href="/">Portfolio</Link></header>
    <main id="assistantMain" className="assistantPage">
      <section className="assistantIntro">
        <div><p className="reliefEyebrow">Official data assistant</p><h1>Ask ReliefReady</h1><p>Ask about current weather alerts, disaster declarations, nearby shelter records, and FEMA recovery centers across the United States.</p></div>
        <div className="assistantWarning"><strong>Call 911 for immediate danger</strong><span>Always follow local emergency officials. Verify a location before traveling.</span></div>
      </section>

      <div className="assistantLayout">
        <section className="chatPanel" aria-label="Conversation with ReliefReady">
          <div className="chatMessages" aria-live="polite">
            {messages.length === 0 && <div className="chatWelcome"><span aria-hidden="true">RR</span><div><h2>How can I help?</h2><p>I search the same official services used throughout ReliefReady and explain the results in plain language.</p></div></div>}
            {messages.map(message => <article className={`chatMessage ${message.role}`} key={message.id}>
              <strong>{message.role === "user" ? "You" : "ReliefReady"}</strong>
              <div>{message.parts.map((part, index) => {
                if (part.type === "text") return <p key={`${message.id}-${index}`}>{part.text}</p>;
                if (part.type.startsWith("tool-") && "state" in part) return <span className="toolActivity" key={`${message.id}-${index}`}>{toolLabel(part.type)}{part.state === "output-available" ? " complete" : ""}</span>;
                return null;
              })}</div>
            </article>)}
            {status === "submitted" && <p className="chatStatus" role="status">Reviewing your question and selecting an official source.</p>}
            {error && <div className="chatError" role="alert"><p>The assistant could not complete that request. You can try again or use an official source.</p><button type="button" onClick={() => void regenerate()}>Try again</button></div>}
          </div>

          {messages.length === 0 && <div className="chatSuggestions" aria-label="Example questions">{suggestions.map(question => <button type="button" onClick={() => askSuggestion(question)} key={question}>{question}</button>)}</div>}

          <form className="chatForm" onSubmit={submit}>
            <label htmlFor="reliefQuestion">Your question</label>
            <div><textarea id="reliefQuestion" value={input} onChange={event => setInput(event.target.value)} placeholder="Ask about alerts, shelters, declarations, or recovery centers" rows={3} maxLength={600} disabled={busy} /><button type="submit" disabled={!input.trim() || busy}>{busy ? "Searching" : "Ask ReliefReady"}</button></div>
            {busy && <button className="stopResponse" type="button" onClick={stop}>Stop response</button>}
          </form>
        </section>

        <aside className="assistantSources" aria-label="Official data sources">
          <p className="reliefEyebrow">Source coverage</p><h2>What I can check</h2>
          <ul><li><a href="https://www.weather.gov/alerts" target="_blank" rel="noreferrer"><strong>Weather alerts</strong><span>National Weather Service</span></a></li><li><a href="https://www.fema.gov/disaster/declarations" target="_blank" rel="noreferrer"><strong>Disaster declarations</strong><span>OpenFEMA</span></a></li><li><a href="https://www.disasterassistance.gov/information/immediate-needs/emergency-shelter" target="_blank" rel="noreferrer"><strong>Shelter records</strong><span>FEMA ESF 6</span></a></li><li><a href="https://egateway.fema.gov/ESF6/DRCLocator" target="_blank" rel="noreferrer"><strong>Recovery centers</strong><span>FEMA</span></a></li></ul>
          <p>The assistant cannot guarantee availability, eligibility, or safety. Official records can change quickly.</p>
        </aside>
      </div>
    </main>
  </>;
}
