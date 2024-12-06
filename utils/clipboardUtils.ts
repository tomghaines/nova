export const copyToClipboard = async (value: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(value);
  } catch (error) {
    console.error('Failed to copy account id to clipboard:', error);
  }
};
