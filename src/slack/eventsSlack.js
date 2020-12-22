const { removeResponseEphemeral } = require("./responseEphemerals");
const { corrections } = require("./corrections");
const { isObjectEmpty } = require("./services");
const { updateMessage, postEphemeral } = require("./slackAPI");
const { learn_more, authorizeEphemoral } = require("./helpText");
const { CLIENT_REDIS } = require("./redis");

let eventGlobal;
// let APP_AUTHORIZE = false;
// let TOKENS;
module.exports = {
  events: (typeEvent, webClient, slackEvents, getInfoBot) =>
    slackEvents.on(typeEvent, async (event) => {
      try {
        const botId = getInfoBot[0].id;
        eventGlobal = event;
        CLIENT_REDIS.lrange("tokens", 0, -1, async (err, reply) => {
          let tokensAuthenticated = reply;
          const tokenFiltered = tokensAuthenticated.filter(
            (token) => JSON.parse(token).id === event.user
          );
          if (tokenFiltered.length > 0) {
            const isCallMember = /(@)[a-zA-Z0-9]+/.test(event.text);
            if (!isCallMember) {
              const responseCorrection = corrections(event, webClient);
              eventGlobal.corrections = responseCorrection;
            }
          } else {
            if (!eventGlobal.text) return;
            if (eventGlobal.text.includes(botId)) {
              await webClient.chat.postEphemeral({
                attachments: authorizeEphemoral.attachments,
                text: "",
                user: event.user,
                channel: event.channel,
              });
            }
          }
        });
      } catch (e) {
        console.log("eventsSlack module events: " + JSON.stringify(e));
      }
    }),
  actions: (callbackId, webClient, slackInteractions, tokenUser) =>
    slackInteractions.action(callbackId, async (payload, respond) => {
      try {
        const { user, token, channel, response_url } = payload;
        const valueButton = payload.actions[0].value;
        switch (valueButton) {
          case "correct_button":
            CLIENT_REDIS.lrange("tokens", 0, -1, function (err, token) {
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
        console.log("actions: " + JSON.stringify(e));
      }
    }),
};
