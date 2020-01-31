const request = require('request')
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
    client.subscribe('access/allowed', function (err) {
      if (!err) {
        console.log('- Subscribed to topic: access/allowed')
      }
    })
    client.subscribe('register/new', function (err) {
      if (!err) {
        console.log('- Subscribed to topic: register/new')
      }
    })
    client.subscribe('register/allowed', function (err) {
      if (!err) {
        console.log('- Subscribed to topic: register/allowed')
      }
    })
    client.subscribe('register/denied', function (err) {
      if (!err) {
        console.log('- Subscribed to topic: register/denied')
      }
    })
});

client.on('message', async function (topic, message) {
  if (topic === 'access/request') {
    console.log(topic.toString() + ': ' + message.toString())

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

      if (statusCode === 'success') {
        client.publish('access/allowed', statusCode)
      } else if (statusCode === 'not allowed') {
        client.publish('access/denied', statusCode)
      }
    })
  } else if (topic === 'register/new') {
    
  }
});

