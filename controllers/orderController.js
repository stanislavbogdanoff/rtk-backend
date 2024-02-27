const { Order } = require("../models/orderSchema");
const { Product } = require("../models/productSchema");

const getOrders = async (req, res) => {
  const orders = await Order.find().populate("user");
};

const createOrder = async (req, res) => {
  const ordersData = req.body;

  const productsIds = ordersData.orders.map((product) => {
    return product.productId;
  });

  // productsIds - массив айди по типу ["a234sdfz123xv", "qw1er234qwer"]

  const products = await Product.find({ _id: { $in: productsIds } });

  // products - массив двух товаров

  let sum = 0;

  // цикл в цикле - find внутри forEach

  products.forEach(
    (product) =>
      (sum +=
        product.price *
        ordersData.orders.find(
          (orderProduct) => orderProduct.productId == product._id
        ).amount)
  );

  await Promise.all(
    ordersData.orders.map((prod) => {
      return Product.findByIdAndUpdate(prod.productId, {
        $inc: { amount: -prod.amount },
      });
    })
  );

  const newOrder = await Order.create({
    deliveryType: ordersData.deliveryType,
    user: ordersData.user,
    orderSum: sum,
    orderProducts: productsIds,
  });

  res.status(201).json(newOrder);
};

module.exports = { createOrder };
