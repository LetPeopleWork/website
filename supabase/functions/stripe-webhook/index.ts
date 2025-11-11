import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};
serve(async (req)=>{
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  // Handle heartbeat requests to keep the function alive
  const url = new URL(req.url);
  if (url.searchParams.get('heartbeat') === 'true' || req.headers.get('x-heartbeat') === 'true') {
    console.log("Heartbeat request received - keeping function alive");
    return new Response(JSON.stringify({
      status: 'alive',
      timestamp: new Date().toISOString()
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      },
      status: 200
    });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16"
    });
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!signature || !webhookSecret) {
      console.error("Missing signature or webhook secret");
      return new Response("Missing signature or webhook secret", {
        status: 400
      });
    }
    // Verify webhook signature
    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return new Response(`Webhook signature verification failed: ${err.message}`, {
        status: 400
      });
    }
    console.log("Webhook event received:", event.type);
    // Handle successful payment
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      // Extract customer information from metadata
      const { customer_name, customer_email, organization, license_type, valid_from } = session.metadata || {};
      if (!customer_name || !customer_email) {
        console.error("Missing required customer information in metadata");
        return new Response("Missing customer information", {
          status: 400
        });
      }
      console.log("Processing successful payment for:", {
        customer_name,
        customer_email,
        organization,
        valid_from
      });
      // Calculate expiry date (1 year from now)
      const computedExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Format: YYYY-MM-DD
      // Use valid_from from metadata or default to today
      const computedValidFrom = valid_from || new Date().toISOString().split('T')[0];
      // Trigger GitHub Action
      const githubToken = Deno.env.get("GITHUB_TOKEN");
      const repo = 'LetPeopleWork/Lighthouse';
      const workflowFile = 'generate-license.yml';
      const ref = 'main';
      if (!githubToken) {
        console.error("GitHub token not configured");
        return new Response("GitHub token not configured", {
          status: 500
        });
      }
      const response = await fetch(`https://api.github.com/repos/${repo}/actions/workflows/${workflowFile}/dispatches`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ref,
          inputs: {
            name: customer_name,
            email: customer_email,
            organization: organization || '',
            expiry: computedExpiry,
            valid_from: computedValidFrom
          }
        })
      });
      if (response.ok) {
        console.log("Successfully triggered GitHub Action for license generation");
        return new Response(JSON.stringify({
          status: 'success'
        }), {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          },
          status: 200
        });
      } else {
        const error = await response.text();
        console.error("Failed to trigger GitHub Action:", error);
        return new Response(JSON.stringify({
          status: 'error',
          error
        }), {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          },
          status: 500
        });
      }
    }
    // For other webhook events, just return success
    return new Response(JSON.stringify({
      received: true
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      },
      status: 200
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      },
      status: 500
    });
  }
});
