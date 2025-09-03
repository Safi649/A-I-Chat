// lib/rateLimit.ts
import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const LIMIT = 20;

export async function rateLimit(uid: string) {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const ref = doc(db, "usage", `${uid}_${today}`);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, { count: 1, date: today });
    return { ok: true };
  }

  const data = snap.data();
  if (data.count >= LIMIT) return { ok: false };

  await setDoc(ref, { count: data.count + 1, date: today });
  return { ok: true };
}
