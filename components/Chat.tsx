"use client";
import { useState, useRef, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

type Msg = { role: "user" | "assistant"; content: string };

export default function Chat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [uid, setUid] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUid(user ? user.uid : null);
    });
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!input.trim() || !uid) return;
    const msg = { role: "user" as const, content: input };
    setMessages((m) => [...m, msg]);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [...messages, msg], uid }),
    });
    if (res.status === 429) {
      setMessages((m) => [...m, { role: "assistant", content: "❌ Daily limit reached." }]);
      return;
    }
    const data = await res.json();
    setMessages((m) => [...m, { role: "assistant", content: data.content }]);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50 border rounded">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <span className={`inline-block px-3 py-2 rounded-lg ${m.role === "user" ? "bg-blue-100" : "bg-gray-200"}`}>
              {m.content}
            </span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="flex mt-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type your message..."
          className="flex-1 border px-3 py-2 rounded-l-lg"
        />
        <button onClick={send} className="bg-blue-600 text-white px-4 rounded-r-lg">Send</button>
      </div>
    </div>
  );
}
