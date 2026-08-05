import type { ApiResponse } from "../types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
}

/**
 * Generic request function <T> - the caller specifies what shape of data
 * they expect back (e.g. apiRequest<Product[]>(...)), and TypeScript
 * enforces that shape everywhere the result is used.
 */
export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = "GET", body, token } = options;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const json: ApiResponse<T> = await res.json();
  return json;
}

interface UploadImageResult {
  imageUrl: string;
}

export async function uploadImage(
  file: File,
  token: string
): Promise<ApiResponse<UploadImageResult>> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const json: ApiResponse<UploadImageResult> = await res.json();
  return json;
}
