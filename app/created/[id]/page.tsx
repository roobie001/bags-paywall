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
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        <div className="text-6xl mb-6">{"\u{1F389}"}</div>

        <h1 className="text-3xl font-bold mb-2">
          Your paywall is <span className="text-green-400">live!</span>
        </h1>
        <p className="text-gray-400 mb-8 text-sm">
          Share the link below. Fans pay SOL directly to your wallet to get
          access.
        </p>

        {paywall && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6 text-left">
            <div className="text-xs text-gray-500 mb-1">Paywall</div>
            <div className="font-semibold mb-3">{paywall.title}</div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Price</span>
              <span className="text-green-400 font-mono">
                {paywall.price_sol} SOL
              </span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-400">Your wallet</span>
              <span className="text-gray-300 font-mono text-xs">
                {paywall.creator_wallet.slice(0, 6)}...
                {paywall.creator_wallet.slice(-4)}
              </span>
            </div>
          </div>
        )}

        <div className="bg-gray-900 border border-purple-700 rounded-xl p-4 mb-4">
          <div className="text-xs text-purple-400 mb-2">
            Your shareable paywall link
          </div>
          <div className="font-mono text-sm text-white break-all mb-3">
            {paywallLink}
          </div>
          <button
            onClick={copyLink}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors text-sm"
          >
            {copied ? "[verified] Copied!" : "Copy Link"}
          </button>
        </div>

        <a
          href={`https://x.com/intent/tweet?text=[locked] I just created a Solana paywall for my exclusive content. Pay ${paywall?.price_sol} SOL to get access&url=${encodeURIComponent(paywallLink)}&via=BagsApp`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full block bg-gray-900 hover:bg-gray-800 border border-gray-700 text-white font-bold py-3 rounded-xl transition-colors text-sm mb-6"
        >
          Share on X -&gt;
        </a>

        <a
          href="/create"
          className="text-gray-500 text-sm hover:text-gray-300"
        >
          Create another paywall
        </a>
      </div>
    </main>
  );
}
