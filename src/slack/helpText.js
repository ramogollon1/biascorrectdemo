module.exports = {
  button_correct: "Correct",
  button_ignore: "Ignore",
  button_learn_more: "Learn More",
  learn_more:
    "The biases intrinsic in our language often lead us to stereotype and exclude. For instance, women and men with the same talents and skills are often described in very different ways due to unconscious bias, creating an invisible barrier to gender equality. Think about the words you use and how you might ensure they are more inclusive, which benefits everyone.",
  bodyMessage:
    "Before you hit send, think about it...if she were a he, would you have chosen that word?",
  authorizeEphemoral: {
    attachments: [
      {
        text: "Hit authorize now to become a biascorrect for change",
        fallback: "corrector",
        callback_id: "corrector",
        color: "#ddd",
        attachment_type: "default",
        actions: [
          {
            type: "button",
            name: "authorize",
            text: "Authorize",
            style: "primary",
            url: `https://slack.com/oauth/v2/authorize?scope=channels:history,channels:read,chat:write,commands,groups:history,groups:read&user_scope=chat:write&client_id=${process.env.SLACK_CLIENT_ID}&tracked=1`,
            value: "authorize_button",
          },
          {
            type: "button",
            name: "ignore",
            text: "Ignore",
            style: "danger",
            value: "ignore_button",
          },
        ],
      },
    ],
  },
};
