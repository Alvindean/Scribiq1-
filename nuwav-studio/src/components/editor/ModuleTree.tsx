"use client";
import { useState } from "react";
import type { Lesson } from "@/types/project";
import { useProjectStore } from "@/stores/project-store";
import { useEditorStore } from "@/stores/editor-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronRight, GripVertical } from "lucide-react";

const STATUS_COLORS: Record<Lesson["status"], string> = {
  draft: "bg-zinc-500",
  scripted: "bg-blue-500",
  voiced: "bg-amber-400",
  rendered: "bg-emerald-400",
  published: "bg-violet-500",
};

export function ModuleTree() {
  const { modules } = useProjectStore();
  const { selectedLessonId, setSelectedLesson } = useEditorStore();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleModule = (moduleId: string) => {
    setCollapsed((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
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
            return (
              <div key={mod.id}>
                {/* Module header */}
                <button
                  type="button"
                  onClick={() => toggleModule(mod.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-zinc-800/60 transition-colors group"
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

                {/* Lessons */}
                {!isCollapsed &&
                  mod.lessons.map((lesson) => {
                    const isSelected = lesson.id === selectedLessonId;
                    return (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => setSelectedLesson(lesson)}
                        className={`w-full flex items-center gap-2 pl-7 pr-3 py-2 text-left transition-colors group ${
                          isSelected
                            ? "bg-violet-600/20 text-white"
                            : "hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        <GripVertical className="w-3 h-3 text-zinc-700 group-hover:text-zinc-500 shrink-0 cursor-grab" />
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${STATUS_COLORS[lesson.status]}`}
                          title={lesson.status}
                        />
                        <span className="flex-1 text-xs truncate">
                          {lesson.title}
                        </span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
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
