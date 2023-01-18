export const MOUSE_ENTER_FEATURE = 'MOUSE_ENTER_FEATURE';
export const MOUSE_LEAVE_FEATURE = 'MOUSE_LEAVE_FEATURE';

export const mouseEnterFeature = (featureID) => ({
  type: MOUSE_ENTER_FEATURE,
  payload: featureID,
});

export const mouseLeaveFeature = () => ({
  type: MOUSE_LEAVE_FEATURE,
});
