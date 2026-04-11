"use client";
import { useState, useCallback } from "react";
import type { Lesson, Module } from "@/types/project";
import { useProjectStore } from "@/stores/project-store";
import { useEditorStore } from "@/stores/editor-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronRight, GripVertical } from "lucide-react";
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

// ─── Sortable lesson row ──────────────────────────────────────────────────────

function SortableLesson({
  lesson,
  isSelected,
  onSelect,
}: {
  lesson: Lesson;
  isSelected: boolean;
  onSelect: (lesson: Lesson) => void;
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
      <button
        type="button"
        onClick={() => onSelect(lesson)}
        className={`w-full flex items-center gap-2 pl-7 pr-3 py-2 text-left transition-colors cursor-pointer group ${
          isSelected
            ? "border-l-2 border-violet-500 bg-violet-600/20 text-white"
            : "border-l-2 border-transparent hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200"
        }`}
      >
        {/* Drag handle — only visible on row hover */}
        <span
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing touch-none shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
          aria-label="Drag to reorder lesson"
        >
          <GripVertical className="w-3 h-3 text-zinc-500" />
        </span>
        <span className="flex-1 text-xs truncate">{lesson.title}</span>
        <span
          className={`w-2 h-2 rounded-full shrink-0 ml-auto ${STATUS_COLORS[lesson.status]}`}
          title={lesson.status}
        />
        {isSelected && (
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
        )}
      </button>
    </div>
  );
}

// ─── Lesson overlay (shown while dragging) ───────────────────────────────────

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
  children,
}: {
  mod: Module & { lessons: Lesson[] };
  isCollapsed: boolean;
  onToggle: () => void;
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
      {/* Module header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-3 py-2 text-left cursor-pointer hover:bg-zinc-800/40 transition-colors group"
      >
        {/* Drag handle — only visible on row hover */}
        <span
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing touch-none shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
          aria-label="Drag to reorder module"
        >
          <GripVertical className="w-3.5 h-3.5 text-zinc-500" />
        </span>
        <span className="text-zinc-500 group-hover:text-zinc-300 transition-colors">
          {isCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </span>
        <span className="flex-1 text-xs font-semibold text-zinc-300 truncate">
          {mod.title}
        </span>
        <span className="text-xs text-zinc-600">{mod.lessons.length}</span>
      </button>

      {/* Lessons list */}
      {!isCollapsed && children}
    </div>
  );
}

// ─── Module overlay (shown while dragging a module) ──────────────────────────

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

// ─── Main tree ────────────────────────────────────────────────────────────────

export function ModuleTree() {
  const { project, modules, reorderLessons, reorderModules } =
    useProjectStore();
  const { selectedLessonId, setSelectedLesson } = useEditorStore();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  // Save status for the inline badge
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  // Track what is being dragged for the overlay
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  // Which module context a lesson drag is happening in
  const [activeLessonModuleId, setActiveLessonModuleId] = useState<
    string | null
  >(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const toggleModule = (moduleId: string) => {
    setCollapsed((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  // Helper: show "Saving…" then "Saved" / "Save failed"
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

  // ── Module-level drag handlers ────────────────────────────────────────────

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

    // Snapshot before optimistic update so we can revert
    const previousOrder = [...ids];

    reorderModules(newOrder);

    if (!project?.id) return;

    const projectId = project.id;

    void withSaveIndicator(
      async () => {
        const res = await fetch("/api/modules/reorder", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId, orderedIds: newOrder }),
        });
        if (!res.ok) throw new Error("Failed to persist module order");
      },
      () => {
        // Revert optimistic update
        reorderModules(previousOrder);
      }
    );
  };

  // ── Lesson-level drag handlers (one set; moduleId captured at start) ──────

  const handleLessonDragStart = (
    event: DragStartEvent,
    moduleId: string
  ) => {
    setActiveLessonId(event.active.id as string);
    setActiveLessonModuleId(moduleId);
  };

  const handleLessonDragEnd = (
    event: DragEndEvent,
    moduleId: string
  ) => {
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

    // Snapshot before optimistic update so we can revert
    const previousOrder = [...ids];

    reorderLessons(moduleId, newOrder);

    void withSaveIndicator(
      async () => {
        const res = await fetch("/api/lessons/reorder", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ moduleId, orderedIds: newOrder }),
        });
        if (!res.ok) throw new Error("Failed to persist lesson order");
      },
      () => {
        // Revert optimistic update
        reorderLessons(moduleId, previousOrder);
      }
    );
  };

  // Resolve overlay items
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
                  >
                    {/* Inner DndContext handles lesson reordering within this module */}
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
                        {mod.lessons.map((lesson) => (
                          <SortableLesson
                            key={lesson.id}
                            lesson={lesson}
                            isSelected={lesson.id === selectedLessonId}
                            onSelect={setSelectedLesson}
                          />
                        ))}
                      </SortableContext>

                      {/* Lesson drag overlay */}
                      <DragOverlay dropAnimation={null}>
                        {activeLesson && activeLessonModuleId === mod.id ? (
                          <LessonDragOverlay lesson={activeLesson} />
                        ) : null}
                      </DragOverlay>
                    </DndContext>
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

          {modules.length === 0 && (
            <p className="text-xs text-zinc-600 text-center py-8 px-4">
              No modules yet. Generate content to get started.
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
