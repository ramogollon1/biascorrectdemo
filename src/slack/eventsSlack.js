const {updateResponseEphemeral, removeResponseEphemeral} = require('./responseEphemerals')
const {corrections} = require('./corrections')
const {updateMessage} = require('./slackAPI')
const { randomValue } = require('./services');

let eventGlobal
module.exports = {
  events: (typeEvent, webClient, slackEvents) => slackEvents.on(typeEvent, async (event) => {
    if (event.bot_id) return
    try {
      eventGlobal = event
      // console.log('event', event)
      const responseCorrection = corrections(event, webClient)
      console.log('responseCorrection', responseCorrection);
      eventGlobal.corrections = responseCorrection
    } catch (e) {
      console.log(JSON.stringify(e))
    }
  }),
  actions: (callbackId, webClient, slackInteractions) => slackInteractions.action(callbackId, async (payload, respond) => {
    try {
      const {response_url, token, channel, action_ts} = payload
      console.log('payload', payload)
      const {user, channel: channelUser} = eventGlobal
      const valueButton = payload.actions[0].value
      switch (valueButton) {
        case 'correct_button':
          updateMessage(process.env.SLACK_OAUTH_ACCESS_TOKEN, channel.id, eventGlobal)
          removeResponseEphemeral(respond)
        break;
        case 'ignore_button':
          removeResponseEphemeral(respond)
        break;
        case 'learn_more_button':
          console.log('eventGlobal', eventGlobal)
          await webClient.chat.postEphemeral({user, channel: channelUser, text: 'hola'})
          // updateResponseEphemeral(respond)
        break;
        default:
          return
      }
    } catch (e){ 
     console.log(e)
    }
  }),
}