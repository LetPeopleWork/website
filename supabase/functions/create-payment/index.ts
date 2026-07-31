import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { resolvePriceId } from "./priceCutover.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { name, email, organization, validFrom } = await req.json();
    if (!name || !email) throw new Error("Name and email are required");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { apiVersion: "2023-10-16" });

    const customers = await stripe.customers.list({ email, limit: 1 });
    const customerId = customers.data.length ? customers.data[0].id : undefined;

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : email,
      line_items: [{ price: resolvePriceId(new Date()), quantity: 1 }],
      mode: "payment",
      allow_promotion_codes: true,
      metadata: {
        customer_name: name,
        customer_email: email,
        organization: organization || "",
        valid_from: validFrom || new Date().toISOString().split('T')[0] // Default to today if not provided
      },
      success_url: `${req.headers.get("origin")}/lighthouse?payment=success`,
      cancel_url: `${req.headers.get("origin")}/lighthouse?payment=canceled`
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    });
  } catch (error) {
    console.error("Error in create-payment:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500
    });
  }
});