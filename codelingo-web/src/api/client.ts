export class ApiError extends Error {
  public status: number;
  public data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://localhost:5080" : "");

interface RequestOptions extends RequestInit {
  timeoutMs?: number;
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { timeoutMs = 15000, ...fetchOptions } = options;
  const url = `${API_BASE_URL}${endpoint}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.text();
      let errorData: unknown = body;
      try { errorData = JSON.parse(body); } catch { /* Keep the original error text. */ }
      throw new ApiError(
        `API request failed with status ${res.status}: ${res.statusText}`,
        res.status,
        errorData
      );
    }

    const result = (await res.json()) as T;
    clearTimeout(timeoutId);
    return result;
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof ApiError) {
      throw err;
    }
    // Re-throw as typed error
    const message = err instanceof Error ? err.message : "Network error";
    throw new ApiError(message, 0, err);
  }
}
