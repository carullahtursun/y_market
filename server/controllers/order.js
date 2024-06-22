const Order = require('../models/Order');
const Product = require('../models/Product');

module.exports.createOrder = async (req, res) => {
  const { userId, products, provider, amount, address, status, deliveryCode, startDate, endDate } = req.body;
  console.log(req.body);
  try {
    const order = new Order({
      userId,
      products: products.map(item => ({
        product: item._id,
        quantity: item.cartQuantity
      })),
      provider,
      amount,
      address,
      status,
      deliveryCode,
      startDate,
      endDate
    });

    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  const { userId, products, provider, amount, address, status, deliveryCode } = req.body;

  try {
    const order = await Order.findById(id);

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
    } else {
      order.userId = userId || order.userId;
      order.products = products.map(item => ({
        product: item._id,
        quantity: item.cartQuantity
      })) || order.products;
      order.provider = provider || order.provider;
      order.amount = amount || order.amount;
      order.address = address || order.address;
      order.status = status || order.status;
      order.deliveryCode = deliveryCode || order.deliveryCode;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Order is deleted successfully."
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports.getUserOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id).populate('products.product').populate('userId').populate("provider");

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
    } else {
      res.json(order);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('products.product').populate('userId').populate("provider");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.getOrderByProviderId = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.find({ provider: id }).populate('products.product').populate('userId').populate("provider");

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
    } else {
      res.json(order);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.getMonthlyIncome = async (req, res) => {
  const date = new Date();
  const lastMonthDate = new Date(date.setMonth(date.getMonth() - 1));
  const prevMonthDate = new Date(new Date().setMonth(lastMonthDate.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: prevMonthDate } } },
      {
        $project: {
          month: { $month: '$createdAt' },
          sales: "$amount"
        }
      },
      {
        $group: {
          _id: '$month',
          total: {
            $sum: "$sales"
          }
        }
      }
    ]);
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json(error);
  }
};
/* module.exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body
      },
      {
        new: true
      });
    res.status(200).json({
      message: "Order is updated successfully.",
      updatedOrder
    });
  } catch (err) {
    res.status(500).json(err);
  }
}; */


/* const Order = require('../models/Order');


// Tüm siparişleri getir
module.exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Yeni sipariş oluştur
module.exports.createOrder = async (req, res) => {
  const { userId, products, provider, amount, address, status } = req.body;

  try {
    const order = new Order({
      userId,
      products,
      provider,
      amount,
      address,
      status,
    });

    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Belirli bir siparişi getir
module.exports.getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id);

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
    } else {
      res.json(order);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Bir siparişi güncelle
module.exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  const { userId, products, provider, amount, address, status } = req.body;

  try {
    const order = await Order.findById(id);

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
    } else {
      order.userId = userId || order.userId;
      order.products = products || order.products;
      order.provider = provider || order.provider;
      order.amount = amount || order.amount;
      order.address = address || order.address;
      order.status = status || order.status;

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Bir siparişi sil
module.exports.deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id);

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
    } else {
      await order.remove();
      res.json({ message: 'Order deleted' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
 */

/* module.exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.params.userId
    }).populate('userId').populate('provider').populate('productId');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
}; */

/* module.exports.getUserOrders = async (req, res, next) => {
  try {
    const userId = req.params.userId; // Assuming the user ID is in the URL parameter
    const orders = await Order.find({ userId: userId })
      .populate('userId');
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
} */


/* module.exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('userId').populate("provider")
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
} */