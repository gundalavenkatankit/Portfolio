"use client";

import { FormEvent, KeyboardEvent as ReactKeyboardEvent, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type ConversationContext = { area?: string | null; location?: string | null };
type AssistantData = { answer: string; responseMode?: "ai" | "deterministic"; context: ConversationContext; sources: { name: string; url: string }[]; results: { title: string; details: string[]; url?: string | null }[] };
type Message = { id: string; role: "user" | "assistant"; text: string; data?: AssistantData };

export function ReliefChatWidget() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [context, setContext] = useState<ConversationContext>({});
  const [status, setStatus] = useState<"ready" | "searching" | "error">("ready");
  const abortController = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const launcherRef = useRef<HTMLButtonElement | null>(null);
  const busy = status === "searching";
  const queryRequestsOpen = searchParams.get("assistant") === "open";
  const isOpen = open || queryRequestsOpen;

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) closeChat();
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  });

  function closeChat() {
    setOpen(false);
    if (queryRequestsOpen) router.replace(pathname, { scroll: false });
    launcherRef.current?.focus();
  }

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

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask(input);
  }

  function submitOnEnter(event: ReactKeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return;
    event.preventDefault();
    if (!input.trim() || busy) return;
    void ask(input);
  }

  return <div className="reliefChatWidget">
    {isOpen && <section id="reliefChatPanel" className="widgetPanel" role="dialog" aria-labelledby="reliefChatTitle">
      <header className="widgetHeader"><div><span>Official data assistant</span><h2 id="reliefChatTitle">Ask ReliefReady</h2></div><button type="button" onClick={closeChat} aria-label="Close ReliefReady chat">×</button></header>
      <div className="widgetSafety"><strong>Call 911 for immediate danger</strong><span>Verify locations before traveling.</span></div>
      <div className="widgetMessages" aria-live="polite">
        {messages.length === 0 && <div className="widgetWelcome"><strong>How can I help?</strong><p>Ask about weather alerts, disaster declarations, shelter records, or FEMA recovery centers.</p></div>}
        {messages.map(message => <article className={`widgetMessage ${message.role}`} key={message.id}><strong>{message.role === "user" ? "You" : "ReliefReady"}</strong><div>{message.data && <span className="answerMode">{message.data.responseMode === "ai" ? "AI assisted response" : "Reliable fallback response"}</span>}<p>{message.text}</p>{message.data?.results.map((result, resultIndex) => <article className="assistantResult" key={`${message.id}-${resultIndex}`}><h3>{result.title}</h3><ul>{result.details.map((detail, detailIndex) => <li key={`${detailIndex}-${detail}`}>{detail}</li>)}</ul>{result.url && <a href={result.url} target="_blank" rel="noreferrer">Open location or official record →</a>}</article>)}{message.data?.sources.length ? <div className="answerSources"><span>Official sources</span>{message.data.sources.map(source => <a href={source.url} target="_blank" rel="noreferrer" key={source.name}>{source.name} →</a>)}</div> : null}</div></article>)}
        {busy && <p className="widgetStatus" role="status">Checking official data and preparing an answer.</p>}
        {status === "error" && <div className="widgetError" role="alert"><p>The service could not be reached. Please try again.</p><button type="button" onClick={() => setStatus("ready")}>Dismiss</button></div>}
      </div>
      <form className="widgetForm" onSubmit={submit}><label htmlFor="reliefWidgetQuestion">Your question</label><div><textarea ref={inputRef} id="reliefWidgetQuestion" value={input} onChange={event => setInput(event.target.value)} onKeyDown={submitOnEnter} placeholder="Ask ReliefReady" rows={2} maxLength={600} disabled={busy} /><button type="submit" disabled={!input.trim() || busy}>{busy ? "Checking" : "Send"}</button></div>{busy && <button className="widgetStop" type="button" onClick={() => abortController.current?.abort()}>Stop response</button>}</form>
    </section>}
    <button ref={launcherRef} className="widgetLauncher" type="button" onClick={() => isOpen ? closeChat() : setOpen(true)} aria-expanded={isOpen} aria-controls="reliefChatPanel"><span aria-hidden="true">RR</span><strong>{isOpen ? "Close chat" : "Ask ReliefReady"}</strong></button>
  </div>;
}
