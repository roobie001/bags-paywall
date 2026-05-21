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
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
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
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </main>
    );
  }

  if (!paywall) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">{"\u{1F50D}"}</div>
          <div className="text-gray-400">Paywall not found</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{"\u{1F510}"}</div>
          <h1 className="text-2xl font-bold mb-2">{paywall.title}</h1>
          {paywall.description && (
            <p className="text-gray-400 text-sm">{paywall.description}</p>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-400 text-sm">Amount</span>
            <span className="text-green-400 font-bold text-2xl font-mono">
              {paywall.price_sol} SOL
            </span>
          </div>

          <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-800">
            <span className="text-gray-400 text-sm">Network</span>
            <span className="text-gray-300 text-sm">Solana Devnet</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Recipient</span>
            <span className="text-gray-300 font-mono text-xs">
              {paywall.creator_wallet.slice(0, 6)}...
              {paywall.creator_wallet.slice(-4)}
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-xl px-4 py-3 text-red-400 text-sm mb-4">
            {error}
          </div>
        )}

        {!walletAddress ? (
          <button
            onClick={connectWallet}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-colors text-sm"
          >
            Connect Phantom Wallet
          </button>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 flex justify-between items-center">
              <span className="text-gray-400 text-xs">Connected</span>
              <span className="text-green-400 font-mono text-xs">
                [verified] {walletAddress.slice(0, 6)}...
                {walletAddress.slice(-4)}
              </span>
            </div>
            <button
              onClick={handlePay}
              disabled={paying}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors"
            >
              {paying
                ? "Processing payment..."
                : `Pay ${paywall.price_sol} SOL ->`}
            </button>
          </div>
        )}

        <p className="text-center text-gray-600 text-xs mt-6">
          Powered by <span className="text-purple-400">BagsPay</span> &middot;
          {" "}Secured by Solana
        </p>
      </div>
    </main>
  );
}
