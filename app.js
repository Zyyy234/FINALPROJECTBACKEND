const express = require("express");
const app = express ();
const mongoose=require("mongoose");
app.use(express.json());
const cors = require("cors");
app.use(cors());
const bcrypt = require("bcryptjs")


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
})

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