const express=require("express");
const {GoldMOdel}=require("../models/goldrate");

const productRouter=express.Router();
productRouter.use(express.json());

productRouter.get("/",(req,res)=>{
res.send("All Gold ")
})

module.exports={productRouter}