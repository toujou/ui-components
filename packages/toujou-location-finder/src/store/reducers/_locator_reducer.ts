import { SET_LOCATOR_LOADING_START, SET_LOCATOR_LOADING_END } from '../actions/_locator';

const initialState = {
  isLoading: false,
};


export function locatorReducer(state = initialState, action) {
  // eslint-disable-next-line default-case
  switch (action.type) {
  case SET_LOCATOR_LOADING_START:
    return { ...state, isLoading: true };
  case SET_LOCATOR_LOADING_END:
    return { ...state, isLoading: false };
  }

  return state;
}
