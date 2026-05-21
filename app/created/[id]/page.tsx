"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase, Paywall } from "@/lib/supabase";

export default function CreatedPage() {
  const { id } = useParams();
  const [paywall, setPaywall] = useState<Paywall | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://bagspay.vercel.app";
  const paywallLink = `${origin}/pay/${id}`;

  useEffect(() => {
    const loadPaywall = async () => {
      const { data } = await supabase
        .from("paywalls")
        .select("*")
        .eq("id", id)
        .single();
      setPaywall(data);
      setLoading(false);
    };
    loadPaywall();
  }, [id]);

  const copyLink = () => {
    navigator.clipboard.writeText(paywallLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <main
        className="min-h-screen flex items-center justify-center text-white"
        style={{
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(#1a1a1a 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="text-gray-400">Loading...</div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen px-4 text-white"
      style={{
        backgroundColor: "#0a0a0a",
        backgroundImage:
          "radial-gradient(#1a1a1a 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-[500px] text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="mb-2 text-3xl font-bold">
            Your paywall is <span className="text-green-400">live!</span>
          </h1>
          <p className="mb-8 text-sm text-gray-400">
            Share the link below. Fans pay SOL directly to your wallet to get
            access.
          </p>

          {paywall && (
            <div className="mb-6 rounded-2xl border border-gray-800 bg-gray-900 p-6 text-left">
              <div className="mb-1 text-xs text-gray-500">Paywall</div>
              <div className="mb-3 font-semibold">{paywall.title}</div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Price</span>
                <span className="font-mono text-green-400">
                  {paywall.price_sol} SOL
                </span>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-gray-400">Your wallet</span>
                <span className="font-mono text-xs text-gray-300">
                  {paywall.creator_wallet.slice(0, 6)}...
                  {paywall.creator_wallet.slice(-4)}
                </span>
              </div>
            </div>
          )}

          <div className="mb-4 rounded-2xl border border-gray-800 border-t-[#9945FF] border-t-2 bg-gray-900 p-5">
            <div className="mb-2 text-xs text-purple-400">
              Your shareable paywall link
            </div>
            <div className="mb-3 break-all font-mono text-sm text-white">
              {paywallLink}
            </div>
            <button
              onClick={copyLink}
              className="w-full rounded-lg bg-purple-600 py-3 text-sm font-bold text-white transition-colors hover:bg-purple-700"
            >
              {copied ? "[verified] Copied!" : "Copy Link"}
            </button>
          </div>

          <a
            href={`https://x.com/intent/tweet?text=[locked] I just created a Solana paywall for my exclusive content. Pay ${paywall?.price_sol} SOL to get access&url=${encodeURIComponent(paywallLink)}&via=BagsApp`}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-6 block w-full rounded-xl border border-gray-700 bg-gray-900 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800"
          >
            Share on X -&gt;
          </a>

          <a
            href="/create"
            className="text-sm text-gray-500 hover:text-gray-300"
          >
            Create another paywall
          </a>
        </div>
      </div>
    </main>
  );
}
