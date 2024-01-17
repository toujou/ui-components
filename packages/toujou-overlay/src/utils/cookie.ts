const cookieName = (overlayId): string => `toujou-overlay${overlayId}`;

export const setOverlayCookie = (overlayID: string, choice: string): void => {
  document.cookie = cookieName(overlayID) + '=' + choice + ';path=/;';
};

export const checkOverlayCookie = (overlayId: string): string|false => {
  const match = document.cookie.match(new RegExp('(^| )' + cookieName(overlayId) + '=([^;]+)'));
  if (match) {
    return match[2];
  }
  else {
    return false;
  }
};
