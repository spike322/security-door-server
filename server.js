const request = require('request')
const TelegramBot = require('node-telegram-bot-api')
const token = '1021113423:AAHhwOc6JSO3SZ0Mw9cYsSoo8uparSb8eE0'//process.env.BOT_TOKEN
const chatId = 217441027//process.env.CHAT_ID
const bot = new TelegramBot(token, {polling: true})
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routes = require('./api/routes/secureDoorRoutes'); //importing route
routes(app); //register the route


app.listen(port);


console.log('Secure Door RESTful API server started on: ' + port);

var mqtt = require('mqtt'),url = require('url')
var options = {
                port: 12489,
                username: 'bvsezqfd',
                password: 'z7YL9QScgIuL'
            };

var client = mqtt.connect('mqtt://tailor.cloudmqtt.com', options);

client.on('connect', function () {
    console.log('- Server is connected to the MQTT Broker');
    client.subscribe('access/request', function (err) {
      if (!err) {
        console.log('- Subscribed to topic: access/request')
      }
    })
    client.subscribe('access/response', function (err) {
      if (!err) {
        console.log('- Subscribed to topic: access/response')
      }
    })
    client.subscribe('register/request', function (err) {
      if (!err) {
        console.log('- Subscribed to topic: register/request')
      }
    })
    client.subscribe('register/response', function (err) {
      if (!err) {
        console.log('- Subscribed to topic: register/response')
      }
    })
    client.subscribe('delete/request', function (err) {
      if (!err) {
        console.log('- Subscribed to topic: delete/request')
      }
    })
    client.subscribe('delete/response', function (err) {
      if (!err) {
        console.log('- Subscribed to topic: delete/response')
      }
    })
    client.subscribe('emergency/lock', function (err) {
      if (!err) {
        console.log('- Subscribed to topic: emergency/lock')
      }
    })
});

client.on('message', async function (topic, message) {
  console.log(topic.toString() + ': ' + message.toString())
  if (topic === 'access/request') {
    request.post('http://localhost:3000/users/enter', {
      json: {
        uid: message.toString()
      }
    }, (error, res, body) => {
      if (error) {
        console.error(error)
        return
      }
      statusCode = body['info'].toString();
      console.log(`statusCode: ${statusCode}`)

      bot.sendMessage(chatId, 'Access attempt from: ' + message.toString() + '\nStatus: ' + statusCode)
      
      client.publish('access/response', statusCode)
    })
  } else if (topic === 'register/request') {
    const json = JSON.parse(message.toString());
    const newCard = json.newCard;
    const admin = json.admin;

    request.post('http://localhost:3000/users', {
      json: {
        newCard: newCard,
        admin: admin
      }
    }, (error, res, body) => {
      if (error) {
        console.error(error)
        return
      }
      statusCode = body['info'].toString();
      console.log(`statusCode: ${statusCode}`)

      client.publish('register/response', statusCode)
    })
  } else if (topic === 'delete/request') {
    const json = JSON.parse(message.toString());
    const uid = json.deleteUid;
    const admin = json.admin;

    request.delete('http://localhost:3000/users/'+uid, {
      json: {
        admin: admin
      }
    }, (error, res, body) => {
      if (error) {
        console.error(error)
        return
      }
      statusCode = body['info'].toString();
      console.log(`statusCode: ${statusCode}`)

      client.publish('delete/response', statusCode)
    })
  }
});

bot.onText(/\/lock/, (msg, match) => {
  client.publish('emergency/lock', 'lock');
})

