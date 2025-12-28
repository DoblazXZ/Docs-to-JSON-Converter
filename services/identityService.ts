// Manages unique browser/user identity for data isolation
const STORAGE_KEY = 'vando_device_id';

export const getDeviceId = (): string => {
  let deviceId = localStorage.getItem(STORAGE_KEY);

  if (!deviceId) {
    // Generate a robust UUID v4
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      deviceId = crypto.randomUUID();
    } else {
      // Fallback for older browsers
      deviceId = 'usr-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9);
    }
    localStorage.setItem(STORAGE_KEY, deviceId);
  }

  return deviceId;
};

// Helper to generate unique object IDs (Session based)
export const generateUniqueId = (): string => {
  return typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID() 
    : Math.random().toString(36).substring(2) + Date.now().toString(36);
};