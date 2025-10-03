/**
 * Standard result type for server actions
 * Provides consistent error handling across the application
 */
export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Creates a successful action result
 */
export function createSuccessResult<T = void>(data?: T): ActionResult<T> {
  return {
    success: true,
    data,
  };
}

/**
 * Creates a failed action result
 */
export function createErrorResult<T = void>(error: string): ActionResult<T> {
  return {
    success: false,
    error,
  };
}
