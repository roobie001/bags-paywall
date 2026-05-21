"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CreatePaywall() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    content_url: "",
    creator_wallet: "",
    price_sol: "0.001",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError(null);

    // Basic validation
    if (!form.title) return setError("Title is required");
    if (!form.content_url) return setError("Content URL is required");
    if (!form.creator_wallet)
      return setError("Your Solana wallet address is required");
    if (!form.price_sol || isNaN(Number(form.price_sol)))
      return setError("Price must be a number");

    setLoading(true);

    const { data, error } = await supabase
      .from("paywalls")
      .insert({
        title: form.title,
        description: form.description,
        content_url: form.content_url,
        creator_wallet: form.creator_wallet,
        price_sol: Number(form.price_sol),
      })
      .select()
      .single();

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push(`/created/${data.id}`);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-8">
          <a
            href="/"
            className="text-gray-500 text-sm hover:text-gray-300 mb-4 block"
          >
            {"\u2190"} Back
          </a>

          <h1 className="text-3xl font-bold">
            Create a <span className="text-purple-500">Paywall</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Fill in the details below. Fans will pay SOL directly to your wallet
            to access your content.
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-5">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">
              Paywall Title *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="My exclusive alpha drop"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">
              Description (optional)
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="What will fans get access to?"
              rows={3}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 text-sm resize-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">
              Content URL *
            </label>
            <input
              name="content_url"
              value={form.content_url}
              onChange={handleChange}
              placeholder="https://your-content.com/exclusive"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 text-sm"
            />
            <p className="text-gray-600 text-xs mt-1">
              The URL fans will be redirected to after paying
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">
              Your Solana Wallet Address *
            </label>
            <input
              name="creator_wallet"
              value={form.creator_wallet}
              onChange={handleChange}
              placeholder="9B5X5wUohEap..."
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 text-sm font-mono"
            />
            <p className="text-gray-600 text-xs mt-1">
              SOL payments go directly to this address
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">
              Price (SOL) *
            </label>
            <input
              name="price_sol"
              value={form.price_sol}
              onChange={handleChange}
              placeholder="0.001"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 text-sm"
            />
            <p className="text-gray-600 text-xs mt-1">
              Minimum 0.001 SOL (~$0.09)
            </p>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors"
          >
            {loading ? "Creating..." : "Create Paywall \u2192"}
          </button>
        </div>
      </div>
    </main>
  );
}
