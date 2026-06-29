"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid credentials");
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#8d7a7a] px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-10">
          <p className="text-sm font-bold tracking-[0.3em] text-white">BRICK</p>
          <p className="text-[10px] font-light tracking-[0.3em] text-white">ÉLITE</p>
          <p className="mt-6 text-xs text-white">Admin Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input id="email" name="email" label="Email" type="email" placeholder="admin@brickelite.com" required />
          <Input id="password" name="password" label="Password" type="password" placeholder="••••••••" required />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <Button type="submit" loading={loading} className="w-full">
            Sign In
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
