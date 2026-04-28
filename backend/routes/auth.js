const express = require('express');
const router = express.Router();
const { registerUser, loginUser, refreshToken, logoutUser } = require('../controllers/authController');
const validate = require('../middleware/validationMiddleware');
const { registerSchema, loginSchema } = require('../validations/authValidation');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.post('/refresh', refreshToken);
router.post('/logout', protect, logoutUser);

module.exports = router;