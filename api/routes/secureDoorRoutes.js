'use strict';
module.exports = function(app) {
    var controller = require('../controllers/secureDoorController');

    app.route('/')
        .get(controller.provola);

    app.route('/users')
        .get(controller.getUsers)
        .post(controller.createUser);
};
