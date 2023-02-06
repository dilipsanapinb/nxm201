const mongoose=require("mongoose");

const goldSchema=mongoose.Schema({
    name:String

})

const GoldMOdel=mongoose.model("gold",goldSchema);

module.exports={GoldMOdel}