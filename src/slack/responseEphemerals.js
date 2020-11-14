module.exports = {
  updateResponseEphemeral: respond => respond({
    'response_type': 'ephemeral',
    'text': `The biases intrinsic in our language often lead us to stereotype and exclude. For instance, women and men with the same talents and skills are often described in very different ways due to unconscious bias, creating an invisible barrier to gender equality. Think about the words you use and how you might ensure they are more inclusive, which benefits everyone.`,
    'replace_original': true
  }),
  removeResponseEphemeral: respond => respond({
    'response_type': 'ephemeral',
    'text': '',
    'replace_original': true,
    'delete_original': true
  })
}
