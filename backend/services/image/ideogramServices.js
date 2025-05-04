// ideogramFAL.js

import { fal } from "@fal-ai/client";
import dotenv from "dotenv";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});

export const ideogramFAL = async (prompt) => {
  try {
    const result = await fal.subscribe("fal-ai/ideogram/v3", {
      input: { prompt },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });
    console.log("ideogram");
    console.log(result.data);
    console.log(result.requestId);
    return result.data;
  } catch (error) {
    console.error("Error generating image with Ideogram V3:", error);
  }
};
