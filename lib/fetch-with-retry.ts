interface FetchWithRetryOptions {
  retries?: number;
  delayMs?: number;
  onRetry?: (attempt: number, maxAttempts: number) => void;
}

/**
 * Wraps fetch with retries on network failure. Render's free tier puts the
 * backend to sleep after inactivity, so the first request after a while can
 * throw "Failed to fetch" while it wakes up — retrying after a short delay
 * gives it time to come back up instead of surfacing that error to the user.
 */
export async function fetchWithRetry(
  url: string,
  init: RequestInit,
  options: FetchWithRetryOptions = {}
): Promise<Response> {
  const { retries = 2, delayMs = 5000, onRetry } = options;

  for (let attempt = 0; ; attempt++) {
    try {
      return await fetch(url, init);
    } catch (err) {
      if (attempt >= retries) throw err;
      onRetry?.(attempt + 1, retries);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}
