import {
  SET_DATA_GEOJSON,
  SET_DATA_TEASERS,
  SET_DATA_LOAD_START,
  SET_DATA_LOAD_END,
  SET_CURRENT_VISIBLE_FEATURES,
} from '../actions/_data.js';

const initialState = {
  geojson: null,
  teasers: null,
  isLoading: false,
  currentlyVisibleFeatures: [],
};

// eslint-disable-next-line import/prefer-default-export
export function dataReducer(state = initialState, action) {
  // eslint-disable-next-line default-case
  switch (action.type) {
    case SET_DATA_GEOJSON:
      return { ...state, geojson: action.payload };
    case SET_DATA_TEASERS:
      return { ...state, teasers: action.payload };
    case SET_DATA_LOAD_START:
      return { ...state, isLoading: true };
    case SET_DATA_LOAD_END:
      return { ...state, isLoading: false };
    case SET_CURRENT_VISIBLE_FEATURES:
      return { ...state, currentlyVisibleFeatures: action.payload };
  }

  return state;
}
