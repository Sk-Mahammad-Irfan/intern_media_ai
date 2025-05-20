export const getCreditsForGeneration = (handlersArray, model, providerType) => {
  const match = handlersArray.find(
    (entry) =>
      entry.model.toLowerCase() === model.toLowerCase() &&
      (!providerType ||
        entry.type?.toLowerCase() === providerType.toLowerCase())
  );
  return match?.credits || 0;
};
