const { google } = require("googleapis");

const { GOOGLE_CLIENT_SECRET3, GOOGLE_CLIENT_ID3, GOOGLE_REDIRECT_URI3 } =
  process.env;

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID3,
  GOOGLE_CLIENT_SECRET3,
  GOOGLE_REDIRECT_URI3
);
module.exports = {
  generateAuthURL: () => {
    const scopes = [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ];
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      response_type: "code",
      scope: scopes,
    });
    return authUrl;
  },

  setCredentials: async (code) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        return resolve(tokens);
      } catch (error) {
        return reject(error);
      }
    });
  },

  getUserData: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const oauth2 = google.oauth2({
          auth: oauth2Client,
          version: "v2",
        });

        oauth2.userinfo.get((err, res) => {
          if (err) return reject(err);
          else return resolve(res);
        });
      } catch (error) {
        return reject(error);
      }
    });
  },
};
