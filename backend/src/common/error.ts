export const toError = (err: unknown, fallbackMessage?: string): Error =>
  err instanceof Error ? err : new Error(fallbackMessage ?? String(err));
