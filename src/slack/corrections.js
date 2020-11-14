const biascorrect = require('../../lib/biascorrect/biascorrect')
const biascorrect_views = require('../../lib/biascorrect/views/suggestion_message')
const suggestion_message = biascorrect_views.suggestion_message

module.exports = {
  corrections: (event, webClient) => {
    const {text, user, channel} = event
    const props = {text, user, channel}
    const corrections = biascorrect.BIAS_CORRECTION(text)
    if (!corrections.length) return
    corrections.map( async correction => {
      const mentionResponseBlock = { ...suggestion_message(correction), ...props}
      const postEphemeral = await webClient.chat.postEphemeral(mentionResponseBlock)
    })
  }
}