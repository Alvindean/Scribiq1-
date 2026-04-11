import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { db } from "@/lib/db";
import { publishedPages, projects } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getStripe } from "@/lib/stripe/client";
import { Button } from "@/components/ui/button";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ session_id?: string }>;
}

interface CheckoutContent {
  price?: string;
  product_name?: string;
  description?: string;
  price_cents?: number;
  currency?: string;
}

export const metadata: Metadata = {
  title: "Payment Successful",
  robots: { index: false, follow: false },
};

export default async function CheckoutSuccessPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { session_id: sessionId } = await searchParams;

  // Load the published page to get product info
  const [page] = await db
    .select()
    .from(publishedPages)
    .where(
      and(
        eq(publishedPages.slug, slug),
        eq(publishedPages.pageType, "checkout")
      )
    )
    .limit(1);

  const [project] = page
    ? await db
        .select({ title: projects.title })
        .from(projects)
        .where(eq(projects.id, page.projectId))
        .limit(1)
    : [null];

  const content = (page?.content ?? {}) as CheckoutContent;
  const productName = content.product_name ?? project?.title ?? "Your Course";

  // Optionally verify the Stripe session to show confirmed order details
  let customerEmail: string | null = null;
  let amountTotal: number | null = null;
  let currency: string | null = null;

  if (sessionId) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      customerEmail = session.customer_details?.email ?? null;
      amountTotal = session.amount_total;
      currency = session.currency;
    } catch {
      // Stripe not configured or session invalid — degrade gracefully
    }
  }

  const formattedAmount =
    amountTotal != null && currency
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currency.toUpperCase(),
        }).format(amountTotal / 100)
      : null;

  return (
    <div className="min-h-screen bg-muted/20 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border bg-card p-10 shadow-sm text-center space-y-6">
          {/* Checkmark */}
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Payment Successful!</h1>
            <p className="text-muted-foreground">
              Thank you for purchasing{" "}
              <span className="font-semibold text-foreground">{productName}</span>.
            </p>
          </div>

          {/* Order details (from Stripe session) */}
          {(customerEmail || formattedAmount) && (
            <div className="rounded-xl border bg-muted/40 px-6 py-4 space-y-2 text-sm text-left">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Order Details
              </p>
              {customerEmail && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{customerEmail}</span>
                </div>
              )}
              {formattedAmount && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount paid</span>
                  <span className="font-medium text-green-700">{formattedAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Course</span>
                <span className="font-medium">{productName}</span>
              </div>
            </div>
          )}

          {/* CTA */}
          <Button
            asChild
            size="lg"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold"
          >
            <Link href={`/course/${slug}`}>Start Learning →</Link>
          </Button>

          <p className="text-xs text-muted-foreground">
            A confirmation email will be sent to you shortly.
          </p>
        </div>
      </div>
    </div>
  );
}
