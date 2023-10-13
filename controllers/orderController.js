const stripe=require('stripe')(process.env.STRIPE_SECRET)
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const ApiError = require("../utilities/ApiError");
const factory = require('./handlersFactory');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const { buffer } = require('micro')



//@desc     Create cash order
//@route    POST /api/v1/orders/:cartId
//@access   Protected/User
const createCashOrder= asyncHandler(async(req,res,next)=>{
    // app settings
    const taxPrice=0;
    const shippingPrice=0;

    // 1) get cart depend on cartId
    const cart=await Cart.findById(req.params.cartId);
    if(!cart){
        console.log(req.params.cartId)
        return next(new ApiError('there is no cart wirh this id',404));
    }

    // 2) get order price dependent on cart price if(coupon applied)
    const cartPrice=cart.totalPriceAfterDiscount?cart.totalPriceAfterDiscount:cart.totalCartPrice
    const totalOrderPrice=cartPrice+taxPrice+shippingPrice

    // 3) create cash order with default payment method (cash)
    const order =await Order.create({
        user:req.user._id,
        cartItems:cart.cartItems,
        shippingAddress:req.body.shippingAddress,
        totalOrderPrice,
        
    })

    // 4) after create cash order , decrement product quantity , increment product sold
    if (order) {
    const bulkOption=cart.cartItems.map((item)=>({
        updateOne:{
            filter:{_id:item.product},
            update:{$inc :{quantity:-item.quantity, sold: +item.quantity}}
        }
    }))
    await Product.bulkWrite(bulkOption,{})

    // 5) clear cart depend on cartId
    await Cart.findByIdAndDelete(req.params.cartId)
}
    res.status(201).json({status: 'success',data:order})
})


const filterOrderForLoggedUser=asyncHandler(async(req,res,next)=>{
    if(req.user.role=='user'){
        req.filterObj={user:req.user._id}
    }
    next();
})

//@desc     get all orders
//@route    GET /api/v1/orders
//@access   Protected/Admin/Manager
const findAllOrders= factory.getAll(Order);


//@desc     get specific order
//@route    GET /api/v1/orders/:orderId
//@access   Protected/Admin/Manager
const findSpecificOrder= factory.getOne(Order);



//@desc     update order paid status to paid
//@route    POST /api/v1/orders/:orderId/pay
//@access   Protected/Admin/Manager
const updateOrderToPaid= asyncHandler(async(req,res,next)=>{
    const order= await Order.findById(req.params.id);
    if(!order) {
        return next(
            new ApiError('there is no order for this id',404)
        );
    }
    order.isPaid=true;
    order.paidAt=Date.now();

    const updatedOrder =await order.save();
    res.status(200).json({status:"success",data:updatedOrder});
})

//@desc     update order delivered status to paid
//@route    POST /api/v1/orders/:orderId/deliver
//@access   Protected/Admin/Manager
const updateOrderToDelivered= asyncHandler(async(req,res,next)=>{
    const order= await Order.findById(req.params.id);
    if(!order) {
        return next(
            new ApiError('there is no order for this id',404)
        );
    }
    order.isDelivered=true;
    order.deliveredAt=Date.now();

    const updatedOrder =await order.save();
    res.status(200).json({status:"success",data:updatedOrder});
})


//@desc     get checkout session from stripe and send it as a response
//@route    GET /api/v1/orders/checkout-session/:cartId
//@access   Protected/User
const chekoutSession=asyncHandler(async(req,res,next)=>{
    // app settings
    const taxPrice=0;
    const shippingPrice=0;

    // 1) get cart depend on cartId
    const cart=await Cart.findById(req.params.cartId);
    if(!cart){
        console.log(req.params.cartId)
        return next(new ApiError('there is no cart wirh this id',404));
    }

    // 2) get order price dependent on cart price if(coupon applied)
    const cartPrice=cart.totalPriceAfterDiscount?cart.totalPriceAfterDiscount:cart.totalCartPrice
    const totalOrderPrice=cartPrice+taxPrice+shippingPrice


    // 3) create stripe checkout session
    const session = await stripe.checkout.sessions.create({
        line_items: [{
            price_data: {
            currency: 'egp',
            product_data: {
                name: req.user.name,
            },
            unit_amount: totalOrderPrice * 100,
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/orders`,
        cancel_url: `${req.protocol}://${req.get('host')}/cart`,
        customer_email: req.user.email,
        client_reference_id: req.params.cartId,
        metadata: req.body.shippingAddress,
      });
      

    // 4)send session to response
    res.status(200).json({status:'success',session})
})




const createCardOrder = async (session) => {
  const cartId = session.client_reference_id;
  const shippingAddress = session.metadata;
  const oderPrice = session.amount_total / 100;

  const cart = await Cart.findById(cartId);
  const user = await User.findOne({ email: session.customer_email });

  // 3) Create order with default paymentMethodType card
  const order = await Order.create({
    user: user._id,
    cartItems: cart.cartItems,
    shippingAddress,
    totalOrderPrice: oderPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethodType: 'card',
  });

  // 4) After creating order, decrement product quantity, increment product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});

    // 5) Clear cart depend on cartId
    await Cart.findByIdAndDelete(cartId);
  }
};


//@desc     this will run when stripe payment success paid
//@route    POST /webhook-checkout
//@access   Protected/User
const webhookCheckout=asyncHandler(async(req, res, next) => {
  const sig = req.headers['stripe-signature'];
  const reqBuffer = await buffer(req)
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      reqBuffer,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }


  if (event.type === 'checkout.session.completed') {
    //  Create order
    createCardOrder(event.data.object);
  }

  res.status(200).json({ received: true });
})
module.exports = {
    createCashOrder,
    findAllOrders,
    filterOrderForLoggedUser,
    findSpecificOrder,
    updateOrderToPaid,
    updateOrderToDelivered,
    chekoutSession,
    webhookCheckout
}