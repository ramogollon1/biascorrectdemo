const axios = require("axios");

module.exports = {
  getListUsers: async (webClient) => {
    try {
      const fetchUsers = await webClient.users.list();
      return fetchUsers.members.filter(
        (user) => user.real_name == process.env.SLACK_NAME_APP
      );
    } catch (error) {
      console.error("getListUsers => " + error);
    }
  },
  updateMessage: async (token, channel, event) => {
    const { corrections, ts, text: textOld } = event;
    const url = "https://slack.com/api/chat.update";
    const correctionsResponse = await corrections;
    const message = textOld.replace(
      correctionsResponse[0].BAD_WORD,
      correctionsResponse[0].REPLACEMENT
    );
    await axios
      .post(
        url,
        {
          channel,
          ts,
          as_user: true,
          text: message,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("response", response.data);
      });
  },
  postEphemeral: async (webClient, user, channel, text) =>
    await webClient.chat.postEphemeral({ user, channel, text }),
  postMessage: (webClient, user, channel, text) =>
    webClient.chat.postMessage({ user, channel, text }),
};
