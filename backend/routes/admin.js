const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { getAllUsers, getAllOrders, deleteUser } = require('../controllers/adminController');

router.use(protect, admin);
router.get('/users', getAllUsers);
router.get('/orders', getAllOrders);
router.delete('/users/:id', deleteUser);

module.exports = router;