/**
 * Creates a debounced version of the given function, which delays the invocation
 * of the function until after the specified `wait` time has passed since the last
 * time the debounced function was invoked.
 *
 * @param func The function to be debounced.
 * @param wait The number of milliseconds to wait before calling `func` after the last invocation.
 *
 * @returns A debounced version of the function.
 */
export function debounce(func: Function, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
