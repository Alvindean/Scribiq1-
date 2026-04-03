"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProjectType } from "@/types/project";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tone = "professional" | "casual" | "energetic" | "authoritative";
type DurationTarget = 15 | 30 | 60 | 90;

interface FormData {
  type: ProjectType | null;
  niche: string;
  product_name: string;
  target_audience: string;
  template_id: string | null;
  tone: Tone;
  duration_target: DurationTarget;
}

interface Template {
  id: string;
  name: string;
  type: "course" | "vsl" | "hybrid";
  description: string | null;
  thumbnail_url: string | null;
  niche_category: string | null;
}

const STEPS = ["Type", "Details", "Template", "Settings", "Review"] as const;
type Step = 0 | 1 | 2 | 3 | 4;

// ─── Step 1 — Type ────────────────────────────────────────────────────────────

const PROJECT_TYPES: {
  type: ProjectType;
  label: string;
  icon: string;
  description: string;
}[] = [
  {
    type: "course",
    label: "Course",
    icon: "🎓",
    description:
      "Build a structured online course with modules, lessons, and assessments.",
  },
  {
    type: "vsl",
    label: "VSL",
    icon: "📹",
    description:
      "Create a high-converting video sales letter with AI-crafted scripts.",
  },
  {
    type: "hybrid",
    label: "Hybrid",
    icon: "⚡",
    description:
      "Combine course content with VSL-style sales sections for maximum impact.",
  },
];

function TypeStep({
  selected,
  onSelect,
}: {
  selected: ProjectType | null;
  onSelect: (t: ProjectType) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Choose a project type</h2>
        <p className="text-muted-foreground mt-1">
          Select the type of content you want to create.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {PROJECT_TYPES.map(({ type, label, icon, description }) => (
          <Card
            key={type}
            className={`cursor-pointer border-2 transition-colors ${
              selected === type
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => onSelect(type)}
          >
            <CardHeader>
              <div className="text-4xl mb-2">{icon}</div>
              <CardTitle>{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Step 2 — Details ─────────────────────────────────────────────────────────

function DetailsStep({
  data,
  onChange,
}: {
  data: Pick<FormData, "niche" | "product_name" | "target_audience">;
  onChange: (
    field: "niche" | "product_name" | "target_audience",
    value: string
  ) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Project details</h2>
        <p className="text-muted-foreground mt-1">
          Tell us about your product and audience.
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="niche">Niche</Label>
          <Input
            id="niche"
            placeholder="e.g. Digital Marketing, Fitness, Finance"
            value={data.niche}
            onChange={(e) => onChange("niche", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="product_name">Product name</Label>
          <Input
            id="product_name"
            placeholder="e.g. The Ultimate Growth Blueprint"
            value={data.product_name}
            onChange={(e) => onChange("product_name", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="target_audience">Target audience</Label>
          <Input
            id="target_audience"
            placeholder="e.g. Small business owners aged 25-45"
            value={data.target_audience}
            onChange={(e) => onChange("target_audience", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Step 3 — Template ────────────────────────────────────────────────────────

function TemplateStep({
  templates,
  selected,
  onSelect,
  loading,
}: {
  templates: Template[];
  selected: string | null;
  onSelect: (id: string | null) => void;
  loading: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Choose a template</h2>
        <p className="text-muted-foreground mt-1">
          Start from a template or build from scratch.
        </p>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Blank option */}
          <Card
            className={`cursor-pointer border-2 transition-colors ${
              selected === null
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => onSelect(null)}
          >
            <CardHeader>
              <CardTitle>Blank</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Start from scratch with no pre-built structure.
              </CardDescription>
            </CardContent>
          </Card>
          {templates.map((t) => (
            <Card
              key={t.id}
              className={`cursor-pointer border-2 transition-colors ${
                selected === t.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => onSelect(t.id)}
            >
              {t.thumbnail_url && (
                <div className="overflow-hidden rounded-t-lg">
                  <img
                    src={t.thumbnail_url}
                    alt={t.name}
                    className="h-32 w-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">{t.name}</CardTitle>
                  <span className="text-xs bg-secondary px-2 py-0.5 rounded-full capitalize">
                    {t.type}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {t.description ?? "No description available."}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Step 4 — Settings ────────────────────────────────────────────────────────

const TONES: { value: Tone; label: string }[] = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "energetic", label: "Energetic" },
  { value: "authoritative", label: "Authoritative" },
];

const DURATIONS: { value: DurationTarget; label: string }[] = [
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
  { value: 60, label: "60 min" },
  { value: 90, label: "90 min" },
];

function SettingsStep({
  tone,
  duration_target,
  onToneChange,
  onDurationChange,
}: {
  tone: Tone;
  duration_target: DurationTarget;
  onToneChange: (t: Tone) => void;
  onDurationChange: (d: DurationTarget) => void;
}) {
  const durationIndex = DURATIONS.findIndex((d) => d.value === duration_target);

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Settings</h2>
        <p className="text-muted-foreground mt-1">
          Customize the tone and length of your project.
        </p>
      </div>

      {/* Tone */}
      <div className="space-y-3">
        <Label>Tone</Label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TONES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => onToneChange(value)}
              className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
                tone === value
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Target duration</Label>
          <span className="text-sm font-semibold text-primary">
            {duration_target} min
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={DURATIONS.length - 1}
          step={1}
          value={durationIndex}
          onChange={(e) =>
            onDurationChange(DURATIONS[Number(e.target.value)].value)
          }
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          {DURATIONS.map((d) => (
            <span key={d.value}>{d.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Step 5 — Review ──────────────────────────────────────────────────────────

function ReviewStep({
  data,
  templates,
  submitting,
  error,
  onSubmit,
}: {
  data: FormData;
  templates: Template[];
  submitting: boolean;
  error: string | null;
  onSubmit: () => void;
}) {
  const selectedTemplate = templates.find((t) => t.id === data.template_id);

  const rows: { label: string; value: string }[] = [
    { label: "Type", value: data.type ?? "—" },
    { label: "Niche", value: data.niche || "—" },
    { label: "Product name", value: data.product_name || "—" },
    { label: "Target audience", value: data.target_audience || "—" },
    {
      label: "Template",
      value: selectedTemplate ? selectedTemplate.name : "Blank",
    },
    { label: "Tone", value: data.tone },
    { label: "Duration target", value: `${data.duration_target} min` },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Review &amp; create</h2>
        <p className="text-muted-foreground mt-1">
          Confirm your project settings before generating.
        </p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <dl className="divide-y">
            {rows.map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between py-3"
              >
                <dt className="text-sm text-muted-foreground">{label}</dt>
                <dd className="text-sm font-medium capitalize">{value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-md px-4 py-3">
          {error}
        </p>
      )}
      <Button
        size="lg"
        className="w-full"
        onClick={onSubmit}
        disabled={submitting}
      >
        {submitting ? "Creating project…" : "Create project"}
      </Button>
    </div>
  );
}

// ─── Wizard shell ─────────────────────────────────────────────────────────────

export default function NewProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    type: null,
    niche: "",
    product_name: "",
    target_audience: "",
    template_id: null,
    tone: "professional",
    duration_target: 30,
  });

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  async function fetchTemplates() {
    if (templates.length > 0) return;
    setTemplatesLoading(true);
    try {
      const res = await fetch("/api/templates");
      if (res.ok) {
        const data = (await res.json()) as Template[];
        setTemplates(data);
      }
    } finally {
      setTemplatesLoading(false);
    }
  }

  function canAdvance(): boolean {
    if (step === 0) return formData.type !== null;
    if (step === 1)
      return (
        formData.niche.trim() !== "" &&
        formData.product_name.trim() !== "" &&
        formData.target_audience.trim() !== ""
      );
    return true;
  }

  async function goNext() {
    if (step === 2) await fetchTemplates();
    if (step < 4) setStep(((step + 1) as Step));
  }

  function goPrev() {
    if (step > 0) setStep(((step - 1) as Step));
  }

  async function handleSubmit() {
    if (!formData.type) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formData.type,
          title: formData.product_name.trim(),
          niche: formData.niche.trim() || null,
          targetAudience: formData.target_audience.trim() || null,
          tone: formData.tone,
          durationTarget: formData.duration_target,
          templateId: formData.template_id,
        }),
      });

      const data = (await res.json()) as { id?: string; error?: string };

      if (!res.ok || !data.id) {
        throw new Error(data.error ?? "Failed to create project.");
      }

      router.push(`/projects/${data.id}/generate`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {/* Progress bar */}
      <div className="mb-10">
        <div className="flex items-center gap-0">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                    i < step
                      ? "bg-primary text-primary-foreground"
                      : i === step
                        ? "border-2 border-primary text-primary"
                        : "border-2 border-muted text-muted-foreground"
                  }`}
                >
                  {i < step ? "✓" : i + 1}
                </div>
                <span
                  className={`mt-1 text-xs ${i === step ? "text-primary font-medium" : "text-muted-foreground"}`}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`mx-1 h-0.5 flex-1 ${i < step ? "bg-primary" : "bg-muted"}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="min-h-[320px]">
        {step === 0 && (
          <TypeStep
            selected={formData.type}
            onSelect={(t) => update("type", t)}
          />
        )}
        {step === 1 && (
          <DetailsStep
            data={{
              niche: formData.niche,
              product_name: formData.product_name,
              target_audience: formData.target_audience,
            }}
            onChange={(field, value) => update(field, value)}
          />
        )}
        {step === 2 && (
          <TemplateStep
            templates={templates}
            selected={formData.template_id}
            onSelect={(id) => update("template_id", id)}
            loading={templatesLoading}
          />
        )}
        {step === 3 && (
          <SettingsStep
            tone={formData.tone}
            duration_target={formData.duration_target}
            onToneChange={(t) => update("tone", t)}
            onDurationChange={(d) => update("duration_target", d)}
          />
        )}
        {step === 4 && (
          <ReviewStep
            data={formData}
            templates={templates}
            submitting={submitting}
            error={error}
            onSubmit={handleSubmit}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between border-t pt-6">
        <Button variant="outline" onClick={goPrev} disabled={step === 0}>
          Back
        </Button>
        {step < 4 && (
          <Button onClick={goNext} disabled={!canAdvance()}>
            {step === 3 ? "Review" : "Continue"}
          </Button>
        )}
      </div>
    </div>
  );
}
