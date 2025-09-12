import { StorageMode } from '../types/types/storageMode';

const overlayStorageKey = (overlayId: string): string => `toujou-overlay-${overlayId}`;

export const setOverlayStorageValue = (overlayId: string, choice: string, storageMode = StorageMode.SESSION): void => {
  const storageKey = overlayStorageKey(overlayId);
  if (storageMode === StorageMode.LOCAL_STORAGE) {
    localStorage.setItem(storageKey, choice);
  } else {
    document.cookie = storageKey + '=' + choice + ';path=/;';
  }
};

export const checkOverlayStorageValue = (overlayId: string, storageMode = StorageMode.SESSION): string|boolean => {
  const storageKey = overlayStorageKey(overlayId);
  if (storageMode === StorageMode.LOCAL_STORAGE) {
    return localStorage.getItem(storageKey);
  } else {
    const match = document.cookie.match(new RegExp('(^| )' + storageKey + '=([^;]+)'));
    return match ? match[2] : false;
  }
};
