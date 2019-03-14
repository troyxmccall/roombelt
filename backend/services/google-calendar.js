const crypto = require("crypto");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const Cache = require("./cache");
const Moment = require("moment");
const logger = require("../logger");

const CHANNEL_TTL_CALENDARS = 60 * 2;
const CHANNEL_TTL_EVENTS = 60 * 5;

const getTime = time => {
  if (!time) {
    return null;
  }

  const [year, month, day, hour, minute, second] = Moment.utc(time.dateTime || time.date).toArray();

  return { year, month, day, hour, minute, second, isTimeZoneFixedToUTC: !!time.dateTime };
};

const mapEvent = ({ id, summary, start, end, organizer, attendees, extendedProperties, visibility }) => ({
  id,
  summary,
  organizer,
  isAllDayEvent: !!(start && start.date) || !!(end && end.date),
  start: getTime(start),
  end: getTime(end),
  attendees: attendees || [],
  isCheckedIn: extendedProperties && extendedProperties.private && extendedProperties.private.roombeltIsCheckedIn === "true",
  isPrivate: visibility === "private" || visibility === "confidential"
});

const cache = new Cache(30);

module.exports = class {
  constructor(config, credentials) {
    this.oauthClient = new OAuth2(config.clientId, config.clientSecret, config.redirectUrl);

    this.oauthClient.setCredentials({
      access_token: credentials && credentials.accessToken,
      refresh_token: credentials && credentials.refreshToken
    });

    this.calendarClient = google.calendar({ version: "v3", auth: this.oauthClient });
    this.peopleClient = google.people({ version: "v1", auth: this.oauthClient });

    this.cacheKey = credentials && crypto.createHash("md5").update(credentials.refreshToken).digest("hex");
    this.clientId = config.clientId;
    this.webHookUrl = config.webHookUrl;
  }

  getAuthUrl(forceConsent) {
    const scopes = ["https://www.googleapis.com/auth/calendar", "profile", "email"];

    return this.oauthClient.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      prompt: forceConsent ? "consent" : undefined
    });
  }

  async getAuthTokens(authCode) {
    const { tokens } = await this.oauthClient.getToken(authCode);
    const verification = await this.oauthClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: this.clientId
    });

    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      idToken: tokens.id_token,
      userId: verification.payload.sub
    };
  }

  async isAccessTokenValid() {
    try {
      await this.getCalendars();
      return true;
    } catch (err) {
      return false;
    }
  }

  async getUserDetails() {
    const { data } = await new Promise((res, rej) =>
      this.peopleClient.people.get({
        resourceName: "people/me",
        personFields: "names,photos,emailAddresses"
      }, (err, data) => (err ? rej(err) : res(data)))
    );

    return {
      displayName: (data.names && data.names[0] && data.names[0].displayName) || "Unknown",
      photoUrl: (data.photos && data.photos[0] && data.photos[0].url) || "",
      email: (data.emailAddresses && data.emailAddresses[0] && data.emailAddresses[0].value) || ""
    };
  }

  async getCalendars() {
    const getValue = () => new Promise((res, rej) => {
        logger.debug(`Fetch calendars`);
        this.calendarClient.calendarList.list((err, data) => (err ? rej(err) : res(data.data)));
      }
    );

    const token = `calendars-${this.cacheKey}`;
    const { items } = await cache.get(token, getValue, () => this.watchCalendars(token, CHANNEL_TTL_CALENDARS));

    return items;
  }

  async getCalendar(calendarId) {
    const calendars = await this.getCalendars();
    return calendars.find(calendar => calendar.id === calendarId);
  }

  async getEvents(calendarId) {
    const query = {
      calendarId: encodeURIComponent(calendarId),
      timeMin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      timeMax: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      singleEvents: true,
      orderBy: "startTime"
    };

    const getValue = () => new Promise((res, rej) => {
      logger.debug(`Fetch events for ${calendarId}`);

      this.calendarClient.events.list(query, (err, data) => (err ? rej(err) : res(data.data)));
    });

    const token = `events-${this.cacheKey}-${calendarId}`;
    const { items } = await cache.get(token, getValue, () => this.watchEvents(calendarId, token, CHANNEL_TTL_EVENTS));

    return items.map(mapEvent);
  }

  async createEvent(calendarId, { startDateTime, endDateTime, isCheckedIn, summary }) {
    cache.invalidate(`events-${this.cacheKey}-${calendarId}`);

    const query = {
      calendarId: encodeURIComponent(calendarId),
      resource: {
        summary,
        start: { dateTime: new Date(startDateTime).toISOString() },
        end: { dateTime: new Date(endDateTime).toISOString() },
        extendedProperties: { private: { roombeltIsCheckedIn: isCheckedIn ? "true" : "false" } }
      }
    };

    await new Promise((res, rej) =>
      this.calendarClient.events.insert(query, (err, data) => (err ? rej(err) : res(data)))
    );
  }

  async patchEvent(calendarId, eventId, { startDateTime, endDateTime, isCheckedIn }) {
    cache.invalidate(`events-${this.cacheKey}-${calendarId}`);

    const resource = {};
    if (startDateTime) resource.start = { dateTime: new Date(startDateTime).toISOString() };
    if (endDateTime) resource.end = { dateTime: new Date(endDateTime).toISOString() };
    if (isCheckedIn) resource.extendedProperties = { private: { roombeltIsCheckedIn: "true" } };

    const query = {
      calendarId: encodeURIComponent(calendarId),
      eventId: encodeURIComponent(eventId),
      resource
    };

    await new Promise((res, rej) =>
      this.calendarClient.events.patch(query, (err, data) => (err ? rej(err) : res(data)))
    );
  }

  async deleteEvent(calendarId, eventId) {
    cache.invalidate(`events-${this.cacheKey}-${calendarId}`);

    const query = {
      calendarId: encodeURIComponent(calendarId),
      eventId: encodeURIComponent(eventId)
    };

    await new Promise((res, rej) =>
      this.calendarClient.events.delete(query, (err, data) => (err ? rej(err) : res(data)))
    );
  }

  async watchCalendars(token, ttl) {
    if (!this.webHookUrl) return { ttl: 0 };

    const channelId = crypto.randomBytes(64).toString("hex");

    await new Promise((res, rej) =>
      this.calendarClient.calendarList.watch(
        { resource: { id: channelId, token, type: "web_hook", address: this.webHookUrl, params: { ttl } } },
        (err, data) => (err ? rej(err) : res(data.data))
      )
    );

    return { channelId, token, ttl };
  }

  async watchEvents(calendarId, token, ttl) {
    if (!this.webHookUrl) return { ttl: 0 };

    const channelId = crypto.randomBytes(64).toString("hex");

    await new Promise((res, rej) => {
      this.calendarClient.events.watch(
        {
          calendarId,
          resource: { id: channelId, token, type: "web_hook", address: this.webHookUrl, params: { ttl } }
        },
        (err, data) => (err ? rej(err) : res(data.data))
      );
    });

    return { channelId, token, ttl };
  }
};

module.exports.cache = cache;