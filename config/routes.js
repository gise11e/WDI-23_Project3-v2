const router = require('express').Router();
const authController = require('../controllers/auth');
const usersController = require('../controllers/users');
const groupsController = require('../controllers/groups');
const sendEmailsController = require('../controllers/sendEmails');
const oauthController = require('../controllers/oauth');



router
.post('/login', authController.login)
.post('/register', authController.register)
.post('/auth/facebook', oauthController.facebook);


router.route('/users')
.get(usersController.index);

router.route('/users/groups/:id')
.get(groupsController.getUsersGroups);

router.route('/users/:id')
.get(usersController.show)
.put(usersController.update)
.delete(usersController.delete);

router.route('/groups/:id')
.get(groupsController.show)
.put(groupsController.update);

router.route('/groups')
.get(groupsController.index);
// .post(groupsController.create);






router.route('/gifts/:store/:keyword')
.get(usersController.gifts);

router.route('/groups/:id/draw')
.put(groupsController.draw);


router
.post('/sendEmail', sendEmailsController.send);



module.exports = router;
