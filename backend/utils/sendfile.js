const nodeMailer = require("nodemailer");
const sendEmail=async(options)=>{
    
    // const transporter=nodeMailer.createTransport({
    //     service: "Gmail",
    //     auth: {
    //         user: "nahaliqra@gmail.com",
    //         pass: "Nahal@123"
    //     }
    // });
    
    const transporter = nodeMailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'alexandro.krajcik43@ethereal.email',
            pass: 's9nSv3MQdP86yht6vb'
        }
    });
    
    
    const mailOptions ={
        from:"alexandro.krajcik43@ethereal.email",
        to:options.email,
        subject:options.subject,
        text:options.message,
    };
    await transporter.sendMail(mailOptions);
   
};
module.exports=sendEmail;