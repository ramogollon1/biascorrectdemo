const express = require("express");
const bodyParser = require("body-parser");
const { createEventAdapter } = require("@slack/events-api");
const { createMessageAdapter } = require("@slack/interactive-messages");
const { WebClient } = require("@slack/web-api");
require("dotenv").config();
const { events, actions } = require("./slack/eventsSlack");
const axios = require("axios");
const qs = require("querystring");
const { CLIENT_REDIS } = require("./slack/redis");
const { getListUsers } = require("./slack/slackAPI");

const app = express();
const token = process.env.SLACK_BOT_TOKEN;
const webClient = new WebClient(token);
const port = process.env.PORT || 3000;

const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);
const slackInteractions = createMessageAdapter(
  process.env.SLACK_SIGNING_SECRET
);
const init = async () => {
  const getInfoBot = await getListUsers(webClient);
  events("message", webClient, slackEvents, getInfoBot);
  actions("corrector", webClient, slackInteractions, token);
};

init();

app.use("/slack/events", slackEvents.expressMiddleware());
app.use("/slack/actions", slackInteractions.expressMiddleware());

// CLIENT_REDIS.lrange("tokens", 0, -1, function (err, token) {
//   console.log("token", token);
// });

app.use("/slack/auth", (req, res, next) => {
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  console.log("req.query", req.query);
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

      if (response.status !== 200) return;

      CLIENT_REDIS.lrange("tokens", 0, -1, function (err, token) {
        const findToken = token.find((elem) => {
          const element = JSON.parse(elem);
          return element.id === id;
        });
        if (!findToken) {
          CLIENT_REDIS.lpush("tokens", JSON.stringify({ id, access_token }));
        }
      });
      res.send("<script>document.write('Close this window');</script>");
    })
    .catch((error) => {
      res.status(400).send(JSON.stringify(error));
    });
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(port, () => {
  console.log("Bot is listening on port " + port);
});

CLIENT_REDIS.on("connect", function () {
  console.log("Conectado a Redis Server");
});

CLIENT_REDIS.on("error", function (err) {
  console.log("Error " + err);
});
