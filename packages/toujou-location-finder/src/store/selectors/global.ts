import { createSelector } from 'reselect';

/**
 * Combine the different 'isLoading' states (from each element) into one "global" isLoading state for the component
 *
 * @type {OutputSelector<unknown, unknown, (res: unknown) => unknown>}
 */
export const isLoading = createSelector(
  (state) => state,
  (state) => state.data.isLoading || state.locator.isLoading || state.search.isLoading || state.popup.isLoading,
);
