import {
  MOUSE_ENTER_FEATURE,
  MOUSE_LEAVE_FEATURE,
} from '../actions/_features.js';

const initialState = {
  highlightedFeature: null,
  isLoading: false,
};

// eslint-disable-next-line import/prefer-default-export
export function featuresReducer(state = initialState, action) {
  // eslint-disable-next-line default-case
  switch (action.type) {
    case MOUSE_LEAVE_FEATURE:
      return { ...state, highlightedFeature: null };
    case MOUSE_ENTER_FEATURE:
      return { ...state, highlightedFeature: action.payload };
  }

  return state;
}
