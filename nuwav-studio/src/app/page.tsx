import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { Waves, Zap, Video, Globe, ArrowRight } from "lucide-react";

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Logo />
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-violet-600 hover:bg-violet-700">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground mb-6">
          <Zap className="h-3.5 w-3.5 text-violet-600" />
          Powered by Claude AI + ElevenLabs
        </div>
        <h1 className="text-5xl font-bold tracking-tight mb-6 max-w-3xl mx-auto">
          Build AI-Powered Courses &{" "}
          <span className="text-violet-600">VSLs in Minutes</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Input your niche and product. NuWav Studio generates complete courses
          and Video Sales Letters — scripts, voiceover, video, and hosted pages —
          fully automatically.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/signup">
            <Button size="lg" className="bg-violet-600 hover:bg-violet-700 px-8">
              Start Building Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="default" variant="outline">Sign In</Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything You Need to Sell Knowledge Online
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Zap,
              title: "AI Script Generation",
              description:
                "Claude AI writes complete lesson scripts, VSL copy, and sales page content in seconds.",
            },
            {
              icon: Waves,
              title: "Natural Voiceover",
              description:
                "ElevenLabs converts your scripts to professional-quality voiceovers automatically.",
            },
            {
              icon: Video,
              title: "Rendered Video",
              description:
                "Remotion renders polished, animated lesson videos and VSLs ready for publishing.",
            },
            {
              icon: Globe,
              title: "Hosted Pages",
              description:
                "Publish course portals, VSL sales pages, and checkout pages instantly.",
            },
            {
              icon: Zap,
              title: "One-Click Export",
              description:
                "Export as MP4, PDF workbook, PPTX slides, SCORM package, or full ZIP bundle.",
            },
            {
              icon: Waves,
              title: "Visual Editor",
              description:
                "Fine-tune every slide, script, and timing in our drag-and-drop visual editor.",
            },
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="rounded-xl border p-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-violet-600" />
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-20 border-t">
        <h2 className="text-3xl font-bold text-center mb-4">Simple Pricing</h2>
        <p className="text-center text-muted-foreground mb-12">Start free. Scale as you grow.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { name: "Starter", price: "$49", features: ["3 projects", "10 renders/mo", "Course portal"], popular: false },
            { name: "Pro", price: "$149", features: ["25 projects", "100 renders/mo", "VSL builder", "Custom domain"], popular: true },
            { name: "Agency", price: "$399", features: ["Unlimited projects", "500 renders/mo", "White-label", "Client portals"], popular: false },
          ].map((plan) => (
            <div key={plan.name} className={`rounded-xl border p-6 ${plan.popular ? "border-violet-600 shadow-lg" : ""}`}>
              {plan.popular && <div className="text-xs font-semibold text-violet-600 mb-3">MOST POPULAR</div>}
              <div className="font-bold text-lg">{plan.name}</div>
              <div className="text-3xl font-bold mt-2 mb-4">
                {plan.price}<span className="text-sm font-normal text-muted-foreground">/mo</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="text-emerald-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <Button className={`w-full ${plan.popular ? "bg-violet-600 hover:bg-violet-700" : ""}`} variant={plan.popular ? "default" : "outline"}>
                  Get Started
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} NuWav Studio. All rights reserved.
      </footer>
    </div>
  );
}
