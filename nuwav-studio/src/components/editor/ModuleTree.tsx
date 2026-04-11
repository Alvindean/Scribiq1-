"use client";
import { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Lesson, Module } from "@/types/project";
import { useProjectStore } from "@/stores/project-store";
import { useEditorStore } from "@/stores/editor-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  LayoutTemplate,
  Loader2,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { COURSE_TEMPLATES, templateLessonCount } from "@/lib/templates";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ─── Status dot colours ───────────────────────────────────────────────────────

const STATUS_COLORS: Record<Lesson["status"], string> = {
  draft: "bg-zinc-500",
  scripted: "bg-blue-500",
  voiced: "bg-amber-400",
  rendered: "bg-emerald-400",
  published: "bg-violet-500",
};

// ─── Save status indicator ────────────────────────────────────────────────────

type SaveStatus = "idle" | "saving" | "saved" | "error";

function SaveStatusBadge({ status }: { status: SaveStatus }) {
  if (status === "idle") return null;
  const label =
    status === "saving"
      ? "Saving…"
      : status === "saved"
        ? "Saved"
        : "Save failed";
  const colour =
    status === "saving"
      ? "text-zinc-400"
      : status === "saved"
        ? "text-emerald-400"
        : "text-red-400";
  return (
    <span
      role="status"
      aria-live="polite"
      className={`text-[10px] font-medium transition-opacity ${colour}`}
    >
      {label}
    </span>
  );
}

// ─── Inline text input (create / rename) ─────────────────────────────────────

function InlineInput({
  initialValue = "",
  placeholder,
  onCommit,
  onCancel,
}: {
  initialValue?: string;
  placeholder: string;
  onCommit: (value: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(initialValue);

  const commit = () => {
    const trimmed = value.trim();
    if (trimmed) onCommit(trimmed);
    else onCancel();
  };

  return (
    <input
      autoFocus
      value={value}
      placeholder={placeholder}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") commit();
        if (e.key === "Escape") onCancel();
      }}
      onBlur={commit}
      className="bg-zinc-900 border border-violet-500 rounded px-2 py-0.5 text-xs text-zinc-100 outline-none w-full"
    />
  );
}

// ─── Kebab menu ───────────────────────────────────────────────────────────────

function KebabMenu({
  onRename,
  onDelete,
}: {
  onRename: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative shrink-0" onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="p-0.5 rounded hover:bg-zinc-700 text-zinc-500 hover:text-zinc-200 transition-colors"
        aria-label="Options"
      >
        <MoreHorizontal className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-0.5 z-50 min-w-[110px] rounded border border-zinc-700 bg-zinc-900 shadow-xl py-1">
          <button
            type="button"
            className="w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onRename();
            }}
          >
            Rename
          </button>
          <button
            type="button"
            className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-zinc-800 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onDelete();
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Sortable lesson row ──────────────────────────────────────────────────────

function SortableLesson({
  lesson,
  isSelected,
  onSelect,
  onRename,
  onDelete,
  isBusy,
}: {
  lesson: Lesson;
  isSelected: boolean;
  onSelect: (lesson: Lesson) => void;
  onRename: () => void;
  onDelete: () => void;
  isBusy: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className={`w-full flex items-center gap-2 pl-7 pr-2 py-2 transition-colors group ${
          isSelected
            ? "border-l-2 border-violet-500 bg-violet-600/20 text-white"
            : "border-l-2 border-transparent hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200"
        }`}
      >
        {/* Drag handle */}
        <span
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing touch-none shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
          aria-label="Drag to reorder lesson"
        >
          <GripVertical className="w-3 h-3 text-zinc-500" />
        </span>

        <button
          type="button"
          onClick={() => onSelect(lesson)}
          className="flex-1 flex items-center gap-2 min-w-0 text-left"
        >
          <span className="flex-1 text-xs truncate">{lesson.title}</span>
          {isBusy ? (
            <Loader2 className="w-3 h-3 text-zinc-500 animate-spin shrink-0" />
          ) : (
            <span
              className={`w-2 h-2 rounded-full shrink-0 ml-auto ${STATUS_COLORS[lesson.status]}`}
              title={lesson.status}
            />
          )}
          {isSelected && (
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
          )}
        </button>

        {/* Kebab — visible on row hover */}
        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
          <KebabMenu onRename={onRename} onDelete={onDelete} />
        </span>
      </div>
    </div>
  );
}

// ─── Lesson drag overlay ──────────────────────────────────────────────────────

function LessonDragOverlay({ lesson }: { lesson: Lesson }) {
  return (
    <div className="flex items-center gap-2 pl-7 pr-3 py-2 rounded bg-zinc-800 border border-zinc-600 shadow-lg text-zinc-200 text-xs">
      <GripVertical className="w-3 h-3 text-zinc-400 shrink-0" />
      <span className="truncate">{lesson.title}</span>
      <span
        className={`w-2 h-2 rounded-full shrink-0 ml-auto ${STATUS_COLORS[lesson.status]}`}
      />
    </div>
  );
}

// ─── Sortable module header ───────────────────────────────────────────────────

function SortableModule({
  mod,
  isCollapsed,
  onToggle,
  onRename,
  onDelete,
  onAddLesson,
  isBusy,
  children,
}: {
  mod: Module & { lessons: Lesson[] };
  isCollapsed: boolean;
  onToggle: () => void;
  onRename: () => void;
  onDelete: () => void;
  onAddLesson: () => void;
  isBusy: boolean;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: mod.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {/* Module header row */}
      <div className="w-full flex items-center gap-1 px-2 py-2 hover:bg-zinc-800/40 transition-colors group">
        {/* Drag handle */}
        <span
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing touch-none shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Drag to reorder module"
        >
          <GripVertical className="w-3.5 h-3.5 text-zinc-500" />
        </span>

        {/* Collapse toggle + title */}
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-1.5 flex-1 min-w-0 text-left"
        >
          <span className="text-zinc-500 group-hover:text-zinc-300 transition-colors shrink-0">
            {isCollapsed ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </span>
          <span className="flex-1 text-xs font-semibold text-zinc-300 truncate">
            {mod.title}
          </span>
          {isBusy ? (
            <Loader2 className="w-3 h-3 text-zinc-500 animate-spin shrink-0" />
          ) : (
            <span className="text-xs text-zinc-600 shrink-0">
              {mod.lessons.length}
            </span>
          )}
        </button>

        {/* Add-lesson button — visible on hover */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAddLesson();
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-zinc-700 text-zinc-500 hover:text-zinc-200 shrink-0"
          title="Add lesson"
          aria-label="Add lesson"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>

        {/* Kebab — visible on hover */}
        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
          <KebabMenu onRename={onRename} onDelete={onDelete} />
        </span>
      </div>

      {/* Lessons */}
      {!isCollapsed && children}
    </div>
  );
}

// ─── Module drag overlay ──────────────────────────────────────────────────────

function ModuleDragOverlay({
  mod,
}: {
  mod: Module & { lessons: Lesson[] };
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded bg-zinc-800 border border-zinc-600 shadow-lg">
      <GripVertical className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
      <span className="flex-1 text-xs font-semibold text-zinc-200 truncate">
        {mod.title}
      </span>
      <span className="text-xs text-zinc-500">{mod.lessons.length}</span>
    </div>
  );
}

// ─── Empty-state template picker ─────────────────────────────────────────────

// 4 quick-start templates shown when the project has no modules yet.
const QUICK_START_IDS = [
  "how-to-course",
  "mini-course",
  "vsl-course-combo",
  "7-day-challenge",
];
const QUICK_START_TEMPLATES = COURSE_TEMPLATES.filter((t) =>
  QUICK_START_IDS.includes(t.id)
);

function EmptyStateTemplatePicker({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [applying, setApplying] = useState<string | null>(null);
  const [applyError, setApplyError] = useState<string | null>(null);

  const handleApply = useCallback(
    async (templateId: string) => {
      setApplying(templateId);
      setApplyError(null);
      try {
        const res = await fetch(
          `/api/projects/${projectId}/apply-template`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ templateId }),
          }
        );
        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          throw new Error(data.error ?? "Failed to apply template");
        }
        // Refresh the page so the server component re-fetches the modules.
        router.refresh();
      } catch (err) {
        setApplyError(
          err instanceof Error ? err.message : "Something went wrong"
        );
        setApplying(null);
      }
    },
    [projectId, router]
  );

  return (
    <div className="px-3 py-4 space-y-3">
      <div className="flex items-center gap-1.5 text-zinc-400">
        <LayoutTemplate className="w-3.5 h-3.5 shrink-0" />
        <p className="text-[11px] font-semibold uppercase tracking-wider">
          Choose a template
        </p>
      </div>
      <p className="text-[10px] text-zinc-500 leading-relaxed">
        Get started faster with a ready-made structure.
      </p>

      <div className="space-y-2">
        {QUICK_START_TEMPLATES.map((t) => {
          const lessonCount = templateLessonCount(t);
          const isApplying = applying === t.id;

          return (
            <button
              key={t.id}
              type="button"
              disabled={applying !== null}
              onClick={() => void handleApply(t.id)}
              className="w-full text-left rounded-md border border-zinc-700 bg-zinc-900 hover:border-violet-500 hover:bg-violet-900/10 transition-colors px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-medium text-zinc-300 group-hover:text-white transition-colors leading-snug truncate">
                  {t.name}
                </span>
                {isApplying ? (
                  <Loader2 className="w-3 h-3 text-violet-400 animate-spin shrink-0" />
                ) : (
                  <span className="text-[10px] text-zinc-600 shrink-0 tabular-nums">
                    {t.modules.length}m&nbsp;&middot;&nbsp;{lessonCount}l
                  </span>
                )}
              </div>
              <p className="text-[10px] text-zinc-600 mt-0.5 line-clamp-2 leading-relaxed">
                {t.description}
              </p>
            </button>
          );
        })}
      </div>

      {applyError && (
        <p className="text-[10px] text-red-400 leading-snug">{applyError}</p>
      )}

      <p className="text-[10px] text-zinc-600 text-center pt-1">
        or add a module manually with the button below
      </p>
    </div>
  );
}

// ─── Main tree ────────────────────────────────────────────────────────────────

export function ModuleTree() {
  const {
    project,
    modules,
    reorderLessons,
    reorderModules,
    addModule,
    removeModule,
    renameModule,
    addLesson,
    removeLesson,
    renameLesson,
  } = useProjectStore();
  const { selectedLessonId, setSelectedLesson } = useEditorStore();

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  // Track what is being dragged for the overlay
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeLessonModuleId, setActiveLessonModuleId] = useState<
    string | null
  >(null);

  // Busy set: IDs of modules/lessons currently being mutated
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());
  const markBusy = (id: string) =>
    setBusyIds((s) => new Set(s).add(id));
  const markIdle = (id: string) =>
    setBusyIds((s) => {
      const next = new Set(s);
      next.delete(id);
      return next;
    });

  // Inline input state
  const [addingModuleInput, setAddingModuleInput] = useState(false);
  const [addingLessonInModule, setAddingLessonInModule] = useState<string | null>(null);
  const [renamingModuleId, setRenamingModuleId] = useState<string | null>(null);
  const [renamingLessonId, setRenamingLessonId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const toggleModule = (moduleId: string) => {
    setCollapsed((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  // Helper: show "Saving…" → "Saved" / "Save failed" for reorder ops
  const withSaveIndicator = useCallback(
    async (persist: () => Promise<void>, onError: () => void) => {
      setSaveStatus("saving");
      try {
        await persist();
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch {
        onError();
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    },
    []
  );

  // ── Module CRUD ─────────────────────────────────────────────────────────────

  const handleCreateModule = async (title: string) => {
    if (!project?.id) return;
    setAddingModuleInput(false);

    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      id: tempId,
      projectId: project.id,
      title,
      order: modules.length,
      type: "lesson" as const,
      createdAt: new Date(),
      lessons: [],
    };
    addModule(optimistic);
    markBusy(tempId);

    try {
      const res = await fetch("/api/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id, title, type: "lesson" }),
      });
      if (!res.ok) throw new Error("Failed to create module");
      const data = (await res.json()) as {
        module: Module & { lessons: Lesson[] };
      };
      removeModule(tempId);
      addModule(data.module);
    } catch {
      removeModule(tempId);
    } finally {
      markIdle(tempId);
    }
  };

  const handleRenameModule = async (moduleId: string, title: string) => {
    setRenamingModuleId(null);
    const mod = modules.find((m) => m.id === moduleId);
    if (!mod) return;
    const oldTitle = mod.title;
    renameModule(moduleId, title);
    markBusy(moduleId);

    try {
      const res = await fetch(`/api/modules/${moduleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error("Failed to rename module");
    } catch {
      renameModule(moduleId, oldTitle);
    } finally {
      markIdle(moduleId);
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    const mod = modules.find((m) => m.id === moduleId);
    if (!mod) return;
    if (
      !window.confirm(
        `Delete module "${mod.title}" and all its lessons? This cannot be undone.`
      )
    )
      return;

    const snapshot = mod;
    removeModule(moduleId);
    markBusy(moduleId);

    try {
      const res = await fetch(`/api/modules/${moduleId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete module");
    } catch {
      addModule(snapshot);
    } finally {
      markIdle(moduleId);
    }
  };

  // ── Lesson CRUD ─────────────────────────────────────────────────────────────

  const handleCreateLesson = async (moduleId: string, title: string) => {
    if (!project?.id) return;
    setAddingLessonInModule(null);
    setCollapsed((prev) => ({ ...prev, [moduleId]: false }));

    const mod = modules.find((m) => m.id === moduleId);
    if (!mod) return;

    const tempId = `temp-${Date.now()}`;
    const optimistic: Lesson = {
      id: tempId,
      moduleId,
      projectId: project.id,
      title,
      order: mod.lessons.length,
      script: null,
      slides: [],
      voiceoverUrl: null,
      videoUrl: null,
      thumbnailUrl: null,
      durationSeconds: null,
      visualSettings: null,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    addLesson(moduleId, optimistic);
    markBusy(tempId);

    try {
      const res = await fetch("/api/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId, projectId: project.id, title }),
      });
      if (!res.ok) throw new Error("Failed to create lesson");
      const data = (await res.json()) as { lesson: Lesson };
      removeLesson(tempId);
      addLesson(moduleId, data.lesson);
    } catch {
      removeLesson(tempId);
    } finally {
      markIdle(tempId);
    }
  };

  const handleRenameLesson = async (lessonId: string, title: string) => {
    setRenamingLessonId(null);
    let oldTitle = "";
    for (const mod of modules) {
      const found = mod.lessons.find((l) => l.id === lessonId);
      if (found) {
        oldTitle = found.title;
        break;
      }
    }
    renameLesson(lessonId, title);
    markBusy(lessonId);

    try {
      const res = await fetch(`/api/lessons/${lessonId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error("Failed to rename lesson");
    } catch {
      renameLesson(lessonId, oldTitle);
    } finally {
      markIdle(lessonId);
    }
  };

  const handleDeleteLesson = async (lesson: Lesson) => {
    if (
      !window.confirm(
        `Delete lesson "${lesson.title}"? This cannot be undone.`
      )
    )
      return;

    const { moduleId } = lesson;
    removeLesson(lesson.id);
    if (selectedLessonId === lesson.id) setSelectedLesson(null);
    markBusy(lesson.id);

    try {
      const res = await fetch(`/api/lessons/${lesson.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete lesson");
    } catch {
      addLesson(moduleId, lesson);
    } finally {
      markIdle(lesson.id);
    }
  };

  // ── Module-level drag handlers ─────────────────────────────────────────────

  const handleModuleDragStart = (event: DragStartEvent) => {
    setActiveModuleId(event.active.id as string);
  };

  const handleModuleDragEnd = (event: DragEndEvent) => {
    setActiveModuleId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const ids = modules.map((m) => m.id);
    const oldIdx = ids.indexOf(active.id as string);
    const newIdx = ids.indexOf(over.id as string);
    if (oldIdx === -1 || newIdx === -1) return;

    const newOrder = arrayMove(ids, oldIdx, newIdx);
    const previousOrder = [...ids];
    reorderModules(newOrder);

    if (!project?.id) return;
    const projectId = project.id;

    void withSaveIndicator(
      async () => {
        const res = await fetch(
          `/api/projects/${projectId}/modules/reorder`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderedIds: newOrder }),
          }
        );
        if (!res.ok) throw new Error("Failed to persist module order");
      },
      () => reorderModules(previousOrder)
    );
  };

  // ── Lesson-level drag handlers ─────────────────────────────────────────────

  const handleLessonDragStart = (
    event: DragStartEvent,
    moduleId: string
  ) => {
    setActiveLessonId(event.active.id as string);
    setActiveLessonModuleId(moduleId);
  };

  const handleLessonDragEnd = (event: DragEndEvent, moduleId: string) => {
    setActiveLessonId(null);
    setActiveLessonModuleId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const mod = modules.find((m) => m.id === moduleId);
    if (!mod) return;

    const ids = mod.lessons.map((l) => l.id);
    const oldIdx = ids.indexOf(active.id as string);
    const newIdx = ids.indexOf(over.id as string);
    if (oldIdx === -1 || newIdx === -1) return;

    const newOrder = arrayMove(ids, oldIdx, newIdx);
    const previousOrder = [...ids];
    reorderLessons(moduleId, newOrder);

    if (!project?.id) return;
    const projectId = project.id;

    void withSaveIndicator(
      async () => {
        const res = await fetch(
          `/api/projects/${projectId}/lessons/reorder`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ moduleId, orderedIds: newOrder }),
          }
        );
        if (!res.ok) throw new Error("Failed to persist lesson order");
      },
      () => reorderLessons(moduleId, previousOrder)
    );
  };

  // Overlay items
  const activeModule = activeModuleId
    ? modules.find((m) => m.id === activeModuleId)
    : null;

  const activeLesson =
    activeLessonId && activeLessonModuleId
      ? modules
          .find((m) => m.id === activeLessonModuleId)
          ?.lessons.find((l) => l.id === activeLessonId)
      : null;

  const moduleIds = modules.map((m) => m.id);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-zinc-800 shrink-0 flex items-center justify-between">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Modules &amp; Lessons
        </p>
        <SaveStatusBadge status={saveStatus} />
      </div>

      <ScrollArea className="flex-1">
        <div className="py-2">
          {/* Outer DndContext handles module reordering */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleModuleDragStart}
            onDragEnd={handleModuleDragEnd}
          >
            <SortableContext
              items={moduleIds}
              strategy={verticalListSortingStrategy}
            >
              {modules.map((mod) => {
                const isCollapsed = collapsed[mod.id] ?? false;
                const lessonIds = mod.lessons.map((l) => l.id);

                return (
                  <SortableModule
                    key={mod.id}
                    mod={mod}
                    isCollapsed={isCollapsed}
                    onToggle={() => toggleModule(mod.id)}
                    onRename={() => setRenamingModuleId(mod.id)}
                    onDelete={() => void handleDeleteModule(mod.id)}
                    onAddLesson={() => {
                      setAddingLessonInModule(mod.id);
                      setCollapsed((prev) => ({
                        ...prev,
                        [mod.id]: false,
                      }));
                    }}
                    isBusy={busyIds.has(mod.id)}
                  >
                    {/* Module rename inline input */}
                    {renamingModuleId === mod.id && (
                      <div className="px-3 py-1">
                        <InlineInput
                          initialValue={mod.title}
                          placeholder="Module title"
                          onCommit={(v) =>
                            void handleRenameModule(mod.id, v)
                          }
                          onCancel={() => setRenamingModuleId(null)}
                        />
                      </div>
                    )}

                    {/* Inner DndContext handles lesson reordering */}
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragStart={(e) => handleLessonDragStart(e, mod.id)}
                      onDragEnd={(e) => handleLessonDragEnd(e, mod.id)}
                    >
                      <SortableContext
                        items={lessonIds}
                        strategy={verticalListSortingStrategy}
                      >
                        {mod.lessons.map((lesson) =>
                          renamingLessonId === lesson.id ? (
                            <div
                              key={lesson.id}
                              className="pl-7 pr-3 py-1"
                            >
                              <InlineInput
                                initialValue={lesson.title}
                                placeholder="Lesson title"
                                onCommit={(v) =>
                                  void handleRenameLesson(lesson.id, v)
                                }
                                onCancel={() => setRenamingLessonId(null)}
                              />
                            </div>
                          ) : (
                            <SortableLesson
                              key={lesson.id}
                              lesson={lesson}
                              isSelected={lesson.id === selectedLessonId}
                              onSelect={setSelectedLesson}
                              onRename={() =>
                                setRenamingLessonId(lesson.id)
                              }
                              onDelete={() =>
                                void handleDeleteLesson(lesson)
                              }
                              isBusy={busyIds.has(lesson.id)}
                            />
                          )
                        )}
                      </SortableContext>

                      {/* Lesson drag overlay */}
                      <DragOverlay dropAnimation={null}>
                        {activeLesson &&
                        activeLessonModuleId === mod.id ? (
                          <LessonDragOverlay lesson={activeLesson} />
                        ) : null}
                      </DragOverlay>
                    </DndContext>

                    {/* Add-lesson inline input */}
                    {addingLessonInModule === mod.id && (
                      <div className="pl-7 pr-3 py-1">
                        <InlineInput
                          placeholder="New lesson title…"
                          onCommit={(v) =>
                            void handleCreateLesson(mod.id, v)
                          }
                          onCancel={() => setAddingLessonInModule(null)}
                        />
                      </div>
                    )}
                  </SortableModule>
                );
              })}
            </SortableContext>

            {/* Module drag overlay */}
            <DragOverlay dropAnimation={null}>
              {activeModule ? (
                <ModuleDragOverlay mod={activeModule} />
              ) : null}
            </DragOverlay>
          </DndContext>

          {modules.length === 0 && !addingModuleInput && project?.id && (
            <EmptyStateTemplatePicker projectId={project.id} />
          )}

          {/* Add module input or button */}
          <div className="px-3 pt-2 pb-1">
            {addingModuleInput ? (
              <InlineInput
                placeholder="New module title…"
                onCommit={(v) => void handleCreateModule(v)}
                onCancel={() => setAddingModuleInput(false)}
              />
            ) : (
              <button
                type="button"
                onClick={() => setAddingModuleInput(true)}
                className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded text-xs text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 shrink-0" />
                Add Module
              </button>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
