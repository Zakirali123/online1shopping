const express=require("express");
const bodyParser=require('body-parser')
 const fileupload=require('express-fileupload')
const errormiddleware=require("./middleware/error");
const cookieParser=require("cookie-parser");

if(process.env.NODE_ENV!=="PRODUCTION")
{
    require('dotenv').config({path:"backend/config/config.env"});
}
const path = require("path");
const app=express()
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}))
 app.use(fileupload())
const product=require("../backend/router/productrouter");
 const user=require("../backend/router/userrouter");
const order=require("../backend/router/orderrouter");
const payment=require("../backend/router/paymentrouter")
app.use("/api",product);
app.use("/api",user);
app.use("/api",order);
app.use("/api",payment);
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});
app.use(errormiddleware)
module.exports=app;