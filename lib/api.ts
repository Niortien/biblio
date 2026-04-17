import { baseURL } from "@/config";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions<TBody = unknown> {
  endpoint: string;
  method?: HttpMethod;
  data?: TBody;
  searchParams?: Record<string, string | number | boolean | undefined>;
}

async function request<TResponse, TBody = unknown>(
  options: RequestOptions<TBody>
): Promise<TResponse> {
  const { endpoint, method = "GET", data, searchParams } = options;

  let url = `${baseURL}/${endpoint.replace(/^\//, "")}`;

  if (searchParams) {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;
  }

  const isFormData = data instanceof FormData;

  const token =
    typeof window !== "undefined"
      ? (localStorage.getItem("access_token") ?? localStorage.getItem("etudiant_token"))
      : null;

  const headers: HeadersInit = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, {
    method,
    headers,
    body: isFormData
      ? (data as FormData)
      : data
      ? JSON.stringify(data)
      : undefined,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      errorBody || `Erreur ${response.status}: ${response.statusText}`
    );
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  const text = await response.text();
  if (!text) {
    return undefined as TResponse;
  }

  return JSON.parse(text) as TResponse;
}

export const api = { request };
