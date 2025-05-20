export const getCreditsForGeneration = (handlersArray, model, providerType) => {
  const match = handlersArray.find(
    (entry) =>
      entry.model.toLowerCase() === model.toLowerCase() &&
      (!providerType ||
        entry.type?.toLowerCase() === providerType.toLowerCase())
  );
  return match?.credits || 0;
};

export function getCreditsForImageGeneration(handlersObject, id, providerType) {
  const model = handlersObject[id.toLowerCase()];
  if (!model) return null;

  return model[providerType] || null;
}
