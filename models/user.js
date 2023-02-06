const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
    name:String,
    email:String,
    pass:String,
    role:{
        type:String,
        enum:[
            "manager",
            "user"
        ],
        default:"user"
    }

})

const UserMOdel=mongoose.model("user",userSchema);

module.exports={UserMOdel}