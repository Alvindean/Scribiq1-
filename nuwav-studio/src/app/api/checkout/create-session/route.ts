import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { publishedPages } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getStripe } from "@/lib/stripe/client";

interface CheckoutContent {
  price?: string;
  product_name?: string;
  description?: string;
  price_cents?: number;
  currency?: string;
}

export async function POST(request: NextRequest): Promise<Response> {
  let body: { slug?: string; customerEmail?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { slug, customerEmail } = body;

  if (!slug) {
    return Response.json({ error: "slug is required" }, { status: 400 });
  }

  // Load the published page and verify it is a live checkout page
  const [page] = await db
    .select()
    .from(publishedPages)
    .where(
      and(
        eq(publishedPages.slug, slug),
        eq(publishedPages.pageType, "checkout"),
        eq(publishedPages.isLive, true)
      )
    )
    .limit(1);

  if (!page) {
    return Response.json(
      { error: "Checkout page not found or not live" },
      { status: 404 }
    );
  }

  const content = page.content as CheckoutContent;
  const priceCents = content.price_cents;
  const productName = content.product_name ?? "Online Course";
  const currency = content.currency ?? "usd";

  if (!priceCents || priceCents <= 0) {
    return Response.json(
      { error: "Invalid price configuration" },
      { status: 400 }
    );
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:3000";

  try {
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: productName },
            unit_amount: priceCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/checkout/${slug}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/${slug}`,
      ...(customerEmail ? { customer_email: customerEmail } : {}),
      metadata: { slug, projectId: page.projectId },
    });

    return Response.json({ url: session.url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create checkout session";
    console.error("Stripe create-session error:", message);
    return Response.json({ error: message }, { status: 500 });
  }
}
