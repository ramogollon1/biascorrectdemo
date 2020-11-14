const {updateResponseEphemeral, removeResponseEphemeral} = require('./responseEphemerals')
const {corrections} = require('./corrections')
const {updateMessage} = require('./slackAPI')

let eventGlobal
module.exports = {
  events: (typeEvent, webClient, slackEvents) => slackEvents.on(typeEvent, async (event) => {
    if (event.bot_id) return
    try {
      eventGlobal = event
      console.log('event', event)
      corrections(event, webClient)
    } catch (e) {
      console.log(JSON.stringify(e))
    }
  }),
  actions: (callbackId, slackInteractions) => slackInteractions.action(callbackId, async (payload, respond) => {
    try {
      const {response_url, token, channel, action_ts} = payload
      const valueButton = payload.actions[0].value
      switch (valueButton) {
        case 'correct_button':
          updateMessage(process.env.SLACK_OAUTH_ACCESS_TOKEN, channel.id, eventGlobal, 'hola')
          removeResponseEphemeral(respond)
        break;
        case 'ignore_button':
          removeResponseEphemeral(respond)
        break;
        case 'learn_more_button':
          updateResponseEphemeral(respond)
        break;
        default:
          return
      }
    } catch (e){ 
     console.log(e)
    }
  }),
}