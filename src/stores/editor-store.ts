"use client";
import { create } from "zustand";
import type { Lesson } from "@/types/project";

interface EditorStore {
  selectedLessonId: string | null;
  selectedLesson: Lesson | null;
  activeTab: "script" | "voice" | "visuals" | "timing";
  isGenerating: boolean;
  isPlayingVoiceover: boolean;
  setSelectedLesson: (lesson: Lesson | null) => void;
  setActiveTab: (tab: EditorStore["activeTab"]) => void;
  setIsGenerating: (val: boolean) => void;
  setIsPlayingVoiceover: (val: boolean) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  selectedLessonId: null,
  selectedLesson: null,
  activeTab: "script",
  isGenerating: false,
  isPlayingVoiceover: false,

  setSelectedLesson: (lesson) =>
    set({
      selectedLesson: lesson,
      selectedLessonId: lesson ? lesson.id : null,
    }),

  setActiveTab: (tab) => set({ activeTab: tab }),

  setIsGenerating: (val) => set({ isGenerating: val }),

  setIsPlayingVoiceover: (val) => set({ isPlayingVoiceover: val }),
}));
