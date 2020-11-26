const express = require("express");
const bodyParser = require("body-parser");
const { createEventAdapter } = require("@slack/events-api");
const { createMessageAdapter } = require("@slack/interactive-messages");
const { WebClient } = require("@slack/web-api");
require("dotenv").config();
const { events, actions } = require("./slack/eventsSlack");
const axios = require("axios");
const qs = require("querystring");

var redis = require("redis");

var client = redis.createClient();
client.on("connect", function () {
  console.log("Conectado a Redis Server");
});

let AUTH_TOKEN;

const app = express();
const token = process.env.SLACK_OAUTH_ACCESS_TOKEN;
const webClient = new WebClient(token);
const port = process.env.PORT || 3000;

const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);
const slackInteractions = createMessageAdapter(
  process.env.SLACK_SIGNING_SECRET
);

app.use("/slack/events", slackEvents.expressMiddleware());
app.use("/slack/actions", slackInteractions.expressMiddleware());

// client.lrange("tokenArray2", 0, -1, function (err, token) {
//   console.log("token", token);
// });

app.use("/slack/auth", (req, res, next) => {
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  const requestBody = {
    client_id: process.env.SLACK_CLIENT_ID,
    client_secret: process.env.SLACK_CLIENT_SECRET,
    code: req.query.code,
  };
  axios
    .post(
      `https://slack.com/api/oauth.v2.access`,
      qs.stringify(requestBody),
      config
    )
    .then((response) => {
      const {
        authed_user: { id, access_token },
      } = response.data;

      client.lrange("tokenArray2", 0, -1, function (err, token) {
        const findToken = token.find((elem) => {
          const element = JSON.parse(elem);
          AUTH_TOKEN = element;
          return element.id === id;
        });
        if (!findToken) {
          client.lpush("tokenArray2", JSON.stringify({ id, access_token }));
        }
      });

      res.status(200).send(`<pre>${JSON.stringify(response.data)}</pre>`);
    })
    .catch((error) => {
      res.status(400).send(JSON.stringify(error));
    });
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

events("message", webClient, slackEvents);
actions("corrector", webClient, slackInteractions);

app.listen(port, () => {
  console.log("Bot is listening on port " + port);
});
