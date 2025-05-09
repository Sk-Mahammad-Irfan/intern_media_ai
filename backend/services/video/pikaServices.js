import { fal } from "@fal-ai/client";

export const pikaFAL = async (prompt) => {
  try {
    const result = await fal.subscribe("fal-ai/pika/v2.1/text-to-video", {
      input: { prompt },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });
    console.log("pika");
    console.log(result?.data?.video?.url);
    return result?.data?.video?.url;
  } catch (error) {
    console.error("Error generating video with Pika:", error);
  }
};
