const Cart = require("../models/cartModel");

const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
const stripe = require("stripe")(process.env.STRIPE_KEY);

const asyncHandler = require('express-async-handler');

const ApiError = require("../utils/apiError");
const Product = require("../models/productModel");
const History = require("../models/HistoryModel");

exports.addtocart = asyncHandler(async (req, res) => {
    const { products } = req.body;

    // Get the user's cart
    let cart = await Cart.findOne({ userId: req.currentuser.id });

    // If cart doesn't exist, create a new one
    if (!cart) {
        cart = new Cart({ userId: req.currentuser.id, products: [] });
    }

    // Initialize items price to 0
    let itemsPrice = 0;

    // Loop through each product in the request body
    for (const product of products) {
        // Find the product in the database by its ID
        const foundProduct = await Product.findById(product.productId);

        // If product is not found, return an error
        if (!foundProduct) {
            return res.status(404).json({ message: `Product with ID ${product.productId} not found` });
        }

        // Check if the product is already in the cart
        const existingProductIndex = cart.products.findIndex(p => p.productId.toString() === product.productId);

        if (existingProductIndex !== -1) {
            // If product exists, increase its quantity by 1 and recalculate product price
            cart.products[existingProductIndex].quantity += 1;
            cart.products[existingProductIndex].productprice = foundProduct.price * cart.products[existingProductIndex].quantity;
        } else {
            // If product does not exist, add it to the cart with quantity 1
            const newProduct = {
                productId: product.productId,
                quantity: 1,
                productprice: foundProduct.price,
                productname: foundProduct.name,
                productimage: foundProduct.image
            };
            cart.products.push(newProduct);
        }
    }

    // Recalculate items price based on quantities and product prices
    itemsPrice = cart.products.reduce((total, product) => total + product.productprice, 0);

    // Calculate shipping price, tax price, and total price (assuming they are fixed for now)
    const shippingPrice = 10; // Example shipping price
    const taxPrice = 0.1 * itemsPrice; // Example tax price (10% of items price)
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    // Update the cart with new prices
    cart.itemsPrice = itemsPrice;
    cart.shippingPrice = shippingPrice;
    cart.taxPrice = taxPrice;
    cart.totalPrice = totalPrice;

    try {
        // Save the updated cart to the database
        const savedCart = await cart.save();
        res.status(200).json(savedCart);
    } catch (err) {
        // Handle any errors
        res.status(500).json({ message: err.message });
    }
});


exports.removeFromCart = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
  
    // Assuming Cart is your model representing the user's cart
    const cart = await Cart.findOne({ userId: req.currentuser.id });
  
    if (!cart) {
      return next(new ApiError("Cart not found", 404));
    }
  
    // Find the index of the product in the cart array
    const productIndex = cart.products.findIndex(product => product.productId.toString() === id);
  
    // If the product is not found, return an error
    if (productIndex === -1) {
      return next(new ApiError("Product not found in the cart", 404));
    }
  
    // Remove the product from the cart's products array
    cart.products.splice(productIndex, 1);
  
    // Save the updated cart
    await cart.save();
  
    res.status(200).json({ msg: "Product removed from cart successfully" });
  });


// Get User Cart



exports.getmycart = asyncHandler(async (req, res) => {
    try {
        // Find the user's cart
        const cart = await Cart.findOne({ userId: req.currentuser.id });
        // If the cart does not exist, return an empty cart
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Populate product details for each product in the cart
        const populatedProducts = await Promise.all(cart.products.map(async product => {
            const foundProduct = await Product.findById(product.productId);
            if (foundProduct) {
                return {
                    ...product.toObject(),
                    productname: foundProduct.name,
                    productimage: "http://localhost:8000/uploads/" +foundProduct.image,
                    productprice: foundProduct.price
                };
            } else {
                // If the product is not found, return null
                return null;
            }
        }));

        // Filter out any null values (products that were not found)
        const products = populatedProducts.filter(product => product !== null);

        // Calculate total prices
        const itemsPrice = products.reduce((acc, cur) => acc + cur.productprice * cur.quantity, 0);
        const shippingPrice = cart.shippingPrice;
        const taxPrice = cart.taxPrice;
        const totalPrice = itemsPrice +shippingPrice + taxPrice;

        // Send the cart data with populated product details and total prices
        res.status(200).json({
            userId: cart.userId,
            products,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice
        });
    } catch (err) {
        // Handle any errors
        res.status(500).json({ message: err.message });
    }
});


exports.increaseQuantity = asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log(req.params);
    // if (!productId) {
    //     return res.status(400).json({ message: "Product ID is missing in the request" });
    //   }
    // Get the user's cart
    const cart = await Cart.findOne({ userId: req.currentuser.id });
    
    // Find the product in the cart
    const productIndex = cart.products.findIndex(product => product.productId.toString() === id);
    console.log(productIndex);
    // If the product is not found, return an error
    if (productIndex === -1) {
      return res.status(404).json({ message:`Product with ID ${id} not found in the cart`});
    }
    
    // Increase the quantity of the product by 1
    cart.products[productIndex].quantity += 1;
    
    // Save the updated cart to the database
    const updatedCart = await cart.save();
    
    res.status(200).json(updatedCart);
  });


  // Decrease quantity of a product in the cart
exports.decreaseQuantity = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Get the user's cart
    const cart = await Cart.findOne({ userId: req.currentuser.id });
    
    // Find the product in the cart
    const productIndex = cart.products.findIndex(product => product.productId.toString() === id);
    
    // If the product is not found, return an error
    if (productIndex === -1) {
      return res.status(404).json({ message: `Product with ID ${id} not found in the cart` });
    }
    
    // If the product quantity is already 1, remove it from the cart
    if (cart.products[productIndex].quantity === 1) {
      cart.products.splice(productIndex, 1);
    } else {
      // Decrease the quantity of the product by 1
      cart.products[productIndex].quantity -= 1;
    }
    
    // Save the updated cart to the database
    const updatedCart = await cart.save();
    
    res.status(200).json(updatedCart);
  });
  


  exports.payment = async (req, res) => {
    console.log("Payment endpoint hit");
    console.log("Request body:", req.body);

    stripe.charges.create({
        source: req.body.tokenId,

        amount: req.body.amount,
        currency: "usd",
    }, async (stripeErr, stripeRes) => {
        if (stripeErr) {
            console.log("Stripe error:", stripeErr);
            return res.status(500).json(stripeErr);
        }
        console.log("Stripe response:", stripeRes);

        try {
            const { Products, totalPrice } = req.body;
            if (!Products || !Array.isArray(Products)) {
                return res.status(400).json({ error: "Invalid or missing products array" });
              }
            console.log("Products:", Products);
            console.log("Total Price:", totalPrice);

            const historyEntry = new History({
                User: req.currentuser.id,
                cart: Products.map(item => ({
                        productId: item.productId,
                        productname: item.productname,
                        quantity: item.quantity,
                        productprice: item.productprice
                    }
                    )),
                totalPrice: totalPrice,
                date: Date.now()
            });

            console.log("History entry:", historyEntry);

            const savedHistory = await historyEntry.save();
            console.log("Saved history entry:", savedHistory);

            res.status(200).json({ stripeRes, savedHistory });
        } catch (error) {
            console.log("Error saving history:", error);
            res.status(500).json({ message: "Failed to save history", error });
        }
    });
};

// In your cart controller
exports.clearCart = asyncHandler(async (req, res, next) => {
    try {
        // Assuming you have a way to identify the user's cart, e.g., by user ID
        const cart = await Cart.findOneAndUpdate(
            { userId: req.currentuser.id },  // Adjust to match your schema
            { products: [], totalPrice: 0 }
        );

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json({ message: 'Cart cleared' });
    } catch (error) {
        next(error);
    }
});


exports.getUserHistory = asyncHandler(async (req, res, next) => {
    const userhistory = await History.find( {User: req.currentuser.id})
    if (!userhistory) {
        res.status(404).json("you don't have any history make an order!");
     
    }
    res.status(200).json(userhistory);
          });


    exports.getHistory = asyncHandler(async (req, res, next) => {
            const history = await History.find().populate('User', 'name');
            if (!history) {
                res.status(404).json("There is no orders!");
             
            }
            res.status(200).json(history);
                  });