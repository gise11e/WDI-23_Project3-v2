const router = require('express').Router();
const authController = require('../controllers/auth');
const usersController = require('../controllers/users');
const groupsController = require('../controllers/groups');
const sendEmailsController = require('../controllers/sendEmails');
const oauthController = require('../controllers/oauth');
const secureRoute = require('../lib/secureRoute');
const secureEmailRoute = require('../lib/secureRoute');

router
.post('/login', authController.login)
.post('/register', authController.register)
.post('/auth/facebook', oauthController.facebook);


router.route('/users')
.all(secureRoute.secureRoute)
.get(usersController.index);

router.route('/users/groups/:id')
.get(secureRoute.secureRoute, groupsController.getUsersGroups);

router.route('/users/:id')
.all(secureRoute.secureRoute)
.get(usersController.show)
.put(usersController.update)
.delete(usersController.delete);

router.route('/groups/:id')
.all(secureRoute.secureRoute)
.get(groupsController.show)
.put(groupsController.update);

router.route('/groups/:id/admin')
.get(groupsController.getGroupAdmin);


router.route('/groups')
.all(secureRoute.secureRoute)
.get(groupsController.index);
// .post(groupsController.create);






router.route('/gifts/:store/:keyword')
.get(usersController.gifts);

router.route('/groups/:id/draw')
.all(secureRoute.secureEmailRoute)
.put(groupsController.draw);


router
.all(secureRoute.secureEmailRoute)
.post('/sendEmail', sendEmailsController.send);



module.exports = router;
