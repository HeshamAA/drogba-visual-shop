import axios from "axios";

/**
 * Maps various error types to user-friendly error messages
 * @param error - The error object from API call
 * @returns A formatted error message string
 */
export const mapErrorToMessage = (error: unknown): string => {
  // Handle Axios errors
  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.error?.message ??
      error.response?.data?.message ??
      error.message;
    return message || "Request failed";
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Handle string errors
  if (typeof error === "string") {
    return error;
  }

  // Fallback for unknown error types
  return "Unknown error";
};

/**
 * Extracts error message from various error formats
 * Used in Redux slices for consistent error handling
 */
export const toErrorMessage = (error: unknown): string => {
  if (!error) return "Unknown error";
  if (typeof error === "string") return error;
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message?: unknown }).message ?? "Unknown error");
  }
  return "Unknown error";
};
