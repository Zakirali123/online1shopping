const express = require('express');
const { loginUser, logout, forgetPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getSingleUser, updateUserRole, deleteUser, getAllUser, registerUser } = require('../controller/usercontroller');
const { isAuthenticatedUser, authorizeRole } = require('../middleware/auth');
const router=express.Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgetPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logout);
router.route("/userdetails").get(isAuthenticatedUser,getUserDetails);
router.route("/password/update").put(isAuthenticatedUser,updatePassword);
router.route("/userdetails/updateProfile").put(isAuthenticatedUser,updateProfile);
router.route("/admin/alluser").get(isAuthenticatedUser,authorizeRole("admin"),getAllUser);
router.route("/admin/user/:id").get(isAuthenticatedUser,authorizeRole("admin"),getSingleUser)
.put(isAuthenticatedUser,authorizeRole("admin"),updateUserRole)
.delete(isAuthenticatedUser,authorizeRole("admin"),deleteUser);



module.exports =router;