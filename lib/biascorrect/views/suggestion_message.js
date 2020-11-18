const {button_correct, button_ignore, button_learn_more, bodyMessage} = require('../../../src/slack/helpText')

module.exports = {
  suggestion_message: ({
  DIVERSITY,
  BAD_WORD,
  REPLACEMENT,
  REASON,
  TEXT
  }) => ({
    "blocks":[
      {
        "type":"section",
        "text":{
            "type":"mrkdwn",
            "text":'Did you mean "'+TEXT.toLowerCase().replace(BAD_WORD, REPLACEMENT)+'"?'
        }
      }
    ],
    "attachments": [
      {
        "text": bodyMessage,
        "fallback": "corrector",
        "callback_id": "corrector",
        "color": "#ddd",
        "attachment_type": "default",
        "actions": [
            {
              "type": "button",
              "name": "correct",
              "text": button_correct,
              "style": "primary",
              "value": "correct_button",
            },
            {
              "type": "button",
              "name": "ignore",
              "text": button_ignore,
              "style": "danger",
              "value": "ignore_button",
            },
            {
              "type": "button",
              "name": "learn-more",
              "text": button_learn_more,
              "value": "learn_more_button",
          }
        ]
      }
    ],
  })
}