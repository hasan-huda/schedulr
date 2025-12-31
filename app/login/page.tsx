"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Login</h1>
      <button onClick={() => signIn("google", { callbackUrl: "/select" })}>
        Sign in with Google
      </button>
    </div>
  );
}
