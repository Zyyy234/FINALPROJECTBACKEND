const express = require("express");
const app = express ();
const mongoose=require("mongoose");
app.use(express.json());
const cors = require("cors");
app.use(cors());
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwt_secret = "wdadqkjbjbjgsefjqlkweq;lwlekqwhiohqiowbq[]12333487589jkjawbdjawbdjka";
const mongoUrl="mongodb+srv://user:Laverne123*@cluster0.kkre8fz.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(mongoUrl,{
    useNewUrlParser:true
}).then(()=>{console.log("Connected to database");
})
.catch(e=>console.log(e));

require("./userDetails")
const User=mongoose.model("UserInfo");

app.post("/register",async(req,res)=>{
    const {fname,lname,email,password} = req.body;

    const encryptedPassword=await bcrypt.hash(password,10);
    try{
        const oldUser = await User.findOne({ email });

        if(oldUser){
            return res.json({error:"User Exists"});
        }

        await User.create({
            fname,
            lname,
            email,
            password:encryptedPassword,
        });
        res.send({ status:"ok"})

    }catch(error){
        res.send({ status:"Error"})
    }
});

app.post("/login-user", async(req,res)=>{
    const {email,password} = req.body;

    const user = await User.findOne ({ email });
    if(!user){
        return res.json({error:"User not found"});
    }
    if (await bcrypt.compare(password,user.password)){
        const token = jwt.sign({email:user.email}, jwt_secret);
        
        if(res.status(201)){
            return res.json({status:"ok", data: token});
        }else{
            return res.json({error:"error"});
        }
    }
    res.json({status:"error", error:"Invalid Password"});
});

app.post("/userData", async (req,res)=>{
    const {token} = req.body;
    try{
        const user = jwt.verify(token,jwt_secret);
        console.log(user);
        const userEmail = user.email;
        User.findOne({email:userEmail}).then ((data)=>{
           res.send({status:"ok",data:data});    
        }).catch((error)=>{
            res.send({status:"error",data:error});
        })
    }catch(error){}
});

app.listen(3000, () => {
    console.log("Server Started");
});

app.post("/post", async (req,res) => {
    console.log(req.body);
    const { data } = req.body;

    try{
        if (data == "Sample"){
            res.send ({ status: "ok"});
        }else {
            res.send({ status :"User not found"});
        }
    } catch(error){

        res.send({ status: "Something went wrong try again"});
    }
});