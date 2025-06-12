import { generateImageFluxDevTogether } from "../../services/image/flux1devService.js";

const getRandom4DigitSeed = () => Math.floor(1000 + Math.random() * 9000);

export const generateImageFluxDev = async ({
  provider,
  prompt,
  resolution = "1:1",
  seed,
  steps = 15,
}) => {
  const effectiveSeed = typeof seed === "number" ? seed : getRandom4DigitSeed();

  switch (provider) {
    case "together":
      return generateImageFluxDevTogether(
        prompt,
        resolution,
        steps,
        effectiveSeed
      );
    default:
      throw new Error(`Unsupported provider '${provider}'.`);
  }
};
