export const copyToClipboard = async (value: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(value);
    console.log('Text copied to clipboard:', value);
  } catch (error) {
    console.error('Failed to copy:', error);
  }
};
