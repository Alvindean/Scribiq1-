import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { publishedPages, projects } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Lock } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

interface CheckoutContent {
  price?: string;
  product_name?: string;
  description?: string;
  /** Numeric price in cents for Stripe, e.g. 9700 = $97 */
  price_cents?: number;
  currency?: string;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

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
    return { title: "Checkout", robots: { index: false } };
  }

  const [project] = await db
    .select({ title: projects.title })
    .from(projects)
    .where(eq(projects.id, page.projectId))
    .limit(1);

  const content = page.content as CheckoutContent;
  const productName = content.product_name ?? project?.title ?? "Online Course";

  return {
    title: `Checkout — ${productName}`,
    robots: { index: false, follow: false },
  };
}

async function createStripeSession(formData: FormData) {
  "use server";

  const slug = formData.get("slug") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const priceCents = parseInt(formData.get("price_cents") as string, 10);
  const productName = formData.get("product_name") as string;
  const currency = (formData.get("currency") as string) || "usd";

  const { getStripe } = await import("@/lib/stripe/client");

  let stripe;
  try {
    stripe = getStripe();
  } catch {
    // STRIPE_SECRET_KEY not set — should not reach here since UI hides form
    redirect(`/checkout/${slug}`);
  }

  const baseUrl = process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: email,
    line_items: [
      {
        price_data: {
          currency,
          unit_amount: isNaN(priceCents) || priceCents <= 0 ? 9700 : priceCents,
          product_data: {
            name: productName || "Online Course",
          },
        },
        quantity: 1,
      },
    ],
    metadata: { slug, buyer_name: name, buyer_email: email },
    success_url: `${baseUrl}/checkout/${slug}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/checkout/${slug}`,
  });

  redirect(session.url!);
}

export default async function CheckoutPage({ params }: Props) {
  const { slug } = await params;

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

  if (!page) notFound();

  const [project] = await db
    .select({ title: projects.title, niche: projects.niche, targetAudience: projects.targetAudience })
    .from(projects)
    .where(eq(projects.id, page.projectId))
    .limit(1);

  if (!project) notFound();

  const content = page.content as CheckoutContent;

  const productName = content.product_name ?? project.title;
  const displayPrice = content.price ?? "Contact for pricing";
  const description = content.description ?? (project.targetAudience ? `For ${project.targetAudience}` : null);
  const priceCents = content.price_cents ?? 0;
  const currency = content.currency ?? "usd";

  const stripeConfigured = !!process.env.STRIPE_SECRET_KEY;

  return (
    <div className="min-h-screen bg-muted/20 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Left: Product Summary */}
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-violet-600 mb-2">
                {project.niche ?? "Online Course"}
              </p>
              <h1 className="text-3xl font-bold leading-tight mb-3">{productName}</h1>
              {description && (
                <p className="text-muted-foreground">{description}</p>
              )}
            </div>

            <div className="rounded-xl border bg-card p-6 space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Order Summary
              </h2>
              <div className="flex items-center justify-between border-b pb-4">
                <span className="font-medium">{productName}</span>
                <span className="font-semibold">{displayPrice}</span>
              </div>
              <div className="flex items-center justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-violet-700">{displayPrice}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-green-600 shrink-0" />
              <span>30-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>Secure, encrypted checkout</span>
            </div>
          </div>

          {/* Right: Order Form */}
          <div className="rounded-xl border bg-card p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Complete Your Order</h2>

            {stripeConfigured ? (
              <form action={createStripeSession} className="space-y-5">
                {/* Hidden fields carrying page data to the server action */}
                <input type="hidden" name="slug" value={slug} />
                <input type="hidden" name="price_cents" value={priceCents} />
                <input type="hidden" name="product_name" value={productName} />
                <input type="hidden" name="currency" value={currency} />

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Jane Smith"
                    required
                    autoComplete="name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold"
                >
                  Complete Purchase — {displayPrice}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  You will be redirected to Stripe for secure payment processing.
                </p>
              </form>
            ) : (
              <div className="space-y-4 text-center py-6">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  Payments not configured — contact the creator.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
