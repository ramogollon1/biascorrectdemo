const axios = require('axios');

module.exports = {
  updateMessage: async (token, channel, event, msg) => {
    const {ts, text: textOld} = event
    console.log('textOld', textOld)
    
    const url = 'https://slack.com/api/chat.update';
    const res = await axios.post(url, {
      channel,
      ts,
      as_user: true,
      text: msg
    }, { headers: { authorization: `Bearer ${token}` } }).then(function (response) {
      console.log('response', response.data)
    });
  }
}