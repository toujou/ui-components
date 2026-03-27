/**
 * Replaces window.fetch with a mock implementation.
 * Intercept rules are passed as an array of matcher/responder pairs.
 * Any URL that does not match falls through to the real fetch.
 *
 * ⚠️ Note: This replaces `window.fetch` globally for the current page.
 *
 * @example
 * mockFetch([
 *   {
 *     match: (url) => url.includes('north='),
 *     response: { json: () => placesGeoMockResp },
 *   },
 * ]);
 */

/**
 * Rule describing when a request should be mocked and what to return.
 */
export interface MockFetchRule {
  /** Returns true if the request URL should be intercepted. */
  match: (url: string) => boolean;

  /** Partial mock of a Fetch API Response object. */
  response: Partial<{
    ok: boolean;
    text: () => string;
    json: () => unknown;
  }>;
}

export const mockFetch = (rules: MockFetchRule[]) => {
  const originalFetch = window.fetch;

  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const urlString = input instanceof Request ? input.url : input.toString();

    const matchedRule = rules.find((rule) => rule.match(urlString));

    if (matchedRule) {
      return Promise.resolve({
        ok: true,
        text: () => Promise.resolve(''),
        json: () => Promise.resolve({}),
        ...matchedRule.response,
      } as Response);
    }

    return originalFetch(input, init);
  };
};
