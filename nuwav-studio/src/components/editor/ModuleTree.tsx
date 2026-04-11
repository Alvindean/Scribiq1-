"use client";
import { useState } from "react";
import type { Lesson } from "@/types/project";
import { useProjectStore } from "@/stores/project-store";
import { useEditorStore } from "@/stores/editor-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronRight, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
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
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
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
        {/* Drag handle */}
        <span
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing touch-none shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-3 h-3 text-zinc-700 group-hover:text-zinc-500" />
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

// ─── Main tree ────────────────────────────────────────────────────────────────

export function ModuleTree() {
  const { modules, reorderLessons } = useProjectStore();
  const { selectedLessonId, setSelectedLesson } = useEditorStore();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const toggleModule = (moduleId: string) => {
    setCollapsed((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const handleDragEnd = (event: DragEndEvent, moduleId: string) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const mod = modules.find((m) => m.id === moduleId);
    if (!mod) return;

    const ids = mod.lessons.map((l) => l.id);
    const oldIdx = ids.indexOf(active.id as string);
    const newIdx = ids.indexOf(over.id as string);
    if (oldIdx === -1 || newIdx === -1) return;

    reorderLessons(moduleId, arrayMove(ids, oldIdx, newIdx));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-zinc-800 shrink-0">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Modules & Lessons
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="py-2">
          {modules.map((mod) => {
            const isCollapsed = collapsed[mod.id] ?? false;
            const lessonIds = mod.lessons.map((l) => l.id);

            return (
              <div key={mod.id}>
                {/* Module header */}
                <button
                  type="button"
                  onClick={() => toggleModule(mod.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left cursor-pointer hover:bg-zinc-800/40 transition-colors group"
                >
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
                  <span className="text-xs text-zinc-600">
                    {mod.lessons.length}
                  </span>
                </button>

                {/* Sortable lessons */}
                {!isCollapsed && (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={(e) => handleDragEnd(e, mod.id)}
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
                  </DndContext>
                )}
              </div>
            );
          })}

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
