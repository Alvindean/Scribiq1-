"use client";
import { create } from "zustand";
import type { Project, Module, Lesson } from "@/types/project";

interface ProjectStore {
  project: Project | null;
  modules: (Module & { lessons: Lesson[] })[];
  setProject: (project: Project) => void;
  setModules: (modules: (Module & { lessons: Lesson[] })[]) => void;
  updateLesson: (lessonId: string, updates: Partial<Lesson>) => void;
  updateProject: (updates: Partial<Project>) => void;
  reorderLessons: (moduleId: string, orderedIds: string[]) => void;
  reorderModules: (orderedIds: string[]) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  project: null,
  modules: [],

  setProject: (project) => set({ project }),

  setModules: (modules) => set({ modules }),

  updateLesson: (lessonId, updates) =>
    set((state) => ({
      modules: state.modules.map((mod) => ({
        ...mod,
        lessons: mod.lessons.map((lesson) =>
          lesson.id === lessonId ? { ...lesson, ...updates } : lesson
        ),
      })),
    })),

  updateProject: (updates) =>
    set((state) => ({
      project: state.project ? { ...state.project, ...updates } : null,
    })),

  reorderLessons: (moduleId, orderedIds) =>
    set((state) => ({
      modules: state.modules.map((mod) => {
        if (mod.id !== moduleId) return mod;
        const lessonMap = new Map(mod.lessons.map((l) => [l.id, l]));
        const reordered = orderedIds
          .map((id) => lessonMap.get(id))
          .filter((l): l is Lesson => l !== undefined)
          .map((l, idx) => ({ ...l, order: idx }));
        return { ...mod, lessons: reordered };
      }),
    })),

  reorderModules: (orderedIds) =>
    set((state) => {
      const modMap = new Map(state.modules.map((m) => [m.id, m]));
      const reordered = orderedIds
        .map((id) => modMap.get(id))
        .filter((m): m is Module & { lessons: Lesson[] } => m !== undefined)
        .map((m, idx) => ({ ...m, order: idx }));
      return { modules: reordered };
    }),
}));
