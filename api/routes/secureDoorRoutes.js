'use strict';
module.exports = function(app) {
    var controller = require('../controllers/secureDoorController');

    app.route('/').get((req, res) => {
        res.status(200).json({ info: 'Welcome to the secure door server '} );
    });

    app.route('/users')
        .get(controller.getUsers)
        .post(controller.createUser);

    app.route('/users/debug')
        .post(controller.createUserDebug);

    app.route('/users/:uid')
        .get(controller.getUsersById)
        .delete(controller.deleteUser);

    app.route('/users/enter')
        .post(controller.enter);
};
