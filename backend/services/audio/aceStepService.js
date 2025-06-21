// ideogramFAL.js

import { fal } from "@fal-ai/client";
import dotenv from "dotenv";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});
export const aceStepService = async (prompt, duration, step) => {
  try {
    const result = await fal.subscribe("fal-ai/ace-step", {
      input: {
        lyrics: prompt,
        tags: "lofi, hiphop, drum and bass, trap, chill",
        number_of_steps: step,
      },
      logs: false,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          if (Array.isArray(update.logs)) {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        }
      },
    });
    console.log(result.data);
    const audioUrl = result.data.audio?.url;
    if (!audioUrl)
      throw new Error(
        "FAL did not return a valid audio URL: " +
          JSON.stringify(result.data, null, 2)
      );
    return audioUrl;
  } catch (error) {
    console.error("Error generating audio with aceStepService:", error);
  }
};
