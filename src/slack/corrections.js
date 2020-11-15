const biascorrect = require('../../lib/biascorrect/biascorrect')
const biascorrect_views = require('../../lib/biascorrect/views/suggestion_message')
const { randomValue } = require('./services')
const suggestion_message = biascorrect_views.suggestion_message

module.exports = {
  corrections: (event, webClient) => {
    const {text, user, channel} = event
    const props = {text, user, channel}
    const corrections = biascorrect.BIAS_CORRECTION(text)
    const _correction = randomValue(corrections);
    if (!_correction.length || !corrections.length) return
    _correction.map( async correction => {
      correction.TEXT = text
      const mentionResponseBlock = { ...suggestion_message(correction), ...props}
      await webClient.chat.postEphemeral(mentionResponseBlock)
    })
    return _correction
  }
}