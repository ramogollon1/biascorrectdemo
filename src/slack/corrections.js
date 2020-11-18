const biascorrect = require('../../lib/biascorrect/biascorrect')
const biascorrect_views = require('../../lib/biascorrect/views/suggestion_message')
const {randomValue } = require('./services')
const suggestion_message = biascorrect_views.suggestion_message

module.exports = {
  corrections: (event, webClient) => {
    const {text, user, channel} = event
    const props = {text, user, channel}
    const corrections = biascorrect.BIAS_CORRECTION(text)
    let correctionsArray = []
    corrections.forEach((elem, i) => {
      corrections[i] = randomValue(corrections[i])
      correctionsArray.push(corrections[i][0])
    })
    if (!correctionsArray.length || !corrections.length) return
    let newText = text
    let sizeCorrection = (correctionsArray.length - 1)
    correctionsArray.map( async (correction, index) => {
      if(correction && correction.BAD_WORD){
        correction.TEXT = newText.toLowerCase().replace(correction.BAD_WORD, correction.REPLACEMENT)
        newText = correction.TEXT
      }
      if (sizeCorrection === index) {
        const mentionResponseBlock = { ...suggestion_message(correction), ...props}
        const postEphemeral = await webClient.chat.postEphemeral(mentionResponseBlock)
      }
    })
    return correctionsArray
  }
}