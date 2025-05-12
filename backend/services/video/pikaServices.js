import { fal } from "@fal-ai/client";

// resolution options:default: "720p", "1080p"
export const pikaFAL = async (prompt, resolution = "720p") => {
  try {
    const result = await fal.subscribe("fal-ai/pika/v2.1/text-to-video", {
      input: { prompt, resolution },
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
