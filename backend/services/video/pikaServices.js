import { fal } from "@fal-ai/client";

export const pikaFAL = async (prompt) => {
  try {
    const result = await fal.subscribe("fal-ai/pika/v2.1/text-to-video", {
      input: { prompt },
      logs: false,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS" && Array.isArray(update.logs)) {
          console.log(update.logs.map((log) => log.message).join("\n"));
        }
      },
    });
    return result?.data;
  } catch (error) {
    console.error("Error generating video with Pika:", error);
  }
};
