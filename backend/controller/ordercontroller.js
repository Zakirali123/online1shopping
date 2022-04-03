const Order=require("../model/ordermodel");
const Product=require("../model/productmodel");
const ErrorHander=require("../utils/errorhandler");
const catchAsyncErrors=require("../middleware/catchasyncerror");




//CREATE NEW ORDER
exports.newOrder=catchAsyncErrors(async(req,res,next)=>{

    const{
        shippingInfo,
        orderItems,
        PaymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    }=req.body;

    const order=await Order.create({
        shippingInfo,
        orderItems,
        PaymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id,

    });
    res.status(201).json({
        success: true,
        order,
    });
});

//SINGLE ORDER
exports.getSingleOrder=catchAsyncErrors(async(req,res,next)=>{

    const order =await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );
    if(!order)
    {
     return next(new ErrorHander("Order not found with this id",404));
    }
    res.status(200).json({
        success: true,
        order,
    });
})


//GET LOGGED IN USER ORDERS

exports.myOrders=catchAsyncErrors(async(req,res,next)=>{
    const order =await Order.find({user:req.user._id});
   
    res.status(200).json({
        success: true,
        order,
    });
})


//GET ALL orderS---ADMIN

exports.getAllOrders=catchAsyncErrors(async(req,res,next)=>{
    const orders =await Order.find();
    let totalAmount=0;

    orders.forEach((order)=>{
        totalAmount+=order.totalPrice;
    })
   
    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    });
});


//update order status
exports.updateOrder=catchAsyncErrors(async(req,res,next)=>{
    const order=await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHander("Order not found with this id",404));
    }
    if(order.orderStatus==="Delivered"){
        return next(new ErrorHander("you have already delivered this order",400));
    }

    if(req.body.status ==="shipped"){
        order.orderItems.forEach(async(o)=>{
            await updateStock(o.product,o.quantity);
        });
    }
    order.orderStatus=req.body.status;

    if(req.body.status==="Delivered"){
        order.deliveredAt=Date.now();
    }

    await order.save({validateBeforeSave:false});
    res.status(200).json({
        success: true,
    });
});
async function updateStock(id,quantity){
    const product =await Product.findById(id);

    product.stock -= quantity;
    await product.save({validateBeforeSave:false});
}


//DELETE ORDER 

exports.deleteOrder=catchAsyncErrors(async(req,res,next)=>{
    const order=await Order.findById(req.params.id);

    if(!order)
    {
        return next(new ErrorHander("Order not found with this id", 404));
    }
    await order.remove();
    res.status(200).json({
        success: true,
    });
    });
