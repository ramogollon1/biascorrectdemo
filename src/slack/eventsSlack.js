const {removeResponseEphemeral} = require('./responseEphemerals')
const {corrections} = require('./corrections')
const {updateMessage, postEphemeral} = require('./slackAPI')
const {learn_more} = require('./helpText')

let eventGlobal
module.exports = {
  events: (typeEvent, webClient, slackEvents) => slackEvents.on(typeEvent, async (event) => {
    if (event.bot_id) return
    try {
      eventGlobal = event
      const responseCorrection = corrections(event, webClient)
      eventGlobal.corrections = responseCorrection
      console.log('corrections', responseCorrection)
    } catch (e) {
      console.log(JSON.stringify(e))
    }
  }),
  actions: (callbackId, webClient, slackInteractions) => slackInteractions.action(callbackId, (payload, respond) => {
    try {
      const {channel} = payload
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
          postEphemeral(webClient, user, channelUser, learn_more)
        break;
        default:
          return
      }
    } catch (e){ 
     console.log(e)
    }
  }),
}