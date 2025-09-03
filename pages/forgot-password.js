// pages/forgot-password.js
import { useState } from "react";
import { auth } from "../lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/router";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("✅ Password reset link sent! Check your inbox.");
      setError("");
    } catch (err) {
      setError(err.message);
      setMessage("");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleReset}
        className="bg-white shadow-lg rounded-2xl p-6 w-96"
      >
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>

        {message && <p className="text-green-600 text-sm mb-2">{message}</p>}
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border p-2 mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-purple-600 text-white p-2 rounded"
        >
          Send Reset Link
        </button>

        <p
          className="mt-3 text-sm text-center cursor-pointer text-blue-600"
          onClick={() => router.push("/login")}
        >
          Back to Login
        </p>
      </form>
    </div>
  );
}
