const simpleOAuth2 = require("simple-oauth2");
const jwt = require("jsonwebtoken");
const graph = require("@microsoft/microsoft-graph-client");
const Moment = require("moment");
const ms = require("ms");
const Cache = require("./cache");

const isCheckedInExtension = "Com.Roombelt.IsCheckedIn";

const getTime = (time, isAllDayEvent) => {
  if (!time) {
    return null;
  }

  const [year, month, day, hour, minute, second] = Moment.utc(time.dateTime).toArray();
  return { year, month, day, hour, minute, second, isTimeZoneFixedToUTC: !isAllDayEvent };
};

const authProvider = (oauth2, credentials) => {
  const authCache = Cache("office365-cache");

  return async cb => {
    if (!credentials || !credentials.refreshToken) {
      return cb(null, null);
    }

    let authData = authCache.get(credentials.userId) || { expiration: 0 };

    if (Date.now() > authData.expiration - ms("5 min")) {
      const { token } = await oauth2.accessToken.create({ refresh_token: credentials.refreshToken }).refresh();
      authData = { expiration: token.expires_at.getTime(), accessToken: token.access_token };
      authCache.set(credentials.userId, authData);
    }

    cb(null, authData.accessToken);
  };
};


module.exports = class {
  constructor(config, credentials) {
    this.oauth2 = simpleOAuth2.create({
      client: {
        id: config.clientId,
        secret: config.clientSecret
      },
      auth: {
        tokenHost: "https://login.microsoftonline.com",
        authorizePath: "common/oauth2/v2.0/authorize",
        tokenPath: "common/oauth2/v2.0/token"
      }
    });

    this.client = graph.Client.init({
      authProvider: authProvider(this.oauth2, credentials)
    });

    this.clientId = config.clientId;
    this.redirectUrl = config.redirectUrl;
    this.authScope = "openid profile offline_access User.Read Calendars.ReadWrite";
  }

  getAuthUrl() {
    return this.oauth2.authorizationCode.authorizeURL({
      redirect_uri: this.redirectUrl,
      scope: this.authScope
    });
  }

  async getAuthTokens(authCode) {
    let result = await this.oauth2.authorizationCode.getToken({
      code: authCode,
      redirect_uri: this.redirectUrl,
      scope: this.authScope
    });

    const { token } = this.oauth2.accessToken.create(result);

    const user = jwt.decode(token.id_token);

    if (user.aud !== this.clientId) {
      throw new Error("Invalid auth token");
    }

    return {
      provider: "office365",
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      idToken: token.id_token,
      userId: user.sub
    };
  }

  async isAccessTokenValid() {
    try {
      await this.client.api("/me").get();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getUserDetails() {
    const userDetails = await this.client.api("/me").get();
    const photo = this.client.api("/me/photo/$value").get().then(value => value, () => null);

    return {
      displayName: (userDetails.displayName) || "Unknown",
      photoUrl: photo || "",
      email: (userDetails.mail) || ""
    };
  }

  async getCalendars() {
    const { value } = await this.client.api("/me/calendars").get();
    return value.map(calendar => ({
      id: calendar.id,
      summary: calendar.name,
      canModifyEvents: calendar.canEdit
    }));
  }

  async getCalendar(calendarId) {
    const calendars = await this.getCalendars();
    return calendars.find(calendar => calendar.id === calendarId);
  }

  async getEvents(calendarId) {
    const { value } = await this.client.api(`/me/calendars/${encodeURIComponent(calendarId)}/events`)
      .query({
        StartDateTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        EndDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        $expand: `extensions($filter=id eq '${isCheckedInExtension}')`
      })
      .header("Prefer", `outlook.timezone="UTC"`)
      .get();

    return value.map(event => ({
      id: event.id,
      summary: event.subject,
      organizer: { displayName: event.organizer && event.organizer.emailAddress && event.organizer.emailAddress.name },
      isAllDayEvent: event.isAllDay,
      start: getTime(event.start, event.isAllDay),
      end: getTime(event.end, event.isAllDay),
      attendees: event.attendees.map(attendee => ({ displayName: attendee.emailAddress && attendee.emailAddress.name })),      // TODO
      isCheckedIn: event.extensions ? event.extensions.some(el => el.isCheckedIn) : false,
      isPrivate: event.sensitivity === "private"
    }));
  }

  async createEvent(calendarId, { startDateTime, endDateTime, isCheckedIn, summary }) {
    await this.client.api(`/me/calendars/${encodeURIComponent(calendarId)}/events`).post({
      subject: summary,
      start: { timezone: "UTC", dateTime: Moment(startDateTime).toISOString(false) },
      end: { timezone: "UTC", dateTime: Moment(endDateTime).toISOString(false) },
      extensions: [{
        "@odata.type": "microsoft.graph.openTypeExtension",
        extensionName: isCheckedInExtension,
        isCheckedIn
      }]
    });
  }

  async patchEvent(calendarId, eventId, { startDateTime, endDateTime, isCheckedIn }) {
    const path = `/me/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`;

    if (isCheckedIn) {
      await this.client.api(`${path}/extensions/${isCheckedInExtension}`)
        .patch({
          "@odata.type": "microsoft.graph.openTypeExtension",
          extensionName: isCheckedInExtension,
          isCheckedIn: true
        });
    }

    const resource = {};
    if (startDateTime) resource.start = { timezone: "UTC", dateTime: Moment(startDateTime).toISOString(false) };
    if (endDateTime) resource.end = { timezone: "UTC", dateTime: Moment(endDateTime).toISOString(false) };
    await this.client.api(path).patch(resource);
  }

  async deleteEvent(calendarId, eventId) {
    await this.client.api(`/me/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`).delete();
  }
};
