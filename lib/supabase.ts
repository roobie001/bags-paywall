import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Paywall = {
  id: string;
  creator_wallet: string;
  content_url: string;
  title: string;
  description: string | null;
  price_sol: number;
  created_at: string;
};

export type Payment = {
  id: string;
  paywall_id: string;
  fan_wallet: string;
  tx_signature: string;
  paid_at: string;
};
