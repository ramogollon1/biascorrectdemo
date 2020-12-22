module.exports = {
  updateResponseEphemeral: async (payload) => {
    try {
      console.log("updateResponseEphemeral");
      const {
        channel: { id: channelId },
        user: { id: userId },
      } = payload;
      console.log("channelId", channelId);
      console.log("userId", userId);
      // Call the chat.postEphemeral method using the WebClient
      const result = await client.chat.postEphemeral({
        channel: channelId,
        user: userId,
        text: "Shhhh only you can see this :shushing_face:",
      });

      console.log(result);
    } catch (error) {
      console.error("Error in updateResponseEphemeral =>", error);
    }
  },

  removeResponseEphemeral: async (respond) =>
    respond({
      response_type: "ephemeral",
      text: "",
      replace_original: true,
      delete_original: true,
    }),
};
