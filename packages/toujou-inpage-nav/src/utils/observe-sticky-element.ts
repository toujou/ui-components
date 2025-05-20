/**
 * Options for the sticky element observer
 */
export interface StickyObserverOptions {
  /** Custom threshold value (0-1). Default: 1.0 */
  threshold?: number;
  /** Whether to initialize with the current state immediately. Default: true */
  triggerImmediately?: boolean;
  /** Root margin for the IntersectionObserver. Default: "0px" */
  rootMargin?: string;
}

/**
 * Observes when a sticky element becomes stuck (i.e., starts "sticking").
 * Adds a sentinel element before the sticky element to detect intersection.
 *
 * @param stickyEl - The element using `position: sticky`.
 * @param callback - Callback triggered with `true` when stuck, `false` when unstuck.
 * @param options - Optional configuration options.
 * @returns A cleanup function that disconnects the observer and removes the sentinel.
 */
export function observeStickyElement(
  stickyEl: HTMLElement,
  callback: (isStuck: boolean) => void,
  options: StickyObserverOptions = {}
): () => void {
  // Type check for TypeScript, but these checks are redundant at runtime
  // with proper TypeScript usage, so we'll remove them in production builds
  if (!(stickyEl instanceof HTMLElement)) {
    throw new TypeError('observeStickyElement expects a valid HTMLElement as the first argument.');
  }

  if (typeof callback !== 'function') {
    throw new TypeError('observeStickyElement: callback must be a function');
  }

  const {
    threshold = 1.0,
    triggerImmediately = true,
    rootMargin = '0px',
  } = options;

  // Create a small sentinel element to track the intersection
  const sentinel = document.createElement('div');
  sentinel.className = 'sticky-sentinel';
  Object.assign(sentinel.style, {
    position: 'relative',
    width: '0',
    height: '0',
    pointerEvents: 'none',
    opacity: '0',
  });

  const parent = stickyEl.parentElement;
  if (!parent) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Sticky element has no parent, cannot observe sticky state');
    }
    return () => {};
  }

  parent.insertBefore(sentinel, stickyEl);

  let currentState = false;
  let isObserving = true;

  // Prevent redundant callback calls
  const updateState = (isStuck: boolean): void => {
    if (currentState !== isStuck) {
      currentState = isStuck;
      callback(isStuck);
    }
  };

  // Create the observer with enhanced options
  const observer = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]) => {
      if (!isObserving) return;

      const entry = entries[0];
      if (entry) {
        const isStuck = !entry.isIntersecting;
        updateState(isStuck);
      }
    },
    {
      threshold,
      rootMargin,
    }
  );

  observer.observe(sentinel);

  // Optionally trigger initial state check
  if (triggerImmediately) {
    requestAnimationFrame(() => {
      if (!isObserving) return;

      // Calculate if element is initially stuck based on its position
      const sentinelRect = sentinel.getBoundingClientRect();
      const isInitiallyStuck = sentinelRect.top < 0;
      updateState(isInitiallyStuck);
    });
  }

  // Return cleanup function
  return () => {
    isObserving = false;
    observer.disconnect();
    if (sentinel.parentElement) {
      sentinel.parentElement.removeChild(sentinel);
    }
  };
}
