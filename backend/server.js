
const app=require("./app")

 const cloudinary =require('cloudinary')
const connectDatabase=require('./config/database');
if(process.env.NODE_ENV!=="PRODUCTION")
{
    require('dotenv').config({path:"backend/config/config.env"});
}

process.on("uncaughtException",(err)=>{
    console.log(`Error:${err.message}`);
    console.log(`shutting down the server due to uncaught Exception`);
    
        process.exit(1);

 
})
connectDatabase();
 cloudinary.config({
     cloud_name: process.env.CLOUD_NAME,
     api_key: process.env.API_KEY,
     api_secret: process.env.API_SECRET
 })

const server=app.listen(process.env.PORT,()=>{
    console.log(`server is working on http://localhost:${process.env.PORT}`)
})
process.on("unhandledRejection",(err)=>{
    console.log(`Error:${err.message}`);
    console.log(`shutting down the server due to unhandled promise rejection`);
    server.close(()=>
    {
        process.exit(1);
    })
 
})
