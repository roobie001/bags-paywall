import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-bold mb-3">
          <span className="text-purple-500">Bags</span>
          <span className="text-green-400">Pay</span>
        </h1>
        <p className="text-gray-400 text-lg">
          Gate your content with Solana micropayments
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-12 max-w-2xl w-full">
        {[
          {
            step: "1",
            title: "Create a paywall",
            desc: "Paste your content URL and set your price in SOL",
            color: "text-purple-400",
          },
          {
            step: "2",
            title: "Share your link",
            desc: "Send your unique paywall link to your audience",
            color: "text-green-400",
          },
          {
            step: "3",
            title: "Earn SOL",
            desc: "Fans pay directly to your wallet, no middleman",
            color: "text-purple-400",
          },
        ].map(({ step, title, desc, color }) => (
          <div
            key={step}
            className="bg-gray-900 rounded-xl p-5 border border-gray-800"
          >
            <div className={`text-3xl font-bold mb-2 ${color}`}>{step}</div>
            <div className="font-semibold mb-1 text-sm">{title}</div>
            <div className="text-gray-500 text-xs">{desc}</div>
          </div>
        ))}
      </div>

      <Link
        href="/create"
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors"
      >
        Create Your Paywall -&gt;
      </Link>

      <p className="mt-6 text-gray-600 text-xs">
        Built on Solana &middot; Powered by x402 &middot; No subscriptions
      </p>
    </main>
  );
}
