// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const Chat = require('../models/Chat');
const User = require('../models/User')

router.get('/profile/:id', authController.profile);
router.get('/publicprofile/:id', authController.publicProfile);


router.route('/change-password').post(authController.changePassword);
router.route('/profile/:userId').put(authController.editProfile);
router.route('/forgot-password').post(authController.sendResetCode);
router.route('/verify-reset-code').post(authController.verifyResetCode);
router.route('/reset-password').post(authController.resetPassword);

router.route('/send-verification-code').post(authController.sendVerificationCode);
router.route('/verify-email-code').post(authController.verifyEmailCode);


router.route('/message').get(authController.getMessage)

router.route('/message').post(authController.postMessage)




module.exports = router;