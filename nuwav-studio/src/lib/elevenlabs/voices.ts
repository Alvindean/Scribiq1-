export interface VoiceOption {
  id: string;
  label: string;
  gender: "male" | "female";
  description: string;
}

export const VOICES: VoiceOption[] = [
  {
    id: "LjNqOSdRGIUUmAcEINh7",
    label: "Marcus",
    gender: "male",
    description: "Deep, authoritative male voice",
  },
  {
    id: "h0NCZ7zL97vZXHmpxKcP",
    label: "Devon",
    gender: "male",
    description: "Warm, conversational male voice",
  },
  {
    id: "aRlmTYIQo6Tlg5SlulGC",
    label: "Sofia",
    gender: "female",
    description: "Clear, professional female voice",
  },
];

export const DEFAULT_VOICE_ID = VOICES[0].id;
