const biascorrect = require("../../lib/biascorrect/biascorrect");
const biascorrect_views = require("../../lib/biascorrect/views/suggestion_message");
const { randomValue } = require("./services");
const suggestion_message = biascorrect_views.suggestion_message;

module.exports = {
  corrections: async (event, webClient) => {
    const { text, user, channel } = event;
    const props = { text, user, channel };
    const corrections = biascorrect.BIAS_CORRECTION(text);
    const _correction = randomValue(corrections);
    if (!_correction.length) return;
    const correctionMessage = await _correction.map((correction) => {
      correction.TEXT = text;
      const mentionResponseBlock = {
        ...suggestion_message(correction),
        ...props,
      };
      return mentionResponseBlock;
    });
    webClient.chat.postEphemeral(correctionMessage[0]);
    return _correction;
  },
};
