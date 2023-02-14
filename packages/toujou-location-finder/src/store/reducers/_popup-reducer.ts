import {
  SET_POPUP_LOADING_START,
  SET_POPUP_LOADING_END,
  RESET_POPUP_FEATURE,
  SET_POPUP_FEATURE,
  SET_POPUP_COORDINATES,
  RESET_POPUP_COORDINATES,
} from '../actions/_popup.js';

const initialState = {
  feature: null,
  coordinates: null,
  isLoading: false,
};

// eslint-disable-next-line import/prefer-default-export
export function popupReducer(state = initialState, action) {
  // eslint-disable-next-line default-case
  switch (action.type) {
    case SET_POPUP_LOADING_START:
      return { ...state, isLoading: true };
    case SET_POPUP_LOADING_END:
      return { ...state, isLoading: false };
    case RESET_POPUP_FEATURE:
      return { ...state, feature: null };
    case SET_POPUP_FEATURE:
      return { ...state, feature: action.payload };
    case SET_POPUP_COORDINATES:
      return { ...state, coordinates: action.payload };
    case RESET_POPUP_COORDINATES:
      return { ...state, coordinates: null };
  }

  return state;
}
