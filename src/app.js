const express = require('express')
const bodyParser = require('body-parser')
const { createEventAdapter } = require('@slack/events-api')
const { createMessageAdapter } = require('@slack/interactive-messages')
const { WebClient } = require('@slack/web-api')
require('dotenv').config()
const { events, actions} = require('./slack/eventsSlack')

const app = express()
const token = process.env.SLACK_BOT_TOKEN
const webClient = new WebClient(token)
const port = process.env.PORT || 3000

const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET)
const slackInteractions = createMessageAdapter(process.env.SLACK_SIGNING_SECRET)


app.use('/slack/events', slackEvents.expressMiddleware())
app.use('/slack/actions', slackInteractions.expressMiddleware())

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

events('message', webClient, slackEvents)
actions('corrector', slackInteractions)

// Starts server
app.listen(port, function() {
  console.log('Bot is listening on port ' + port)
})
