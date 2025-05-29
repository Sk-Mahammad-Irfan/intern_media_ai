import { fal } from "@fal-ai/client";

export const evenlabAudio = async (body) => {
  const {
    prompt = "Spacious braam suitable for high-impact movie trailer moments",
    duration = 10,
    prompt_influence = 0.3,
  } = body;

  try {
    const result = await fal.subscribe("fal-ai/elevenlabs/sound-effects", {
      input: {
        text: prompt,
        duration_seconds: duration,
        prompt_influence,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs?.map((log) => log.message).forEach(console.log);
        }
      },
    });

    const audioUrl = result.data?.audio?.url || result.data?.audio_file?.url;
    if (!audioUrl) throw new Error("FAL did not return a valid audio URL");

    return audioUrl;
  } catch (error) {
    // Custom error message extraction for ValidationError
    if (error?.body?.detail) {
      const validationDetails = error.body.detail
        .map((d) => `${d.loc?.join(".") || "unknown"}: ${d.msg}`)
        .join("\n");
      console.error("Validation error(s) from FAL:\n", validationDetails);
      throw new Error(`Validation failed:\n${validationDetails}`);
    }

    // Generic fallback error
    console.error("Error generating mmaudio audio:", error);
    throw new Error(`Failed to generate audio: ${error.message || error}`);
  }
};
