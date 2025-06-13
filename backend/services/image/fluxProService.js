import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const resolutionMap = {
  square_hd: "1024x1024",
  square: "1024x1024",
  portrait_4_3: "768x1024",
  portrait_16_9: "576x1024",
  landscape_4_3: "1024x768",
  landscape_16_9: "1024x576",
};

export const deepFluxPro = async (
  prompt = "A photo of an astronaut riding a horse on Mars.",
  resolution = "square_hd",
  seed
) => {
  try {
    const size = resolutionMap[resolution] || "1024x1024";

    const payload = {
      prompt,
      size,
      model: "black-forest-labs/FLUX-pro", // Note: model name matches your curl
      n: 1,
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEEPINFRA_API}`,
    };

    const response = await axios.post(
      "https://api.deepinfra.com/v1/openai/images/generations",
      payload,
      { headers }
    );

    return response.data;
  } catch (error) {
    const status = error?.response?.status || "unknown";
    const detail = error?.response?.data || error.message || "Unknown error";
    console.error(`DeepInfra Flux Pro generation failed [${status}]:`, detail);
    throw new Error(
      `DeepInfra Flux Pro generation failed [${status}]: ${JSON.stringify(
        detail
      )}`
    );
  }
};
