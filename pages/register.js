// pages/register.js
import { useState } from "react";
import { auth } from "../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/"); // redirect to chat after register
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-lg rounded-2xl p-6 w-96"
      >
        <h1 className="text-2xl font-bold mb-4">Create Account</h1>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded"
        >
          Sign Up
        </button>

        <p
          className="mt-3 text-sm text-center cursor-pointer text-blue-600"
          onClick={() => router.push("/login")}
        >
          Already have an account? Login
        </p>
      </form>
    </div>
  );
}
