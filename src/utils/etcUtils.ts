export const sleep = async (ms): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, ms));
};