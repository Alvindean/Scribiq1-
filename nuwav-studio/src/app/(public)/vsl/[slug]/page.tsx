import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { publishedPages, projects } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

interface SalesPageContent {
  headline?: string;
  subheadline?: string;
  hero_cta?: string;
  benefits_section?: {
    heading: string;
    items: Array<{ icon: string; title: string; description: string }>;
  };
  offer_section?: {
    heading: string;
    items: Array<{ title: string; value: string }>;
    total_value: string;
    price: string;
    cta: string;
  };
  guarantee?: { heading: string; body: string };
  faq?: Array<{ question: string; answer: string }>;
  vsl_video_url?: string;
  checkout_slug?: string;
}

export default async function VSLPage({ params }: Props) {
  const { slug } = await params;

  const [page] = await db
    .select()
    .from(publishedPages)
    .where(
      and(
        eq(publishedPages.slug, slug),
        eq(publishedPages.pageType, "sales"),
        eq(publishedPages.isLive, true)
      )
    )
    .limit(1);

  if (!page) notFound();

  const [project] = await db
    .select({ title: projects.title, niche: projects.niche })
    .from(projects)
    .where(eq(projects.id, page.projectId))
    .limit(1);

  if (!project) notFound();

  const content = page.content as SalesPageContent;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-900 to-purple-900 text-white py-24 px-4 text-center">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            {content.headline ?? project.title}
          </h1>
          {content.subheadline && (
            <p className="text-xl text-violet-200 mb-8">{content.subheadline}</p>
          )}
          {content.vsl_video_url ? (
            <video
              src={content.vsl_video_url}
              controls
              autoPlay
              className="w-full rounded-xl aspect-video bg-black mb-8 max-w-2xl mx-auto"
            />
          ) : (
            <div className="w-full aspect-video rounded-xl bg-violet-800/50 max-w-2xl mx-auto mb-8 flex flex-col items-center justify-center gap-2">
              <span className="text-4xl">🎬</span>
              <p className="text-violet-300 text-sm font-medium">Video coming soon</p>
            </div>
          )}
          <Link href={`/checkout/${content.checkout_slug ?? slug}`}>
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-black font-bold">
              {content.hero_cta ?? "Enroll Now"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Benefits */}
      {content.benefits_section && (
        <section className="py-20 px-4 container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            {content.benefits_section.heading}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.benefits_section.items.map((item, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl border">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="font-semibold">{item.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Offer */}
      {content.offer_section && (
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold mb-8">{content.offer_section.heading}</h2>
            <div className="space-y-3 mb-8">
              {content.offer_section.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-background">
                  <span className="font-medium">{item.title}</span>
                  <span className="text-muted-foreground line-through text-sm">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="text-sm text-muted-foreground mb-2">
              Total value: <span className="line-through">{content.offer_section.total_value}</span>
            </div>
            <div className="text-4xl font-bold text-violet-700 mb-6">
              {content.offer_section.price}
            </div>
            <Link href={`/checkout/${content.checkout_slug ?? slug}`}>
              <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white px-12">
                {content.offer_section.cta ?? "Enroll Now"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Guarantee */}
      {content.guarantee && (
        <section className="py-16 px-4 container mx-auto max-w-2xl text-center">
          <div className="text-5xl mb-4">🛡️</div>
          <h2 className="text-2xl font-bold mb-3">{content.guarantee.heading}</h2>
          <p className="text-muted-foreground">{content.guarantee.body}</p>
        </section>
      )}

      {/* FAQ */}
      {content.faq && content.faq.length > 0 && (
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-2xl">
            <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {content.faq.map((item, i) => (
                <div key={i} className="rounded-xl border bg-background p-5">
                  <div className="font-semibold mb-2">{item.question}</div>
                  <div className="text-sm text-muted-foreground">{item.answer}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
