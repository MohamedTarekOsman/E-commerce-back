const asyncHandler = require('express-async-handler');
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");
const ApiError = require('../utilities/ApiError');


const calcTotalPrice=(cart) => {
    let totalPrice = 0;
    cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
}


//@desc     add product to cart
//@route    POST /api/v1/cart
//@access   Private/User
const addProductToCart =asyncHandler(async(req,res,next)=>{

    const product =await Product.findById(req.body.productId)
    // 1) get cart for logged user
    let cart=await Cart.findOne({user:req.user._id});

    if(!cart){
        // create new cart for logged user with product
        cart=await Cart.create({
            user:req.user._id,
            cartItems:[{
                product:req.body.productId,
                color:req.body.color,
                price:product.price
            }]
        })

    }else{
        const productindex = await cart.cartItems.findIndex((item)=>item.product.toString()===req.body.productId && item.color===req.body.color)
        
        //product is already exists in cart, update product quantity
        if(productindex>-1){
            const cartItem=cart.cartItems[productindex];
            cartItem.quantity+=1;
            cart.cartItems[productindex]=cartItem;
        }else{
            //product not exists in cart, push product to cartItems array
            cart.cartItems.push({
                product:req.body.productId,
                color:req.body.color,
                price:product.price
            })
        }
    }

    // 2) calculate total cart price
    calcTotalPrice(cart)
    await cart.save()

    res.status(200).json({status:"success",message:"product added successfully to cart",data:cart})
})

//@desc     get logged user cart
//@route    GET /api/v1/cart
//@access   Private/User
const getLoggedUserCart =asyncHandler(async(req,res,next)=>{
    const cart =await Cart.findOne({user:req.user._id})
    if(!cart) {
        return next(new ApiError("there is no cart for this user",404))
    }
    res.status(200).json({status:"success",nuberofCartItems:cart.cartItems.length,data:cart})
})

//@desc     remove specific cart item
//@route    DELETE /api/v1/cart/:itemId
//@access   Private/User
const removeSpecificCartItem =asyncHandler(async(req,res,next)=>{
    const cart =await Cart.findOneAndUpdate({user:req.user._id},{
        $pull:{cartItems:{_id:req.params.itemId}}
    },{new:true,runValidators:true});

    calcTotalPrice(cart)
    await cart.save()


    res.status(200).json({status:"success",message:"item removed successfully",nuberofCartItems:cart.cartItems.length,data:cart})
})

//@desc     clear logged user cart
//@route    DELETE /api/v1/cart
//@access   Private/User
const clearCart =asyncHandler(async(req,res,next)=>{
    await Cart.findOneAndDelete({user:req.user._id});
    res.status(200).json({status:"success",message:"cart cleared successfully"})
})

//@desc     update specific cart item quantity
//@route    PUT /api/v1/cart/:itemId
//@access   Private/User
const updateCartItemQuantity =asyncHandler(async(req,res,next)=>{
    const {quantity}=req.body;
    const cart=await Cart.findOne({user:req.user._id});
    if(!cart){
        return next(new ApiError("there is no cart for this user",404));
    }

    const itemIndex=cart.cartItems.findIndex((item)=>item._id.toString()==req.params.itemId);
    if(itemIndex>-1){
        const cartItem = cart.cartItems[itemIndex]
        cartItem.quantity=quantity;
        cart.cartItems[itemIndex]=cartItem;
    }else{
        return next(new ApiError("there is no item for this user",404));
    }

    calcTotalPrice(cart)
    await cart.save()

    res.status(200).json({status:"success",numOfCartItems:cart.cartItems.length,data:cart})
})

//@desc     apply coupon on loged user cart
//@route    PUT /api/v1/cart/applyCoupon
//@access   Private/User
const applyCoupon =asyncHandler(async(req,res,next)=>{
    // 1) Get coupon based on coupon name
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new ApiError(`Coupon is invalid or expired`));
  }

  // 2) Get logged user cart to get total cart price
  const cart = await Cart.findOne({ user: req.user._id });

  const totalPrice = cart.totalCartPrice;

  // 3) Calculate price after priceAfterDiscount
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);

  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
})

module.exports ={
    addProductToCart,
    calcTotalPrice,
    getLoggedUserCart,
    removeSpecificCartItem,
    clearCart,
    updateCartItemQuantity,
    applyCoupon
}