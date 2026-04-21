import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { publishedPages, projects } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

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

          <div className="rounded-lg bg-muted/50 border p-5 text-center space-y-3">
            <p className="font-medium text-base">Ready to enroll?</p>
            <p className="text-sm text-muted-foreground">
              Contact your administrator to complete enrollment for this course.
            </p>
            <a
              href="mailto:admin@nuwav.com"
              className="inline-block mt-2 text-violet-700 hover:text-violet-900 font-semibold underline underline-offset-2 text-sm"
            >
              Contact administrator
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
