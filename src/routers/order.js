import express from 'express';
import Order from '../schema/Order.js'; // ✅ Исправлено с "Oreder"
import User from '../schema/User.js';

const router = express.Router();

/**
 * GET /api/orders?userId=xxx
 * Get orders for a specific user (no auth)
 */
router.get('/orders', async (req, res) => {
  try {
    // const { userId } = req.query; // ✅ Исправлено с req.body

    // if (!userId) {
    //   return res.status(400).json({ error: 'userId query parameter is required' });
    // }

    const orders = await Order.find()
      .populate('coffee', 'name price')
      .populate('coffeeShop', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ data: orders });
  } catch (err) {
    console.error('Fetch orders error:', err);
    res.status(400).json({ error: 'Failed to fetch orders' });
  }
});


/**
 * POST /api/orders
 * Place an order (no auth)
 * Requires: userId, coffeeId, coffeeShopId in body
 */
router.post('/orders', async (req, res) => {
  try {
    const { userId, coffeeId, coffeeShopId } = req.body;

    if (!userId || !coffeeId || !coffeeShopId) {
      return res.status(400).json({ error: 'userId, coffeeId, and coffeeShopId are required' });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newOrder = await Order.create({
      user: userId,
      coffee: coffeeId,
      coffeeShop: coffeeShopId,
    });

    res.status(201).json({ data: newOrder });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});


/**
 * DELETE /api/orders/:id
 * Delete order by ID (no auth, needs userId in body)
 */
router.delete('/orders/:id', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required in request body' });
    }

    const deleted = await Order.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Order not found or user not authorized' });
    }

    res.status(200).json({ message: 'Order deleted successfully', data: deleted });
  } catch (err) {
    console.error('Delete order error:', err);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

export default router;
