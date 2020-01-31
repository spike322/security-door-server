'use strict';
module.exports = function(app) {
    var controller = require('../controllers/secureDoorController');

    app.route('/').get((req, res) => {
        res.status(200).json({ info: 'Welcome to the secure door server '} );
    });

    app.route('/users')
        .get(controller.getUsers)
        .post(controller.createUser);

    app.route('/users/:id')
        .get(controller.getUsersById)
        .delete(controller.deleteUser);


    /*app.route('/users/enter').post(async (req, res) => {
        const access = await controller.enter(req.body.uid)
        .then(function() { res.send({access: 'ok'}); });
    });*/
    app.route('/users/enter')
        .post(controller.enter);
};
