import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { publishedPages, projects } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  params: Promise<{ slug: string }>;
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
    .select({ title: projects.title })
    .from(projects)
    .where(eq(projects.id, page.projectId))
    .limit(1);

  if (!project) notFound();

  const content = page.content as { price?: string; product_name?: string };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl border bg-card p-8 shadow-sm space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">{content.product_name ?? project.title}</h1>
            <p className="text-3xl font-bold text-violet-700 mt-2">{content.price ?? "Contact for pricing"}</p>
          </div>

          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="you@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" type="text" placeholder="Jane Smith" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="card">Card Number</Label>
              <Input id="card" type="text" placeholder="4242 4242 4242 4242" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry</Label>
                <Input id="expiry" type="text" placeholder="MM/YY" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" type="text" placeholder="123" />
              </div>
            </div>
            <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700" size="lg">
              Complete Purchase
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground">
            🔒 Secure checkout. 30-day money back guarantee.
          </p>
        </div>
      </div>
    </div>
  );
}
