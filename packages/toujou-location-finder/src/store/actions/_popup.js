export const SET_POPUP_LOADING_START = 'SET_POPUP_LOADING_START';
export const SET_POPUP_LOADING_END = 'SET_POPUP_LOADING_END';
export const RESET_POPUP_FEATURE = 'RESET_POPUP_FEATURE';
export const SET_POPUP_FEATURE = 'SET_POPUP_FEATURE';
export const SET_POPUP_COORDINATES = 'SET_POPUP_COORDINATES';
export const RESET_POPUP_COORDINATES = 'RESET_POPUP_COORDINATES';

export const setPopupLoadingStart = () => ({
  type: SET_POPUP_LOADING_START,
});

export const setPopupLoadingEnd = () => ({
  type: SET_POPUP_LOADING_END,
});

export const resetPopupFeature = () => ({
  type: RESET_POPUP_FEATURE,
});

export const setPopupFeature = (feature) => ({
  type: SET_POPUP_FEATURE,
  payload: feature,
});

export const setPopupCoordinates = (coordinates) => ({
  type: SET_POPUP_COORDINATES,
  payload: coordinates,
});

export const resetPopupCoordinates = () => ({
  type: RESET_POPUP_COORDINATES,
});

/**
 * The data for a single feature to be displayed on the popup
 *
 * @param featureID
 * @param teasersEndpoint
 * @returns {function(*): Promise<void>}
 */
export const getPopupFeature = (featureID, teasersEndpoint) => async (dispatch) => {
  dispatch(setPopupLoadingStart());

  try {
    const urlSearchParams = new URLSearchParams({
      ids: featureID,
    });
    const url = teasersEndpoint + (teasersEndpoint.match(/[?]/g) ? '&' : '?') + urlSearchParams.toString();
    const feature = await fetch(url).then((response) => response.text());
    dispatch(setPopupFeature(feature));
  } catch (error) {
    console.error('Could not get popup content', error);
  }

  dispatch(setPopupLoadingEnd());
};
