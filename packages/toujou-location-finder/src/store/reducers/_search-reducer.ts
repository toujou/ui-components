import { SET_SEARCH_LOADING_START, SET_SEARCH_LOADING_END } from '../actions/_search';

const initialState = {
  isLoading: false,
};

export function searchReducer(state = initialState, action) {
  // eslint-disable-next-line default-case
  switch (action.type) {
  case SET_SEARCH_LOADING_START:
    return { ...state, isLoading: true };
  case SET_SEARCH_LOADING_END:
    return { ...state, isLoading: false };
  }

  return state;
}
