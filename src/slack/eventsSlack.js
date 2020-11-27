const { removeResponseEphemeral } = require("./responseEphemerals");
const { corrections } = require("./corrections");
const { updateMessage, postEphemeral } = require("./slackAPI");
const { learn_more, authorizeEphemoral } = require("./helpText");

var redis = require("redis");
var client = redis.createClient();

let eventGlobal;
let APP_AUTHORIZE = false;
let TOKENS;
module.exports = {
  events: (typeEvent, webClient, slackEvents) =>
    slackEvents.on(typeEvent, async (event) => {
      try {
        eventGlobal = event;
        const responseCorrection = corrections(event, webClient);
        eventGlobal.corrections = responseCorrection;
        if (eventGlobal.text.includes("U01EZKN7DQ8")) {
          client.get("tokens", function (err, reply) {
            TOKENS = reply;
          });
          APP_AUTHORIZE = true;
          await webClient.chat.postEphemeral({
            attachments: authorizeEphemoral.attachments,
            text: "",
            user: event.user,
            channel: event.channel,
          });
        }
      } catch (e) {
        console.log(JSON.stringify(e));
      }
    }),
  actions: (callbackId, webClient, slackInteractions) =>
    slackInteractions.action(callbackId, async (payload, respond) => {
      try {
        const { user, token, channel, response_url } = payload;
        const valueButton = payload.actions[0].value;
        switch (valueButton) {
          case "correct_button":
            client.lrange("tokenArray2", 0, -1, function (err, token) {
              const findToken = token.find((elem) => {
                const element = JSON.parse(elem);
                AUTH_TOKEN = element;
                return element.id === user.id;
              });
              let findTokenParsed = JSON.parse(findToken);
              updateMessage(
                findTokenParsed.access_token,
                channel.id,
                eventGlobal
              );
              removeResponseEphemeral(respond);
            });
            break;
          case "ignore_button":
            removeResponseEphemeral(respond);
            break;
          case "learn_more_button":
            postEphemeral(webClient, user.id, channel.id, learn_more);
            break;
          default:
            return;
        }
      } catch (e) {
        console.log(e);
      }
    }),
};
