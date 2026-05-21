"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const priceTiers = ["0.001 SOL", "0.01 SOL", "0.1 SOL", "0.5 SOL"];

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
    <main
      className="min-h-screen px-4 py-16 text-white"
      style={{
        backgroundColor: "#0a0a0a",
        backgroundImage:
          "radial-gradient(#1a1a1a 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="w-full max-w-[560px] rounded-[28px] border border-gray-800 bg-black/70 p-8 backdrop-blur-sm sm:p-10">
          <div className="mb-8">
            <a
              href="/"
              className="mb-4 block text-sm text-gray-500 hover:text-gray-300"
            >
              {"\u2190"} Back
            </a>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Create a <span className="text-purple-500">Paywall</span>
            </h1>
            <p className="mt-3 text-sm leading-7 text-gray-400">
              Fill in the details below. Fans will pay SOL directly to your
              wallet to access your content.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <label className="mb-1 block text-sm text-gray-400">
                Paywall Title *
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="My exclusive alpha drop"
                className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-4 text-sm text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none focus:shadow-[0_0_0_2px_rgba(153,69,255,0.4)]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-400">
                Description (optional)
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="What will fans get access to?"
                rows={3}
                className="w-full resize-none rounded-xl border border-gray-700 bg-gray-900 px-4 py-4 text-sm text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none focus:shadow-[0_0_0_2px_rgba(153,69,255,0.4)]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-400">
                Content URL *
              </label>
              <input
                name="content_url"
                value={form.content_url}
                onChange={handleChange}
                placeholder="https://your-content.com/exclusive"
                className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-4 text-sm text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none focus:shadow-[0_0_0_2px_rgba(153,69,255,0.4)]"
              />
              <p className="mt-1 text-xs text-gray-600">
                The URL fans will be redirected to after paying
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-400">
                Your Solana Wallet Address *
              </label>
              <input
                name="creator_wallet"
                value={form.creator_wallet}
                onChange={handleChange}
                placeholder="9B5X5wUohEap..."
                className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-4 text-sm font-mono text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none focus:shadow-[0_0_0_2px_rgba(153,69,255,0.4)]"
              />
              <p className="mt-1 text-xs text-gray-600">
                SOL payments go directly to this address
              </p>
            </div>

            <div>
              <label className="mb-3 block text-sm text-gray-400">
                Price (SOL) *
              </label>
              <div className="mb-3 flex flex-wrap gap-2">
                {priceTiers.map((tier) => {
                  const value = tier.replace(" SOL", "");
                  const selected = form.price_sol === value;

                  return (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setForm({ ...form, price_sol: value })}
                      className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                        selected
                          ? "bg-purple-600 text-white"
                          : "border border-gray-700 bg-transparent text-gray-300 hover:border-gray-500"
                      }`}
                    >
                      {tier}
                    </button>
                  );
                })}
              </div>
              <input
                name="price_sol"
                value={form.price_sol}
                onChange={handleChange}
                placeholder="0.001"
                className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-4 text-sm text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none focus:shadow-[0_0_0_2px_rgba(153,69,255,0.4)]"
              />
              <p className="mt-1 text-xs text-gray-600">
                Minimum 0.001 SOL (~$0.09)
              </p>
            </div>

            {error && (
              <div className="rounded-xl border border-red-700 bg-red-900/30 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-xl bg-purple-600 py-4 font-bold text-white transition-all hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-700"
              style={{ boxShadow: "0 0 20px rgba(153, 69, 255, 0.4)" }}
            >
              {loading ? "Creating..." : "Create Paywall \u2192"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
