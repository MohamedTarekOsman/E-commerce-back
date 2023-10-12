const factory = require('./handlersFactory');
const Coupon =require('../models/couponModel')

//@desc     Get List Of coupons
//@route    GET /api/v1/coupons
//@access   Private / Admin-manager
const getCoupons=factory.getAll(Coupon,"coupon")

//@desc     Get Specific Coupon by id
//@route    GET /api/v1/coupons/:id
//@access   Private / Admin-manager
const getCoupon=factory.getOne(Coupon)

//@desc     Create Coupon
//@route    POST /api/v1/coupons
//@access   Private / Admin-manager
const createCoupon= factory.createOne(Coupon)

//@desc     Update Specific Coupon
//@route    PUT /api/v1/coupons/:id
//@access   Private / Admin-manager
const updateCoupon=factory.updateOne(Coupon);


//@desc     Delete Specific Coupon
//@route    DELETE /api/v1/Coupons/:id
//@access   Private / Admin-manager
const deleteCoupon=factory.deleteOne(Coupon) 


module.exports = {
    getCoupons,
    createCoupon,
    getCoupon,
    updateCoupon,
    deleteCoupon,
}