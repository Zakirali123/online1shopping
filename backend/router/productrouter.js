const express=require("express");
const { createProduct, getallProduct, getProductDetails, updateProduct, deleteProduct, createProductReviews, getProductReviews, deleteProductReviews, getAdminProducts } = require("../controller/productcontroller");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");

const router=express.Router();
router.route("/products/new").post(isAuthenticatedUser,authorizeRole("admin"),createProduct);
router.route("/products").get(getallProduct);
router.route("/products/:id").get(getProductDetails);
router.route("/products/:id").put(isAuthenticatedUser,authorizeRole("admin"),updateProduct);
router.route("/products/:id").delete(isAuthenticatedUser,authorizeRole("admin"),deleteProduct);
router.route("/review").put(isAuthenticatedUser,createProductReviews);
router.route("/reviews").get(getProductReviews).put(isAuthenticatedUser,deleteProductReviews);
router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizeRole("admin"),getAdminProducts);
module.exports=router;