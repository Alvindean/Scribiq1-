export interface TTSOptions {
  text: string;
  voiceId?: string;
  modelId?: string;
  stability?: number;
  similarityBoost?: number;
}

export interface TTSResult {
  audioBuffer: ArrayBuffer;
  contentType: string;
}

export async function generateVoiceover(
  options: TTSOptions
): Promise<TTSResult> {
  const {
    text,
    voiceId = process.env.ELEVENLABS_VOICE_ID!,
    modelId = "eleven_turbo_v2_5",
    stability = 0.5,
    similarityBoost = 0.75,
  } = options;

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY!,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        voice_settings: {
          stability,
          similarity_boost: similarityBoost,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs TTS error ${response.status}: ${error}`);
  }

  const audioBuffer = await response.arrayBuffer();

  return {
    audioBuffer,
    contentType: "audio/mpeg",
  };
}

export async function getAvailableVoices() {
  const response = await fetch("https://api.elevenlabs.io/v1/voices", {
    headers: {
      "xi-api-key": process.env.ELEVENLABS_API_KEY!,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch voices: ${response.status}`);
  }

  const data = await response.json() as { voices: Array<{ voice_id: string; name: string; category: string }> };
  return data.voices;
}
