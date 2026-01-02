// The base URL for all API requests.
// It first tries to read the `VITE_API_BASE_URL` from the environment variables.
// If it's not defined, it defaults to "/api/v1".
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

// Defines the options that can be passed to the `request` function.
// It extends the native `RequestInit` type, but omits the `body` property
// so we can define our own `body` type.
interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: Record<string, any> | FormData;
}

/**
 * A generic function for making API requests.
 * @param method The HTTP method (e.g., "GET", "POST").
 * @param endpoint The API endpoint to call (e.g., "/auth/login").
 * @param options An optional object for additional configuration, like headers or the request body.
 * @returns A promise that resolves to the JSON response.
 */
async function request<T>(
  method: string,
  endpoint: string,
  options?: RequestOptions
): Promise<T> {
  // Construct the full URL for the API request.
  const url = `${BASE_URL}${endpoint}`;

  // Get the token from local storage
  const storedUser = localStorage.getItem("authUser");
  let token = null;
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      if (user && user.accessToken) {
        token = user.accessToken;
      }
    } catch (e) {
      console.error("Failed to parse authUser from localStorage", e);
    }
  }

  const headers: Record<string, string> = {
    ...options?.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  if (!(options?.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // Create the configuration for the `fetch` call.
  const config: RequestInit = {
    method,
    headers,
  };

  // If a `body` is provided, stringify it and add it to the configuration.
  if (options?.body) {
    if (options.body instanceof FormData) {
      config.body = options.body;
    } else {
      config.body = JSON.stringify(options.body);
    }
  }

  // Make the `fetch` call.
  const response = await fetch(url, config);

  // If the response is not successful, throw an error.
  if (!response.ok) {
    const errorData = await response.json();
    throw { response: { data: errorData } };
  }

  // If the response is successful, parse the JSON and return it.
  return response.json();
}

// An object that provides convenient methods for making API requests.
// Each function in the `fetcher` object (`get`, `post`, `put`, `del`) is a shortcut
// that calls the `request` function with the correct HTTP method.
const fetcher = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>("GET", endpoint, options),
  post: <T>(
    endpoint: string,
    body: Record<string, any> | FormData,
    options?: RequestOptions
  ) => request<T>("POST", endpoint, { ...options, body }),
  put: <T>(
    endpoint: string,
    body: Record<string, any> | FormData,
    options?: RequestOptions
  ) => request<T>("PUT", endpoint, { ...options, body }),
  del: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>("DELETE", endpoint, options),
};

// Export the `fetcher` object so it can be used in other parts of the application.
export default fetcher;
