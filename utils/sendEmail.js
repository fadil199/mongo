require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const ejs = require("ejs");
const path = require("path");

const {
  GOOGLE_REFRESH_TOKEN3,
  GOOGLE_CLIENT_ID3,
  GOOGLE_CLIENT_SECRET3,
  GOOGLE_REDIRECT_URI3,
} = process.env;

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID3,
  GOOGLE_CLIENT_SECRET3,
  GOOGLE_REDIRECT_URI3
);

oauth2Client.setCredentials({
  refresh_token: GOOGLE_REFRESH_TOKEN3,
});

module.exports = {
  sendEmail: async (to, subject, html) => {
    return new Promise(async (resolve, reject) => {
      try {
        const accessToken = await oauth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
          service: "gmail",
          auth: {
            type: "OAuth2",
            user: "achmadfadilla197@gmail.com",
            clientId: GOOGLE_CLIENT_ID3,
            clientSecret: GOOGLE_CLIENT_SECRET3,
            refreshToken: GOOGLE_REFRESH_TOKEN3,
            accessToken: accessToken,
          },
        });

        const mailOptions = {
          to,
          subject,
          html,
        };

        const response = transport.sendMail(mailOptions);
        resolve(response);
      } catch (err) {
        reject(err);
      }
    });
  },

  getHtml: async (filename, data) => {
    return new Promise((resolve, reject) => {
      const path = __dirname + "/../views/" + filename;

      ejs.renderFile(path, data, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  },

  getHtml1: async (filename, data) => {
    return new Promise((resolve, reject) => {
      const p = __dirname + "/../views/" + filename;

      ejs.renderFile(p, data, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  },
};
