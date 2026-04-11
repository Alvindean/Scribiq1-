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
  // CRUD helpers
  addModule: (mod: Module & { lessons: Lesson[] }) => void;
  removeModule: (moduleId: string) => void;
  renameModule: (moduleId: string, title: string) => void;
  addLesson: (moduleId: string, lesson: Lesson) => void;
  removeLesson: (lessonId: string) => void;
  renameLesson: (lessonId: string, title: string) => void;
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

  addModule: (mod) =>
    set((state) => ({ modules: [...state.modules, mod] })),

  removeModule: (moduleId) =>
    set((state) => ({
      modules: state.modules.filter((m) => m.id !== moduleId),
    })),

  renameModule: (moduleId, title) =>
    set((state) => ({
      modules: state.modules.map((m) =>
        m.id === moduleId ? { ...m, title } : m
      ),
    })),

  addLesson: (moduleId, lesson) =>
    set((state) => ({
      modules: state.modules.map((mod) =>
        mod.id === moduleId
          ? { ...mod, lessons: [...mod.lessons, lesson] }
          : mod
      ),
    })),

  removeLesson: (lessonId) =>
    set((state) => ({
      modules: state.modules.map((mod) => ({
        ...mod,
        lessons: mod.lessons.filter((l) => l.id !== lessonId),
      })),
    })),

  renameLesson: (lessonId, title) =>
    set((state) => ({
      modules: state.modules.map((mod) => ({
        ...mod,
        lessons: mod.lessons.map((l) =>
          l.id === lessonId ? { ...l, title } : l
        ),
      })),
    })),
}));
