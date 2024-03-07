const { Order } = require("../models/orderSchema");
const { Product } = require("../models/productSchema");
const { User } = require("../models/userSchema");

const getOrders = async (req, res) => {
  const orders = await Order.find().populate("user");
};

const createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    const user = req.user;

    // productsIds - массив айди по типу ["a234sdfz123xv", "qw1er234qwer"]

    const productsIds = orderData.orderProducts.map((product) => {
      return product.product;
    });

    // products - массив двух товаров

    const products = await Product.find({ _id: { $in: productsIds } });

    let sum = 0;

    // цикл в цикле - find внутри forEach

    products.forEach(
      (product) =>
        (sum +=
          product.price *
          orderData.orderProducts.find(
            (orderProduct) => orderProduct.product == product._id
          ).amount)
    );

    // console.log("sum", sum);

    // await Promise.all(
    //   orderData.orderProducts.map((prod) => {
    //     return Product.findByIdAndUpdate(prod.product, {
    //       $inc: { amount: -prod.amount },
    //     });
    //   })
    // );

    const newOrder = await Order.create({
      deliveryType: orderData.deliveryType,
      user: req.user._id,
      totalSum: sum,
      orderProducts: orderData.orderProducts,
    });

    if (newOrder && sum > 0)
      await User.findByIdAndUpdate(user._id, { cart: [] }, { new: true });

    res.status(201).json(newOrder);
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Could not create order" });
  }
};

module.exports = { createOrder, getOrders };
