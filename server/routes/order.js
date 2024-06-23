const express = require('express');

const { createOrder, updateOrder, deleteOrder, getUserOrderById, getOrders, getMonthlyIncome,getOrderByProviderId,
     getProductOrders
} = require('../controllers/order');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../middlewares/verifyToken');

const router = express.Router();

// POST => /api/orders 
router.post('/', createOrder);

// PATCH => /api/orders/:id
router.patch('/:id', verifyTokenAndAdmin, updateOrder);

// DELETE => /api/orders/:id
router.delete('/:id', deleteOrder);

// GET => /api/orders/:userId
router.get('/:id', verifyTokenAndAuthorization, getUserOrderById);

router.get('/provider/:id',verifyTokenAndAuthorization, getOrderByProviderId);

// GET => /api/orders
router.get('/', getOrders);

// GET => /api/orders/stats
router.get('/stats', verifyTokenAndAdmin, getMonthlyIncome);

router.get('/product-orders/:productId', getProductOrders);

module.exports = router;