const biascorrect = require('../../lib/biascorrect/biascorrect')
const biascorrect_views = require('../../lib/biascorrect/views/suggestion_message')
const {randomValue, randomValue2 } = require('./services')
const suggestion_message = biascorrect_views.suggestion_message

module.exports = {
  corrections: (event, webClient) => {
    const {text, user, channel} = event
    const props = {text, user, channel}
    const corrections = biascorrect.BIAS_CORRECTION(text)
    // console.log('corrections', corrections);
    corrections.forEach((elem, i) => {
      corrections[i] = randomValue2(corrections[i], text)
    })
    // console.log('corrections', corrections)
    const _correction = randomValue(corrections[0]);
    // console.log('_correction', _correction)
    if (!_correction.length || !corrections.length) return
    _correction.map( async correction => {
      // correction.TEXT = text
      const mentionResponseBlock = { ...suggestion_message(correction), ...props}
      const postEphemeral = await webClient.chat.postEphemeral(mentionResponseBlock)
    })
    
    return _correction
  }
}