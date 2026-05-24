"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase, Paywall } from "@/lib/supabase";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} from "@solana/web3.js";

export default function PayPage() {
  const { id } = useParams();
  const router = useRouter();
  const [paywall, setPaywall] = useState<Paywall | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

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

  const connectWallet = async () => {
    try {
      const { solana } = window as any;
      if (!solana?.isPhantom) {
        setError("Please install Phantom wallet from phantom.app");
        return;
      }
      const response = await solana.connect();
      setWalletAddress(response.publicKey.toString());
      setError(null);
    } catch (err) {
      setError("Failed to connect wallet");
    }
  };

  const handlePay = async () => {
    if (!paywall || !walletAddress) return;
    setError(null);
    setPaying(true);

    try {
      const { solana } = window as any;
      const connection = new Connection(
        process.env.NEXT_PUBLIC_HELIUS_RPC!,
        "confirmed",
      );
      const fromPubkey = new PublicKey(walletAddress);
      const toPubkey = new PublicKey(paywall.creator_wallet);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports: paywall.price_sol * LAMPORTS_PER_SOL,
        }),
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromPubkey;

      const signed = await solana.signAndSendTransaction(transaction);
      const signature = signed.signature;

      await connection.confirmTransaction(signature, "confirmed");

      const { error: dbError } = await supabase.from("payments").insert({
        paywall_id: id,
        fan_wallet: walletAddress,
        tx_signature: signature,
      });

      if (dbError) {
        console.error("DB error:", dbError);
      }

      router.push(`/content/${id}?sig=${signature}`);
    } catch (err: any) {
      if (err.message?.includes("rejected")) {
        setError("Transaction cancelled");
      } else {
        setError(err.message || "Payment failed. Please try again.");
      }
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <main
        className="min-h-screen flex items-center justify-center text-white"
        style={{
          backgroundColor: "#0a0a0a",
          backgroundImage: "radial-gradient(#1a1a1a 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="text-gray-400">Loading...</div>
      </main>
    );
  }

  if (!paywall) {
    return (
      <main
        className="min-h-screen flex items-center justify-center text-white"
        style={{
          backgroundColor: "#0a0a0a",
          backgroundImage: "radial-gradient(#1a1a1a 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="text-center">
          <div className="mb-4 text-4xl">{"\u{1F50D}"}</div>
          <div className="text-gray-400">Paywall not found</div>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-black flex flex-col items-center justify-center px-4 text-white"
      style={{
        backgroundColor: "#0a0a0a",
        backgroundImage: "radial-gradient(#1a1a1a 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div className="w-full max-w-[420px] mx-auto">
        <div className="mb-8 text-center">
          <div className="mb-4 text-[48px] leading-none">{"\u{1F510}"}</div>
          <h1 className="mb-2 text-2xl font-bold">{paywall.title}</h1>
          {paywall.description && (
            <p className="text-sm text-gray-400">{paywall.description}</p>
          )}
        </div>

        <div className="mb-6 w-full max-w-[420px] rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-sm text-gray-400">Amount</span>
            <span className="font-mono text-2xl font-bold text-green-400">
              {paywall.price_sol} SOL
            </span>
          </div>

          <div className="mb-6 flex items-center justify-between border-b border-gray-800 pb-6">
            <span className="text-sm text-gray-400">Network</span>
            <span className="text-sm text-gray-300">Solana</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Recipient</span>
            <span className="font-mono text-xs text-gray-300">
              {paywall.creator_wallet.slice(0, 6)}...
              {paywall.creator_wallet.slice(-4)}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-700 bg-red-900/30 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {!walletAddress ? (
          <>
            <button
              onClick={connectWallet}
              className="w-full max-w-[420px] rounded-xl bg-purple-600 py-4 text-sm font-bold text-white transition-colors hover:bg-purple-700"
            >
              Connect Phantom Wallet
            </button>
            <p className="mt-3 text-center text-xs text-gray-500">
              Payments go directly to the creator wallet. BagsPay never holds
              your funds.
            </p>
          </>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between rounded-xl border border-gray-700 bg-gray-900 px-4 py-3">
              <span className="text-xs text-gray-400">Connected</span>
              <span className="flex items-center gap-2 font-mono text-xs text-green-400">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                <span>
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </span>
            </div>
            <button
              onClick={handlePay}
              disabled={paying}
              className="w-full rounded-xl bg-green-600 py-4 font-bold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-700"
            >
              {paying
                ? "Processing payment..."
                : `Pay ${paywall.price_sol} SOL ->`}
            </button>
            <p className="mt-3 text-center text-xs text-gray-500">
              Payments go directly to the creator wallet. BagsPay never holds
              your funds.
            </p>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-gray-600">
          Powered by <span className="text-purple-400">BagsPay</span> &middot;{" "}
          Secured by Solana
        </p>
      </div>
    </main>
  );
}
