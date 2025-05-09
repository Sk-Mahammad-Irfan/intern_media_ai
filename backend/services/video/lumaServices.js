// lumaFAL.js
import dotenv from "dotenv";
import { fal } from "@fal-ai/client";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});

export const lumaFAL = async (prompt) => {
  try {
    const result = await fal.subscribe(
      "fal-ai/luma-dream-machine/ray-2-flash",
      {
        input: { prompt },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        },
      }
    );
    console.log("luma");
    console.log(result?.data?.video?.url);
    return result?.data?.video?.url;
  } catch (error) {
    console.error("Error generating video with Luma Ray 2 Flash:", error);
  }
};
