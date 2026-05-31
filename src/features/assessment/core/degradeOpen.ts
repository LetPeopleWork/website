export interface DegradeOpenOptions {
  readonly onFailure?: () => void;
}

export const runDegradeOpen = async (
  action: () => Promise<void>,
  options: DegradeOpenOptions = {},
): Promise<boolean> => {
  try {
    await action();
    return true;
  } catch {
    try {
      await action();
      return true;
    } catch {
      options.onFailure?.();
      return false;
    }
  }
};
