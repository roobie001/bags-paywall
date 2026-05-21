"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { supabase, Paywall } from "@/lib/supabase";

export default function ContentPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const signature = searchParams.get("sig");

  const [paywall, setPaywall] = useState<Paywall | null>(null);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      if (!signature) {
        setLoading(false);
        return;
      }

      // Check payment exists in DB
      const { data: payment } = await supabase
        .from("payments")
        .select("*")
        .eq("tx_signature", signature)
        .eq("paywall_id", id)
        .single();

      if (!payment) {
        setLoading(false);
        return;
      }

      // Load paywall details
      const { data: paywallData } = await supabase
        .from("paywalls")
        .select("*")
        .eq("id", id)
        .single();

      setPaywall(paywallData);
      setVerified(true);
      setLoading(false);
    };

    verify();
  }, [id, signature]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-gray-400">Verifying payment...</div>
      </main>
    );
  }

  if (!verified || !paywall) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">{"\u{1F6AB}"}</div>
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-400 text-sm mb-6">
            No valid payment found for this content.
          </p>
          <a
            href={`/pay/${id}`}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors"
          >
            Go back and pay -&gt;
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        <div className="text-6xl mb-4">{"\u2705"}</div>
        <h1 className="text-2xl font-bold mb-2">Payment Verified</h1>
        <p className="text-gray-400 text-sm mb-8">
          Your Solana payment was confirmed on-chain. Enjoy your content.
        </p>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6 text-left">
          <div className="text-xs text-gray-500 mb-1">
            Transaction signature
          </div>
          <div className="font-mono text-xs text-green-400 break-all">
            {signature}
          </div>
          <a
            href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-purple-400 hover:text-purple-300 mt-2 block"
          >
            View on Solana Explorer -&gt;
          </a>
        </div>

        <a
          href={paywall.content_url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full block bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-colors mb-4"
        >
          Access Content -&gt;
        </a>

        <p className="text-gray-600 text-xs">
          Powered by <span className="text-purple-400">BagsPay</span> &middot;
          {" "}Secured by Solana
        </p>
      </div>
    </main>
  );
}
