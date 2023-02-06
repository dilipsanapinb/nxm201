const jwt=require("jsonwebtoken");
const fs=require("fs")
require('dotenv').config()
const authenticate=(req,res,next)=>{
    const token=req.headers.authorization.split(" ")[1];
    if(!token){
        res.send("Please Login Firtst")
    }

    const blacklistData=JSON.parse(fs.readFileSync("/blacklist.json","utf-8"));
    if(blacklistData.includes(token)){
        return res.send("Please Login First")
    }
        jwt.verify(token, process.env.key, function(err, decoded) {
            if(err){
                res.send({"msg":"Please Login Firtst","err":err.message})
            }else{
                const userID=decoded?.userID;
                req.body.userID=userID;
                const userrole=decoded?.userrole;
                req.body.userrole=userrole;
                next()
            }
          });
    }


module.exports={authenticate}