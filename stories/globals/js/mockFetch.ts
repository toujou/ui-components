/**
 * Replaces window.fetch with a mock implementation.
 * Intercept rules are passed as an array of matcher/responder pairs.
 * Any URL that does not match falls through to the real fetch.
 *
 * @example
 * mockFetch([
 *   {
 *     match: (url) => url.includes('north='),
 *     response: { json: () => placesGeoMockResp },
 *   },
 * ]);
 */

export interface MockFetchRule {
  match: (url: string) => boolean;
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
    console.log('FETCH CALLED:', urlString);

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
