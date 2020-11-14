
exports.suggestion_message = ({
  DIVERSITY,
  BAD_WORD,
  REPLACEMENT,
  REASON
}) => ({
  "blocks":[
    {
      "type":"section",
      "text":{
          "type":"mrkdwn",
          "text":'Did you mean "'+REPLACEMENT+'"?'
      }
    }
  ],
  "attachments": [
    {
      "text": "Before you hit send, think about it...if she were a he, would you have chosen that word?",
      "fallback": "corrector",
      "callback_id": "corrector",
      "color": "#ddd",
      "attachment_type": "default",
      "actions": [
          {
            "type": "button",
            "name": "correct",
            "text": "Correct",
            "style": "primary",
            "value": "correct_button",
          },
          {
            "type": "button",
            "name": "ignore",
            "text": "Ignore",
            "style": "danger",
            "value": "ignore_button",
          },
          {
            "type": "button",
            "name": "learn-more",
            "text": "Learn More",
            "value": "learn_more_button",
        }
      ]
    }
  ],
})
