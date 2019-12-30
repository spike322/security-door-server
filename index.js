var mqtt = require('mqtt'),url = require('url')
var options = {
                port: 12489,
                username: 'bvsezqfd',
                password: 'z7YL9QScgIuL'
            };

var client = mqtt.connect('mqtt://tailor.cloudmqtt.com', options);

client.on('connect', function () {
    console.log('connected');
    client.subscribe('presence', function (err) {
        if (!err) {
          client.publish('presence', 'Hello mqtt')
        }
    })
});