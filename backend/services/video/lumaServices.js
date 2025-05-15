// lumaFAL.js
import dotenv from "dotenv";
import { fal } from "@fal-ai/client";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});

// The resolution of the generated video (720p costs 2x more, 1080p costs 4x more) Default value: "540p"

// Possible enum values: 540p, 720p, 1080p
//Possible enum values: 16:9, 9:16, 4:3, 3:4, 21:9, 9:21

export const lumaFAL = async (prompt, resolution = "540p", aspect_ratio = "16:9") => {
  try {
    const result = await fal.subscribe(
      "fal-ai/luma-dream-machine/ray-2-flash",
      {
        input: { prompt, resolution, aspect_ratio },
        logs: false,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS" && Array.isArray(update.logs)) {
            console.log(update.logs.map((log) => log.message).join("\n"));
          }
        },
      }
    );
    return result?.data;
  } catch (error) {
    console.error("Error generating video with Luma Ray 2 Flash:", error);
  }
};
