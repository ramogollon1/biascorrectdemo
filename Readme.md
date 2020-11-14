# Description 
The Community is building a bias correction Slack app which is based on Catalyst.org's [Bias Corrector Slack app](https://thecommunity.slack.com/apps/ATV7MJXL6-biascorrect-plug-in) and it's [open-source codebase](https://github.com/willowtreeapps/catalyst-slack-service). Our app is a simplified version of the original, that expands beyond gender bias to correct for racial, sexual orientation, religious, and other bias.

Our app listens for "trigger terms" (provided by a TSV), combined with specific pronouns, posted in messages in channels which the app has been added to. The app then replies in a private alert to the user, offering a correction for the trigger word they used. It has interactivity which allows the user to accept the change, ignore it, or visit an external link to learn more.


## RUN 
for fast local iteration use:
- console 1: ngrok http 8080
- console 2: node app.js

Then go over at https://api.slack.com/apps/A01BK2VGZ43/event-subscriptions
and change the **Enable Events**.**Request URL** to the ngrok url to get from the first console, and add a /slack/events suffix to that url, paste that and you are set, you are good to go. Don't forget to 'Save changes'.

## RUN
for staging at AWS:
Grab the folders internal to this repository, and compact them onto a .zip file. Then drag and drop that over ElasticBeanStalk for a quick deploy
Then grab the url provided by ElasticBeanStalk, and use that instead of the url we talked about in the paragraph below

Remember to use the Amazon Linux 64 bit Version 1 -- instead of the default which is the version 2

