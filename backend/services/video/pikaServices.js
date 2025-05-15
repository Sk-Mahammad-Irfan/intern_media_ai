import { fal } from "@fal-ai/client";

// resolution options:default: "720p", "1080p"
//Possible enum values: 16:9, 9:16, 1:1, 4:5, 5:4, 3:2, 2:3
export const pikaFAL = async (prompt, resolution = "720p", aspect_ratio = "16:9") => {
  try {
    const result = await fal.subscribe("fal-ai/pika/v2.1/text-to-video", {
      input: { prompt, resolution, aspect_ratio },
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
