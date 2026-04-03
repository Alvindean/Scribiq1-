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
}));
