import Link from "next/link";

const steps = [
  {
    step: "1",
    title: "Create a paywall",
    desc: "Paste your content URL, set your price in SOL, and publish in seconds.",
    color: "text-purple-400",
  },
  {
    step: "2",
    title: "Share your link",
    desc: "Drop your paywall into Bags posts, DMs, bios, and gated creator communities.",
    color: "text-green-400",
  },
  {
    step: "3",
    title: "Earn SOL",
    desc: "Get paid instantly on Solana with no middleman holding your revenue.",
    color: "text-purple-400",
  },
];

const stats = [
  "Instant payments",
  "0% platform fees",
  "100% to your wallet",
];

export default function Home() {
  return (
    <main
      className="min-h-screen px-4 text-white"
      style={{
        backgroundColor: "#0a0a0a",
        backgroundImage:
          "radial-gradient(circle at 1px 1px, #1a1a1a 1px, transparent 0)",
        backgroundSize: "24px 24px",
      }}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center py-20">
        <section className="mb-20 w-full max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-[#9945FF] px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-purple-300">
            Built on Solana &middot; x402 Protocol
          </div>

          <h1 className="mb-6 text-6xl font-black leading-none tracking-tight sm:text-7xl">
            <span className="text-white">Monetize your</span>{" "}
            <span className="text-[#9945FF]">Bags</span>
            <span className="text-[#14F195]">Pay</span>
            <br />
            <span className="text-white">content with Solana</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-8 text-gray-300 sm:text-xl">
            The easiest way for Bags creators to monetize their content with
            Solana micropayments
          </p>

          <div className="flex flex-col items-center gap-4">
            <Link
              href="/create"
              className="rounded-2xl bg-[#9945FF] px-12 py-5 text-lg font-bold text-white transition-all hover:bg-[#a669ff]"
              style={{ boxShadow: "0 0 20px rgba(153, 69, 255, 0.4)" }}
            >
              Create Your Paywall -&gt;
            </Link>

            <Link
              href="/#how-it-works"
              scroll={false}
              className="text-sm font-medium text-gray-300 transition-colors hover:text-[#14F195]"
            >
              See how it works -&gt;
            </Link>
          </div>
        </section>

        <section
          id="how-it-works"
          className="mb-10 w-full scroll-mt-24"
        >
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <p className="mb-2 text-sm uppercase tracking-[0.3em] text-gray-500">
              How It Works
            </p>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Launch a creator paywall in three simple moves
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map(({ step, title, desc, color }) => (
              <div
                key={step}
                className="rounded-2xl border border-gray-800 bg-[#101010] p-6"
                style={{ borderLeft: "3px solid #9945FF" }}
              >
                <div className={`mb-3 text-3xl font-black ${color}`}>{step}</div>
                <div className="mb-2 text-lg font-semibold text-white">
                  {title}
                </div>
                <div className="text-sm leading-7 text-gray-400">{desc}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="mb-12 flex flex-wrap items-center justify-center gap-3">
          {stats.map((stat) => (
            <div
              key={stat}
              className="rounded-full border border-[#173b31] bg-[#0f1715] px-4 py-2 text-sm font-semibold text-[#14F195]"
            >
              {stat}
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-600">
          Built for creator-first commerce on Solana
        </p>
      </div>
    </main>
  );
}
