import express from 'express';
import Order from '../schema/Order.js';
import Coffee from '../schema/Coffee.js';

const router = express.Router();

// Create an order
router.post('/order', async (req, res) => {
  try {
    const { user, coffee } = req.body;

    // Fetch coffee details to get price and coffeeShopId
    const coffeeDoc = await Coffee.findById(coffee).select('price coffeeShopId');
    if (!coffeeDoc) {
      return res.status(404).json({ msg: 'Coffee not found' });
    }

    // Create new order
    const newOrder = new Order({
      user,
      coffee,
      coffeeShop: coffeeDoc.coffeeShopId, // store reference to coffee shop
      price: coffeeDoc.price,
    });

    await newOrder.save();

    res.status(201).json({ msg: 'Order created', order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
});

// Get orders for a user (optionally filtered)
router.get('/order', async (req, res) => {
  try {
    const { user } = req.query;
    const filter = user ? { user } : {};

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('coffee', 'name price image')
      .populate('coffeeShop', 'name logo');

    res.status(200).json({ data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
});

// Delete an order by ID
router.delete('/order/:id', async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ msg: 'Order not found' });
    }
    res.status(200).json({ msg: 'Order deleted', data: deletedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
});

export default router;
