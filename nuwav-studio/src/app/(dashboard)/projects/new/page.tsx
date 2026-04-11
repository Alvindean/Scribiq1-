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
import { Badge } from "@/components/ui/badge";
import { COURSE_TEMPLATES, templateLessonCount } from "@/lib/templates";
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

interface StepErrors {
  type?: string;
  niche?: string;
  product_name?: string;
  target_audience?: string;
}

const STEPS = ["Type", "Template", "Details", "Settings", "Review"] as const;
type Step = 0 | 1 | 2 | 3 | 4;

// ─── Progress indicator ───────────────────────────────────────────────────────

function StepIndicator({ step }: { step: Step }) {
  return (
    <div className="mb-10">
      {/* Mobile compact counter */}
      <p className="sm:hidden text-xs text-muted-foreground mb-3">
        Step {step + 1} of {STEPS.length} — {STEPS[step]}
      </p>

      <div className="flex items-center gap-0">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
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
                className={`hidden sm:inline mt-1 text-xs truncate max-w-[4.5rem] text-center transition-colors ${
                  i === step
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-1 h-0.5 flex-1 transition-colors ${
                  i < step ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Thin progress bar underneath */}
      <div className="mt-4 h-1 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>
    </div>
  );
}

// ─── Step 1 — Type ────────────────────────────────────────────────────────────

const PROJECT_TYPES: {
  type: ProjectType;
  label: string;
  icon: string;
  description: string;
  features: string[];
  badge?: string;
}[] = [
  {
    type: "course",
    label: "Course",
    icon: "🎓",
    description: "Build a structured online course with AI-generated scripts and voiceover.",
    features: ["Modules & lessons", "AI scripts", "Voiceover generation", "Progress tracking"],
  },
  {
    type: "vsl",
    label: "VSL",
    icon: "📹",
    description: "Create a high-converting video sales letter in minutes.",
    features: ["Persuasive copy", "Hook + offer + CTA", "Proven frameworks", "One-take flow"],
    badge: "High ROI",
  },
  {
    type: "hybrid",
    label: "Hybrid",
    icon: "⚡",
    description: "Combine course content with VSL-style sales sections for maximum impact.",
    features: ["Course + sales page", "Upsell sequences", "Flexible structure", "All-in-one"],
    badge: "Popular",
  },
];

function TypeStep({
  selected,
  onSelect,
  error,
}: {
  selected: ProjectType | null;
  onSelect: (t: ProjectType) => void;
  error?: string;
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
        {PROJECT_TYPES.map(({ type, label, icon, description, features, badge }) => (
          <Card
            key={type}
            className={`relative cursor-pointer border-2 transition-all hover:shadow-md ${
              selected === type
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => onSelect(type)}
          >
            {badge && (
              <div className="absolute -top-2.5 right-3">
                <Badge variant="default" className="text-[10px] px-2 py-0.5">
                  {badge}
                </Badge>
              </div>
            )}
            <CardHeader className="pb-3">
              <div className="text-4xl mb-3">{icon}</div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">{label}</CardTitle>
                {selected === type && (
                  <span className="text-primary text-sm font-medium">✓</span>
                )}
              </div>
              <CardDescription className="text-sm leading-relaxed">
                {description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-1.5">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="text-primary font-bold leading-none">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {error && (
        <p className="text-sm text-destructive mt-2" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Step 2 — Template ────────────────────────────────────────────────────────

function TemplateStep({
  projectType,
  selected,
  onSelect,
  onSkip,
}: {
  projectType: ProjectType | null;
  selected: string | null;
  onSelect: (id: string) => void;
  onSkip: () => void;
}) {
  // Filter to templates that match the chosen project type (or all if not set),
  // excluding the "blank" sentinel (handled by the Skip button).
  const visibleTemplates = COURSE_TEMPLATES.filter(
    (t) =>
      t.id !== "blank" &&
      (!projectType || t.type === projectType)
  );

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Choose a template</h2>
        <p className="text-muted-foreground mt-1">
          Pick a ready-made structure to get started faster, or skip to build from scratch.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleTemplates.map((t) => {
          const lessonCount = templateLessonCount(t);
          const moduleCount = t.modules.length;
          const isSelected = selected === t.id;

          return (
            <Card
              key={t.id}
              className={`relative flex flex-col border-2 transition-all hover:shadow-md ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {t.badge && (
                <div className="absolute -top-2.5 right-3">
                  <Badge variant="default" className="text-[10px] px-2 py-0.5">
                    {t.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base leading-snug">{t.name}</CardTitle>
                  {isSelected && (
                    <span className="text-primary text-sm font-semibold shrink-0">✓</span>
                  )}
                </div>
                {/* Module / lesson count badges */}
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                    {moduleCount} {moduleCount === 1 ? "module" : "modules"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                    {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full capitalize">
                    {t.type}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pt-0 flex-1 flex flex-col justify-between gap-3">
                <CardDescription className="text-xs leading-relaxed">
                  {t.description}
                </CardDescription>

                <Button
                  size="sm"
                  variant={isSelected ? "default" : "outline"}
                  className="w-full mt-1"
                  onClick={() => onSelect(t.id)}
                >
                  {isSelected ? "Selected" : "Use Template"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Skip link */}
      <div className="pt-2 text-center">
        <button
          type="button"
          onClick={onSkip}
          className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
        >
          Skip — Start Blank
        </button>
      </div>
    </div>
  );
}

// ─── Step 3 — Details ─────────────────────────────────────────────────────────

const CHAR_LIMITS = {
  product_name: 80,
  niche: 60,
  target_audience: 120,
} as const;

function CharCounter({ value, max }: { value: string; max: number }) {
  const remaining = max - value.length;
  const pct = value.length / max;
  // Suppress unused variable lint warning
  void remaining;
  return (
    <span
      className={`text-xs tabular-nums ${
        pct >= 1
          ? "text-destructive font-medium"
          : pct >= 0.85
            ? "text-amber-500"
            : "text-muted-foreground"
      }`}
    >
      {value.length}/{max}
    </span>
  );
}

function DetailsStep({
  data,
  onChange,
  errors,
}: {
  data: Pick<FormData, "niche" | "product_name" | "target_audience">;
  onChange: (
    field: "niche" | "product_name" | "target_audience",
    value: string
  ) => void;
  errors: StepErrors;
}) {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Project details</h2>
        <p className="text-muted-foreground mt-1">
          Tell us about your product and audience.
        </p>
      </div>

      <div className="space-y-5">
        {/* Product name */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="product_name">
              Product name <span className="text-destructive">*</span>
            </Label>
            <CharCounter value={data.product_name} max={CHAR_LIMITS.product_name} />
          </div>
          <Input
            id="product_name"
            placeholder="e.g. The Ultimate Growth Blueprint"
            value={data.product_name}
            maxLength={CHAR_LIMITS.product_name}
            onChange={(e) => onChange("product_name", e.target.value)}
            className={errors.product_name ? "border-destructive focus-visible:ring-destructive" : ""}
            aria-describedby={errors.product_name ? "product_name-error" : undefined}
          />
          {errors.product_name && (
            <p id="product_name-error" className="text-xs text-destructive" role="alert">
              {errors.product_name}
            </p>
          )}
        </div>

        {/* Niche */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="niche">
              Niche <span className="text-destructive">*</span>
            </Label>
            <CharCounter value={data.niche} max={CHAR_LIMITS.niche} />
          </div>
          <Input
            id="niche"
            placeholder="e.g. Digital Marketing, Fitness, Personal Finance"
            value={data.niche}
            maxLength={CHAR_LIMITS.niche}
            onChange={(e) => onChange("niche", e.target.value)}
            className={errors.niche ? "border-destructive focus-visible:ring-destructive" : ""}
            aria-describedby={errors.niche ? "niche-error" : undefined}
          />
          {errors.niche && (
            <p id="niche-error" className="text-xs text-destructive" role="alert">
              {errors.niche}
            </p>
          )}
        </div>

        {/* Target audience */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="target_audience">
              Target audience <span className="text-destructive">*</span>
            </Label>
            <CharCounter value={data.target_audience} max={CHAR_LIMITS.target_audience} />
          </div>
          <Input
            id="target_audience"
            placeholder="e.g. Small business owners aged 25–45 looking to scale online"
            value={data.target_audience}
            maxLength={CHAR_LIMITS.target_audience}
            onChange={(e) => onChange("target_audience", e.target.value)}
            className={errors.target_audience ? "border-destructive focus-visible:ring-destructive" : ""}
            aria-describedby={errors.target_audience ? "target_audience-error" : undefined}
          />
          {errors.target_audience && (
            <p id="target_audience-error" className="text-xs text-destructive" role="alert">
              {errors.target_audience}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Step 4 — Settings ────────────────────────────────────────────────────────

const TONES: { value: Tone; label: string; description: string }[] = [
  { value: "professional", label: "Professional", description: "Polished & credible" },
  { value: "casual", label: "Casual", description: "Friendly & approachable" },
  { value: "energetic", label: "Energetic", description: "High energy & motivating" },
  { value: "authoritative", label: "Authoritative", description: "Bold & commanding" },
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
        <Label>Tone of voice</Label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TONES.map(({ value, label, description }) => (
            <button
              key={value}
              type="button"
              onClick={() => onToneChange(value)}
              className={`rounded-lg border-2 px-4 py-3 text-left transition-all hover:shadow-sm ${
                tone === value
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
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

const TYPE_META: Record<
  ProjectType,
  { icon: string; label: string; color: string }
> = {
  course: { icon: "🎓", label: "Course", color: "bg-blue-50 text-blue-700 border-blue-200" },
  vsl: { icon: "📹", label: "VSL", color: "bg-purple-50 text-purple-700 border-purple-200" },
  hybrid: { icon: "⚡", label: "Hybrid", color: "bg-amber-50 text-amber-700 border-amber-200" },
};

const TONE_LABELS: Record<Tone, string> = {
  professional: "Professional",
  casual: "Casual",
  energetic: "Energetic",
  authoritative: "Authoritative",
};

function ReviewStep({
  data,
  submitting,
  error,
  onSubmit,
}: {
  data: FormData;
  submitting: boolean;
  error: string | null;
  onSubmit: () => void;
}) {
  const selectedTemplate =
    data.template_id
      ? COURSE_TEMPLATES.find((t) => t.id === data.template_id)
      : null;
  const typeMeta = data.type ? TYPE_META[data.type] : null;

  const summaryItems: { icon: string; label: string; value: string }[] = [
    {
      icon: "📝",
      label: "Product name",
      value: data.product_name || "—",
    },
    {
      icon: "🏷️",
      label: "Niche",
      value: data.niche || "—",
    },
    {
      icon: "👥",
      label: "Target audience",
      value: data.target_audience || "—",
    },
    {
      icon: "📄",
      label: "Template",
      value: selectedTemplate ? selectedTemplate.name : "Blank (from scratch)",
    },
    {
      icon: "🎙️",
      label: "Tone",
      value: TONE_LABELS[data.tone],
    },
    {
      icon: "⏱️",
      label: "Target duration",
      value: `${data.duration_target} minutes`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Review &amp; create</h2>
        <p className="text-muted-foreground mt-1">
          Confirm your project settings before the AI starts generating.
        </p>
      </div>

      {/* Type badge */}
      {typeMeta && (
        <div
          className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium ${typeMeta.color}`}
        >
          <span>{typeMeta.icon}</span>
          <span>{typeMeta.label} project</span>
        </div>
      )}

      {/* Summary card */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <dl>
            {summaryItems.map(({ icon, label, value }, idx) => (
              <div
                key={label}
                className={`flex items-start gap-3 px-5 py-3.5 ${
                  idx !== summaryItems.length - 1 ? "border-b" : ""
                }`}
              >
                <span className="text-base mt-0.5 shrink-0">{icon}</span>
                <div className="flex-1 min-w-0">
                  <dt className="text-xs text-muted-foreground mb-0.5">{label}</dt>
                  <dd className="text-sm font-medium break-words">{value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      {error && (
        <p
          className="text-sm text-destructive bg-destructive/10 rounded-md px-4 py-3"
          role="alert"
        >
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

// ─── Loading overlay ──────────────────────────────────────────────────────────

function LoadingOverlay({ type }: { type: ProjectType | null }) {
  const baseMessage =
    type === "vsl"
      ? "AI is crafting your sales script…"
      : type === "hybrid"
        ? "AI is building your hybrid framework…"
        : "AI is planning your course structure…";

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-background/95 backdrop-blur-sm">
      {/* Animated spinner */}
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        <div className="absolute inset-2 animate-spin rounded-full border-4 border-primary/10 border-b-primary/40 [animation-duration:1.5s]" />
      </div>

      <div className="text-center max-w-xs space-y-2">
        <p className="text-lg font-semibold">{baseMessage}</p>
        <p className="text-sm text-muted-foreground">
          This usually takes 5–15 seconds. Hang tight!
        </p>
      </div>

      {/* Animated dots */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validateStep(step: Step, data: FormData): StepErrors {
  const errors: StepErrors = {};

  if (step === 0) {
    if (!data.type) errors.type = "Please select a project type to continue.";
  }

  if (step === 2) {
    if (!data.product_name.trim())
      errors.product_name = "Product name is required.";
    if (!data.niche.trim())
      errors.niche = "Niche is required.";
    if (!data.target_audience.trim())
      errors.target_audience = "Target audience is required.";
  }

  return errors;
}

// ─── Wizard shell ─────────────────────────────────────────────────────────────

export default function NewProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stepErrors, setStepErrors] = useState<StepErrors>({});

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
    // Clear the error for the field being updated
    if (key in stepErrors) {
      setStepErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  async function goNext() {
    const errors = validateStep(step, formData);
    if (Object.keys(errors).length > 0) {
      setStepErrors(errors);
      return;
    }
    setStepErrors({});

    if (step < 4) setStep(((step + 1) as Step));
  }

  function goPrev() {
    if (step > 0) {
      setStepErrors({});
      setStep(((step - 1) as Step));
    }
  }

  /** Called when user clicks "Skip — Start Blank" on the template step. */
  function skipTemplate() {
    update("template_id", null);
    setStep(2);
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
    <>
      {/* Full-screen loading overlay when submitting */}
      {submitting && <LoadingOverlay type={formData.type} />}

      <div className="mx-auto max-w-3xl px-4 py-10">
        <StepIndicator step={step} />

        {/* Step content */}
        <div className="min-h-[340px]">
          {step === 0 && (
            <TypeStep
              selected={formData.type}
              onSelect={(t) => {
                update("type", t);
                setStepErrors({});
              }}
              error={stepErrors.type}
            />
          )}
          {step === 1 && (
            <TemplateStep
              projectType={formData.type}
              selected={formData.template_id}
              onSelect={(id) => update("template_id", id)}
              onSkip={skipTemplate}
            />
          )}
          {step === 2 && (
            <DetailsStep
              data={{
                niche: formData.niche,
                product_name: formData.product_name,
                target_audience: formData.target_audience,
              }}
              onChange={(field, value) => update(field, value)}
              errors={stepErrors}
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
              submitting={submitting}
              error={error}
              onSubmit={handleSubmit}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between border-t pt-6">
          <Button
            variant="outline"
            onClick={goPrev}
            disabled={step === 0 || submitting}
          >
            Back
          </Button>
          {step < 4 && (
            <Button onClick={goNext} disabled={submitting}>
              {step === 3 ? "Review" : "Continue"}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
