const express=require("express");
const {UserMOdel}=require("../models/user")
const userRouter=express.Router();
require('dotenv').config();
const fs=require("fs")
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken")
userRouter.use(express.json());


userRouter.post("/signup",async(req,res)=>{
    const {name,email,pass}=req.body;
    try {
        bcrypt.hash(pass, 5, async(err, hash)=> {
            const user=new UserMOdel({name,email,pass:hash});
            await user.save();
            res.send({"msg":"registration is successfull"})
            console.log(user);
        });
    } catch (error) {
        res.send({"msg":"registration is not successfull"});
        console.log(error);
    }
})

//login

userRouter.post("/login",async(req,res)=>{
    const {email,pass}=req.body;
    const user=await UserMOdel.findOne({email});
    const hash_pass=user.pass
    try {
        bcrypt.compare(pass, hash_pass,async(err, result)=> {
            if(result){
                const token = jwt.sign({userID:user._id,role:user.role}, process.env.key,{expiresIn:60})
                const refreshToken = jwt.sign({userID:user._id}, process.env.refreshkey,{expiresIn:300})
                res.send({"msg":"Sign in is Successfull","token":token, "refreshToken":refreshToken})
            }else{
                res.send({"err":"wrong Credentials"});
                console.log(err);
            }
        });
    } catch (error) {
        res.send({"msg":"registration is not successfull"});
        console.log(error);
    }
});

//refreshtoekn

userRouter.get("/refreshtoken",async(req,res)=>{
    const refreshToken =req.headers.authorization.split(" ")[1]
    try {
        if(!refreshToken){
            res.send({"msg":"Please Login First"});
        }else{
            jwt.verify(refreshToken, process.env.refreshkey, async(err, decoded)=> {
                if(decoded){
                    const token = jwt.sign({userID:decoded.userID}, process.env.key,{expiresIn:60});
                    res.send({"msg":"Log in successfull","token":token})
                }else{
                    res.send({"msg":"Please Login First"});
                    console.log(err);
                }
              });
        }
    } catch (error) {
        res.send({"msg":"Please Login First"});
        console.log(error);
    }
});

userRouter.get("/logout",async(req,res)=>{
    const token =req.headers.authorization.split(" ")[1];
try {
    const blacklistData=JSON.parse(fs.readFileSync("/blacklist.json","utf-8"));
    blacklistData.push(token);
    fs.writeFileSync("./blacklist.json",JSON.stringify(blacklistData));
    res.send("Logout Successfully")
} catch (error) {
    res.send("User not able to logout");
    console.log(error);
}
})

module.exports={userRouter}