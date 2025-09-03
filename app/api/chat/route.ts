// app/api/chat/route.ts
import { NextRequest } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rateLimit";

const BodySchema = z.object({
  messages: z.array(z.object({ role: z.enum(["user","assistant"]), content: z.string() })),
  uid: z.string(), // Firebase user ID
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) return new Response("Invalid body", { status: 400 });

  const { messages, uid } = parsed.data;

  // 🔒 Rate limit per user
  const limited = await rateLimit(uid);
  if (!limited.ok) return new Response("Daily limit reached", { status: 429 });

  const res = await fetch(`${process.env.OPENAI_BASE_URL || "https://api.openai.com/v1"}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.MODEL || "gpt-4o-mini",
      messages: messages,
    }),
  });

  const data = await res.json();
  return new Response(JSON.stringify({ content: data.choices[0].message.content }), {
    headers: { "Content-Type": "application/json" },
  });
}
