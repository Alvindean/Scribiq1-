"use client";

import { useParams } from "next/navigation";
import { useState, useCallback } from "react";
import Link from "next/link";
import {
  Wand2,
  Loader2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Clapperboard,
  Plus,
  Trash2,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BenefitItem {
  icon: string;
  title: string;
  description: string;
}

interface OfferItem {
  title: string;
  value: string;
}

interface SalesPageState {
  headline: string;
  subheadline: string;
  hero_cta: string;
  benefits_heading: string;
  benefits: BenefitItem[];
  offer_heading: string;
  offer_items: OfferItem[];
  offer_total_value: string;
  offer_price: string;
  offer_cta: string;
  guarantee_heading: string;
  guarantee_body: string;
  faq: Array<{ question: string; answer: string }>;
}

// ─── Section accordion wrapper ────────────────────────────────────────────────

function Section({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-lg border border-zinc-800 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-zinc-200 bg-zinc-900 hover:bg-zinc-800 transition-colors"
        aria-expanded={open}
      >
        <span>{title}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-zinc-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-zinc-400" />
        )}
      </button>
      {open && (
        <div className="px-4 py-4 space-y-3 bg-zinc-950">{children}</div>
      )}
    </div>
  );
}

// ─── Field helpers ─────────────────────────────────────────────────────────────

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-zinc-400">{label}</Label>
      {children}
    </div>
  );
}

const inputCls =
  "bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500 text-sm";

// ─── Main VSL Builder ─────────────────────────────────────────────────────────

export default function VSLBuilderPage() {
  const { id } = useParams<{ id: string }>();

  // Script state
  const [script, setScript] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  // Sales page state
  const [sales, setSales] = useState<SalesPageState>({
    headline: "",
    subheadline: "",
    hero_cta: "Get Instant Access",
    benefits_heading: "Everything You Get",
    benefits: [{ icon: "✅", title: "", description: "" }],
    offer_heading: "Here's Everything Included",
    offer_items: [{ title: "", value: "" }],
    offer_total_value: "",
    offer_price: "",
    offer_cta: "Enroll Now — Limited Time",
    guarantee_heading: "30-Day Money-Back Guarantee",
    guarantee_body: "",
    faq: [{ question: "", answer: "" }],
  });

  // Publish state
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<{
    slug: string;
    url: string;
  } | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);

  // ── Generate script ──────────────────────────────────────────────────────────

  async function handleGenerate() {
    setIsGenerating(true);
    setGenError(null);
    try {
      const res = await fetch("/api/vsl/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: id }),
      });
      const data = (await res.json()) as { script?: string; error?: string };
      if (!res.ok || !data.script) {
        throw new Error(data.error ?? "Generation failed");
      }
      setScript(data.script);
    } catch (err) {
      setGenError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  }

  // ── Use lyrics from lyric editor ─────────────────────────────────────────────

  function handleUseLyrics() {
    try {
      const draft = localStorage.getItem("soniq:lyric-editor-draft");
      if (draft) {
        setScript((prev) =>
          prev
            ? `${prev}\n\n--- Lyrics ---\n${draft}`
            : `--- Lyrics ---\n${draft}`
        );
      }
    } catch {
      // localStorage unavailable
    }
  }

  // ── Sales page helpers ───────────────────────────────────────────────────────

  const setSalesField = useCallback(
    <K extends keyof SalesPageState>(key: K, value: SalesPageState[K]) => {
      setSales((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Benefits
  function setBenefit(
    index: number,
    field: keyof BenefitItem,
    value: string
  ) {
    setSales((prev) => {
      const updated = prev.benefits.map((b, i) =>
        i === index ? { ...b, [field]: value } : b
      );
      return { ...prev, benefits: updated };
    });
  }
  function addBenefit() {
    if (sales.benefits.length >= 6) return;
    setSales((prev) => ({
      ...prev,
      benefits: [...prev.benefits, { icon: "✅", title: "", description: "" }],
    }));
  }
  function removeBenefit(index: number) {
    setSales((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  }

  // Offer items
  function setOfferItem(index: number, field: keyof OfferItem, value: string) {
    setSales((prev) => {
      const updated = prev.offer_items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      return { ...prev, offer_items: updated };
    });
  }
  function addOfferItem() {
    setSales((prev) => ({
      ...prev,
      offer_items: [...prev.offer_items, { title: "", value: "" }],
    }));
  }
  function removeOfferItem(index: number) {
    setSales((prev) => ({
      ...prev,
      offer_items: prev.offer_items.filter((_, i) => i !== index),
    }));
  }

  // FAQ
  function setFaqItem(
    index: number,
    field: "question" | "answer",
    value: string
  ) {
    setSales((prev) => {
      const updated = prev.faq.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      return { ...prev, faq: updated };
    });
  }
  function addFaq() {
    if (sales.faq.length >= 8) return;
    setSales((prev) => ({
      ...prev,
      faq: [...prev.faq, { question: "", answer: "" }],
    }));
  }
  function removeFaq(index: number) {
    setSales((prev) => ({
      ...prev,
      faq: prev.faq.filter((_, i) => i !== index),
    }));
  }

  // ── Publish ──────────────────────────────────────────────────────────────────

  async function handlePublish() {
    setIsPublishing(true);
    setPublishError(null);
    setPublishResult(null);

    const salesPage = {
      headline: sales.headline || undefined,
      subheadline: sales.subheadline || undefined,
      hero_cta: sales.hero_cta || undefined,
      benefits_section:
        sales.benefits.some((b) => b.title)
          ? {
              heading: sales.benefits_heading,
              items: sales.benefits.filter((b) => b.title),
            }
          : undefined,
      offer_section:
        sales.offer_items.some((o) => o.title)
          ? {
              heading: sales.offer_heading,
              items: sales.offer_items.filter((o) => o.title),
              total_value: sales.offer_total_value,
              price: sales.offer_price,
              cta: sales.offer_cta,
            }
          : undefined,
      guarantee:
        sales.guarantee_heading
          ? { heading: sales.guarantee_heading, body: sales.guarantee_body }
          : undefined,
      faq: sales.faq.filter((q) => q.question),
    };

    try {
      const res = await fetch("/api/vsl/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: id, script, salesPage }),
      });
      const data = (await res.json()) as {
        slug?: string;
        url?: string;
        error?: string;
      };
      if (!res.ok || !data.slug) {
        throw new Error(data.error ?? "Publish failed");
      }
      setPublishResult({ slug: data.slug, url: data.url ?? `/vsl/${data.slug}` });
    } catch (err) {
      setPublishError(err instanceof Error ? err.message : "Publish failed");
    } finally {
      setIsPublishing(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full min-h-screen bg-zinc-950 text-zinc-100">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 h-14 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-3">
          <Link href={`/projects/${id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-white gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </Link>
          <span className="text-zinc-600 select-none">/</span>
          <div className="flex items-center gap-2">
            <Clapperboard className="w-4 h-4 text-violet-400" />
            <h1 className="text-sm font-semibold text-white">VSL Builder</h1>
          </div>
        </div>
      </header>

      {/* Two-column layout */}
      <div className="flex flex-1 min-h-0 overflow-auto lg:overflow-hidden">
        {/* Left — Script (60%) */}
        <div className="w-full lg:w-3/5 flex flex-col border-b lg:border-b-0 lg:border-r border-zinc-800 overflow-y-auto">
          <div className="p-6 space-y-4 flex flex-col flex-1">
            {/* Script header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-100">
                VSL Script
              </h2>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                size="sm"
                className="gap-2 bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-60"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Generate
                  </>
                )}
              </Button>
            </div>

            {genError && (
              <p className="text-sm text-red-400 rounded-md bg-red-950/40 px-3 py-2">
                {genError}
              </p>
            )}

            {/* Textarea */}
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              rows={30}
              placeholder="Your VSL script will appear here. Click Generate to create one with AI, or write your own."
              className="w-full flex-1 resize-none rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm font-mono leading-relaxed text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              spellCheck
            />

            {/* Use lyrics button */}
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleUseLyrics}
                className="gap-2 border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
              >
                <ClipboardIcon className="w-4 h-4" />
                Use Lyrics from Lyric Editor
              </Button>
              <p className="text-xs text-zinc-600">
                Tip: Generate your VSL script, then refine it before publishing
              </p>
            </div>
          </div>
        </div>

        {/* Right — Sales page builder (40%) */}
        <div className="w-full lg:w-2/5 overflow-y-auto">
          <div className="p-6 space-y-3">
            <h2 className="text-lg font-semibold text-zinc-100 mb-4">
              Sales Page Builder
            </h2>

            {/* 1. Headline */}
            <Section title="1. Headline" defaultOpen>
              <Field label="Main Headline">
                <Input
                  value={sales.headline}
                  onChange={(e) => setSalesField("headline", e.target.value)}
                  placeholder="Finally — A System That Works"
                  className={inputCls}
                />
              </Field>
              <Field label="Subheadline">
                <Input
                  value={sales.subheadline}
                  onChange={(e) => setSalesField("subheadline", e.target.value)}
                  placeholder="Join 1,000+ creators who..."
                  className={inputCls}
                />
              </Field>
              <Field label="Hero CTA Button Text">
                <Input
                  value={sales.hero_cta}
                  onChange={(e) => setSalesField("hero_cta", e.target.value)}
                  placeholder="Get Instant Access"
                  className={inputCls}
                />
              </Field>
            </Section>

            {/* 2. Benefits */}
            <Section title="2. Benefits">
              <Field label="Section Heading">
                <Input
                  value={sales.benefits_heading}
                  onChange={(e) =>
                    setSalesField("benefits_heading", e.target.value)
                  }
                  placeholder="Everything You Get"
                  className={inputCls}
                />
              </Field>
              <div className="space-y-3 mt-1">
                {sales.benefits.map((benefit, i) => (
                  <div
                    key={i}
                    className="rounded-md border border-zinc-800 p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-500 font-medium">
                        Benefit {i + 1}
                      </span>
                      {sales.benefits.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeBenefit(i)}
                          className="text-zinc-600 hover:text-red-400 transition-colors"
                          aria-label={`Remove benefit ${i + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      <div className="col-span-1">
                        <Input
                          value={benefit.icon}
                          onChange={(e) => setBenefit(i, "icon", e.target.value)}
                          placeholder="✅"
                          className={`${inputCls} text-center`}
                          aria-label="Icon emoji"
                        />
                      </div>
                      <div className="col-span-4">
                        <Input
                          value={benefit.title}
                          onChange={(e) =>
                            setBenefit(i, "title", e.target.value)
                          }
                          placeholder="Benefit title"
                          className={inputCls}
                          aria-label="Benefit title"
                        />
                      </div>
                    </div>
                    <textarea
                      value={benefit.description}
                      onChange={(e) =>
                        setBenefit(i, "description", e.target.value)
                      }
                      placeholder="Short description..."
                      rows={2}
                      className="w-full resize-none rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-violet-500"
                      aria-label="Benefit description"
                    />
                  </div>
                ))}
              </div>
              {sales.benefits.length < 6 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addBenefit}
                  className="gap-2 border-zinc-700 text-zinc-400 hover:text-white mt-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Benefit
                </Button>
              )}
            </Section>

            {/* 3. Offer Stack */}
            <Section title="3. Offer Stack">
              <Field label="Section Heading">
                <Input
                  value={sales.offer_heading}
                  onChange={(e) =>
                    setSalesField("offer_heading", e.target.value)
                  }
                  placeholder="Here's Everything Included"
                  className={inputCls}
                />
              </Field>
              <div className="space-y-2 mt-1">
                {sales.offer_items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      value={item.title}
                      onChange={(e) => setOfferItem(i, "title", e.target.value)}
                      placeholder="Item name"
                      className={`${inputCls} flex-1`}
                      aria-label="Item name"
                    />
                    <div className="relative w-28 shrink-0">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
                        $
                      </span>
                      <Input
                        value={item.value}
                        onChange={(e) =>
                          setOfferItem(i, "value", e.target.value)
                        }
                        placeholder="497"
                        className={`${inputCls} pl-6`}
                        aria-label="Item value"
                      />
                    </div>
                    {sales.offer_items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeOfferItem(i)}
                        className="text-zinc-600 hover:text-red-400 transition-colors shrink-0"
                        aria-label={`Remove offer item ${i + 1}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOfferItem}
                className="gap-2 border-zinc-700 text-zinc-400 hover:text-white mt-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </Button>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <Field label="Total Value (shown struck-through)">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
                      $
                    </span>
                    <Input
                      value={sales.offer_total_value}
                      onChange={(e) =>
                        setSalesField("offer_total_value", e.target.value)
                      }
                      placeholder="1,491"
                      className={`${inputCls} pl-6`}
                    />
                  </div>
                </Field>
                <Field label="Your Price">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
                      $
                    </span>
                    <Input
                      value={sales.offer_price}
                      onChange={(e) =>
                        setSalesField("offer_price", e.target.value)
                      }
                      placeholder="97"
                      className={`${inputCls} pl-6`}
                    />
                  </div>
                </Field>
              </div>
              <Field label="CTA Button Text">
                <Input
                  value={sales.offer_cta}
                  onChange={(e) => setSalesField("offer_cta", e.target.value)}
                  placeholder="Enroll Now — Limited Time"
                  className={inputCls}
                />
              </Field>
            </Section>

            {/* 4. Guarantee */}
            <Section title="4. Guarantee">
              <Field label="Heading">
                <Input
                  value={sales.guarantee_heading}
                  onChange={(e) =>
                    setSalesField("guarantee_heading", e.target.value)
                  }
                  placeholder="30-Day Money-Back Guarantee"
                  className={inputCls}
                />
              </Field>
              <Field label="Body">
                <textarea
                  value={sales.guarantee_body}
                  onChange={(e) =>
                    setSalesField("guarantee_body", e.target.value)
                  }
                  placeholder="If you're not completely satisfied within 30 days, we'll refund you in full — no questions asked."
                  rows={3}
                  className="w-full resize-none rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </Field>
            </Section>

            {/* 5. FAQ */}
            <Section title="5. FAQ">
              <div className="space-y-3">
                {sales.faq.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-md border border-zinc-800 p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-500 font-medium">
                        Question {i + 1}
                      </span>
                      {sales.faq.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFaq(i)}
                          className="text-zinc-600 hover:text-red-400 transition-colors"
                          aria-label={`Remove FAQ ${i + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <Input
                      value={item.question}
                      onChange={(e) => setFaqItem(i, "question", e.target.value)}
                      placeholder="Is this right for beginners?"
                      className={inputCls}
                      aria-label="Question"
                    />
                    <textarea
                      value={item.answer}
                      onChange={(e) => setFaqItem(i, "answer", e.target.value)}
                      placeholder="Yes! This is designed for all skill levels..."
                      rows={2}
                      className="w-full resize-none rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-violet-500"
                      aria-label="Answer"
                    />
                  </div>
                ))}
              </div>
              {sales.faq.length < 8 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addFaq}
                  className="gap-2 border-zinc-700 text-zinc-400 hover:text-white mt-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Question
                </Button>
              )}
            </Section>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="shrink-0 border-t border-zinc-800 bg-zinc-950 px-6 py-3 flex items-center justify-between gap-3">
        {/* Feedback */}
        <div className="flex-1 min-w-0">
          {publishError && (
            <p className="text-sm text-red-400 truncate">{publishError}</p>
          )}
          {publishResult && (
            <div className="flex items-center gap-2 text-sm text-emerald-400">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span className="truncate">
                Live at{" "}
                <a
                  href={publishResult.url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-2 hover:text-emerald-300"
                >
                  {publishResult.url}
                </a>
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Preview button — only shows if already published */}
          {publishResult && (
            <a
              href={publishResult.url}
              target="_blank"
              rel="noreferrer"
            >
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-zinc-700 text-zinc-300 hover:text-white"
              >
                <ExternalLink className="w-4 h-4" />
                Preview
              </Button>
            </a>
          )}

          {/* Publish button */}
          <Button
            onClick={handlePublish}
            disabled={isPublishing}
            size="sm"
            className="gap-2 bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-60 min-w-[130px]"
          >
            {isPublishing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Publishing…
              </>
            ) : (
              <>
                <Clapperboard className="w-4 h-4" />
                Publish VSL
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Inline clipboard icon (avoids extra import)
function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="2" width="6" height="4" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  );
}
