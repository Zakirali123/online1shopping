const Product=require("../model/productmodel");
const Errorhandler=require("../utils/errorhandler");
const catchAsyncError=require("../middleware/catchasyncerror");
const cloudinary =require('cloudinary').v2
const ApiFeatures=require("../utils/apifeatures");


exports.createProduct=catchAsyncError(async(req, res, next) => {
  
    
    if (typeof req.body.image === "string") {
        images.push(req.body.image);
      } else {
        images = req.body.image;
      }
    
      const imagesLinks = [];
      
    
      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.uploader.upload(images[i], {
          folder: "products",
        });
    
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    
      req.body.image = imagesLinks;
      req.body.user=req.user.id;
    const product=await Product.create(req.body);
    res.status(201).json({
        success:true,
        product
    })
});
exports.getallProduct=catchAsyncError(async(req, res, next) => {
    const resultPerPage=8;
    const productCount = await Product.countDocuments();
    const apiFeatures=new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultPerPage);
    const product = await apiFeatures.query

    res.status(201).json({
        success:true,
        product,
        productCount,
        resultPerPage
    })
})
// Get All Product (Admin)
exports.getAdminProducts = catchAsyncError(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      products,
    });
  });

  
exports.getProductDetails=catchAsyncError(async(req, res, next) => {
    const product = await Product.findById(req.params.id);
    if(!product)
    {
        return next(new Errorhandler("product not found",500));
    }
    res.status(200).json({
        success:true,
        product
    })
});
exports.updateProduct=catchAsyncError(async(req, res, next) => {
    let product=await Product.findById(req.params.id);
    if(!product)
    {
        return next(new Errorhandler("product not found",500));
    }

    // Images Start Here
   let images = [];

   if (typeof req.body.images === "string") {
     images.push(req.body.image);
   } else {
     images = req.body.image;
   }
 
   if (images !== undefined) {
     // Deleting Images From Cloudinary
     for (let i = 0; i < product.image.length; i++) {
       await cloudinary.uploader.destroy(product.image[i].public_id);
     }
 
     const imagesLinks = [];
 
     for (let i = 0; i < images.length; i++) {
       const result = await cloudinary.uploader.upload(images[i], {
         folder: "products",
       });
 
       imagesLinks.push({
         public_id: result.public_id,
         url: result.secure_url,
       });
     }
 
     req.body.image = imagesLinks;
    }
    product=await Product.findByIdAndUpdate(req.params.id,req.body);
    res.status(200).json({
        success:true,
        product
    })
})
exports.deleteProduct=catchAsyncError(async(req, res, next) => {
    let product=await Product.findById(req.params.id);
    if(!product)
    {
        return next(new Errorhandler("product not found",500));
    }
   
    await product.remove();
    res.status(200).json({
        success:true,
        message:"product is deleted successfully"
    })
})

exports.createProductReviews=catchAsyncError(async(req, res, next) => {
    const{rating,Comment,productId}=req.body;
    const review={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        Comment,
    };
    const product= await Product.findById(productId);

    const isReviewed=product.reviews.find((rev)=>rev.user.toString()===req.user._id.toString());

    if(isReviewed)
    {
        product.reviews.forEach((rev)=>{
            if(rev.user.toString()===req.user._id.toString())
            (rev.rating=rating),(rev.Comment=Comment);
        });
    }
    else
    {
        product.reviews.push(review);
        product.numOfReviews=product.reviews.length;
    }
    let avg=0;
    product.reviews.forEach((rev)=>{
        avg+=rev.rating;
    });
    product.ratings=avg/product.reviews.length;
    await product.save({validateBefore:false});
    res.status(200).json({
        success: true,
    });
});
exports.getProductReviews=catchAsyncError(async(req, res, next) => {

    const product=await Product.findById(req.query.id);
    if(!product)
    {
        return next(new Errorhandler("product is not found",500))
    }
    res.status(200).json({
        success:true,
        reviews:product.reviews
    })
})


//exports.deleteProductReviews=catchAsyncError(async(req,res,next) => {



exports.deleteProductReviews=catchAsyncError(async(req,res,next)=>{
    const product=await Product.findById(req.query.productId);
    if(!product)
    {
        return next(new Errorhandler("product is not found",500))
    }
    const reviews=product.reviews.filter((rev)=>rev._id.toString()!==req.query.id.toString());

    let avg=0;
    reviews.forEach((rev)=>{
        avg+=rev.rating;

    });
    let ratings=0;
    if(reviews.length==0)
    {
        ratings=0;
    }
    else
    {
        ratings=avg/reviews.length;
    }
    const numOfReviews=reviews.length;
    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        numOfReviews
    })

    await product.save({validateBefore: false});
    res.status(200).json({
        success:true,
        message:"Review deleted successfully"
    })
})
