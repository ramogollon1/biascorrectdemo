const axios = require('axios');

module.exports = {
  updateMessage: async (token, channel, event) => {
    const {corrections, ts, text: textOld} = event
    const url = 'https://slack.com/api/chat.update';
    const message = textOld.replace(corrections[0].BAD_WORD, corrections[0].REPLACEMENT)
    console.log('message', message)
    const res = await axios.post(url, {
      channel,
      ts,
      as_user: true,
      text: message
    }, { headers: { authorization: `Bearer ${token}` } }).then(function (response) {
      console.log('response', response.data)
    });
  }
}