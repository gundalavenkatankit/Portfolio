"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";

type ConversationContext = { area?: string | null; location?: string | null };
type AssistantData = { answer: string; responseMode?: "ai" | "deterministic"; context: ConversationContext; sources: { name: string; url: string }[]; results: { title: string; details: string[]; url?: string | null }[] };
type Message = { id: string; role: "user" | "assistant"; text: string; data?: AssistantData };

const suggestions = ["Are there active weather alerts in Texas?", "Find shelters near 98121 in Washington", "What recent disasters were declared in Florida?", "Find a FEMA recovery center near Asheville, North Carolina"];

export function ReliefChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [context, setContext] = useState<ConversationContext>({});
  const [status, setStatus] = useState<"ready" | "searching" | "error">("ready");
  const abortController = useRef<AbortController | null>(null);
  const busy = status === "searching";

  async function ask(question: string) {
    const text = question.trim();
    if (!text || busy) return;
    setMessages(current => [...current, { id: crypto.randomUUID(), role: "user", text }]);
    setInput("");
    setStatus("searching");
    abortController.current = new AbortController();
    try {
      const apiResponse = await fetch("/api/disaster-chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: text, context }), signal: abortController.current.signal });
      const data = await apiResponse.json() as AssistantData | { error: string };
      if (!apiResponse.ok || !("answer" in data)) throw new Error("Assistant request failed");
      setContext(data.context);
      setMessages(current => [...current, { id: crypto.randomUUID(), role: "assistant", text: data.answer, data }]);
      setStatus("ready");
    } catch (error) {
      setStatus((error as Error).name === "AbortError" ? "ready" : "error");
    } finally {
      abortController.current = null;
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); void ask(input); }
  function stop() { abortController.current?.abort(); }

  return <>
    <a className="reliefSkip" href="#assistantMain">Skip to disaster assistant</a>
    <header className="reliefHeader"><Link href="/disaster-resource-coordinator" className="reliefBrand"><span>RR</span><strong>ReliefReady</strong></Link><nav aria-label="Primary navigation"><Link href="/disaster-resource-coordinator/my-area">My area</Link><Link href="/disaster-resource-coordinator/shelters">Shelters</Link><Link href="/disaster-resource-coordinator/declarations">Declarations</Link><Link href="/disaster-resource-coordinator/recovery-centers">Recovery</Link></nav><Link href="/">Portfolio</Link></header>
    <main id="assistantMain" className="assistantPage">
      <section className="assistantIntro"><div><p className="reliefEyebrow">Official data assistant</p><h1>Ask ReliefReady</h1><p>Ask about current weather alerts, disaster declarations, nearby shelter records, and FEMA recovery centers across the United States.</p></div><div className="assistantWarning"><strong>Call 911 for immediate danger</strong><span>Always follow local emergency officials. Verify a location before traveling.</span></div></section>
      <div className="assistantLayout">
        <section className="chatPanel" aria-label="Conversation with ReliefReady">
          <div className="chatMessages" aria-live="polite">
            {messages.length === 0 && <div className="chatWelcome"><span aria-hidden="true">RR</span><div><h2>How can I help?</h2><p>I identify the type of help you need, search the official services used throughout ReliefReady, and explain the results using controlled response templates.</p></div></div>}
            {messages.map(message => <article className={`chatMessage ${message.role}`} key={message.id}><strong>{message.role === "user" ? "You" : "ReliefReady"}</strong><div>{message.data && <span className="answerMode">{message.data.responseMode === "ai" ? "AI assisted response" : "Reliable fallback response"}</span>}<p>{message.text}</p>{message.data?.results.map((result, resultIndex) => <article className="assistantResult" key={`${message.id}-${resultIndex}`}><h3>{result.title}</h3><ul>{result.details.map((detail, detailIndex) => <li key={`${detailIndex}-${detail}`}>{detail}</li>)}</ul>{result.url && <a href={result.url} target="_blank" rel="noreferrer">Open location or official record →</a>}</article>)}{message.data?.sources.length ? <div className="answerSources"><span>Official sources</span>{message.data.sources.map(source => <a href={source.url} target="_blank" rel="noreferrer" key={source.name}>{source.name} →</a>)}</div> : null}</div></article>)}
            {busy && <p className="chatStatus" role="status">Understanding your question and checking the relevant official data.</p>}
            {status === "error" && <div className="chatError" role="alert"><p>The official data could not be reached. Please use a source link or try again.</p><button type="button" onClick={() => setStatus("ready")}>Dismiss</button></div>}
          </div>
          {messages.length === 0 && <div className="chatSuggestions" aria-label="Example questions">{suggestions.map(question => <button type="button" onClick={() => void ask(question)} key={question}>{question}</button>)}</div>}
          <form className="chatForm" onSubmit={submit}><label htmlFor="reliefQuestion">Your question</label><div><textarea id="reliefQuestion" value={input} onChange={event => setInput(event.target.value)} placeholder="Ask about alerts, shelters, declarations, or recovery centers" rows={3} maxLength={600} disabled={busy} /><button type="submit" disabled={!input.trim() || busy}>{busy ? "Searching" : "Ask ReliefReady"}</button></div>{busy && <button className="stopResponse" type="button" onClick={stop}>Stop response</button>}</form>
        </section>
        <aside className="assistantSources" aria-label="Official data sources"><p className="reliefEyebrow">Source coverage</p><h2>What I can check</h2><ul><li><a href="https://www.weather.gov/alerts" target="_blank" rel="noreferrer"><strong>Weather alerts</strong><span>National Weather Service</span></a></li><li><a href="https://www.fema.gov/disaster/declarations" target="_blank" rel="noreferrer"><strong>Disaster declarations</strong><span>OpenFEMA</span></a></li><li><a href="https://www.disasterassistance.gov/information/immediate-needs/emergency-shelter" target="_blank" rel="noreferrer"><strong>Shelter records</strong><span>FEMA ESF 6</span></a></li><li><a href="https://egateway.fema.gov/ESF6/DRCLocator" target="_blank" rel="noreferrer"><strong>Recovery centers</strong><span>FEMA</span></a></li></ul><p>Cloudflare Workers AI explains verified results from these sources. Controlled rules remain available if the model cannot respond. Always verify availability, eligibility, and safety.</p></aside>
      </div>
    </main>
  </>;
}
