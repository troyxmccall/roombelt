import axios from "axios";

axios.interceptors.request.use(config => ({ ...config, url: config.url + "?_ts=" + Date.now() }));
axios.interceptors.response.use(response => response.data);

export async function isOnline() {
  try {
    await getAuth();
    return true;
  } catch (err) {
    return false;
  }
}

export function removeAuth() {
  return axios.delete("/api/auth");
}

export function getAuth() {
  return axios.get("/api/auth");
}

export function getApiVersion() {
  return axios.get("/api/version");
}

export function createDevice() {
  return axios.put("/api/auth/device");
}

export function getUserDetails() {
  return axios.get("/api/admin/user");
}

export function setUserProperty(propertyId, value) {
  return axios.put(`/api/admin/user/property/${encodeURIComponent(propertyId)}`, value);
}

export function getConnectedDevices() {
  return axios.get("/api/admin/device");
}

export function connectDevice(connectionCode) {
  return axios.post("/api/admin/device", { connectionCode });
}

export function disconnectDevice(deviceId) {
  return axios.delete(`/api/admin/device/${encodeURIComponent(deviceId)}`);
}

export function getCalendars() {
  return axios.get("/api/admin/calendar");
}

export function setOptionsForDevice(deviceId, deviceType, calendarId, language, minutesForCheckIn, clockType) {
  return axios.put(`/api/admin/device/${encodeURIComponent(deviceId)}`, {
    deviceType,
    calendarId,
    language,
    minutesForCheckIn,
    clockType
  });
}

export function setSubscriptionPlan(subscriptionPlanId) {
  return axios.put("/api/admin/subscription", { subscriptionPlanId });
}

export function cancelSubscription() {
  return axios.delete("/api/admin/subscription");
}

export function getDeviceDetails(getAllCalendars) {
  return axios.get("/api/device", { params: { "all-calendars": getAllCalendars } });
}

export function createMeeting(timeInMinutes, summary, calendarId) {
  return axios.post("/api/device/meeting", { timeInMinutes, summary, calendarId });
}

export function updateMeeting(meetingId, { startNow, endNow, extensionTime, checkIn }) {
  return axios.put(`/api/device/meeting/${encodeURIComponent(meetingId)}`, {
    startNow,
    endNow,
    extensionTime,
    checkIn
  });
}

export function deleteMeeting(meetingId) {
  return axios.delete(`/api/device/meeting/${encodeURIComponent(meetingId)}`);
}
