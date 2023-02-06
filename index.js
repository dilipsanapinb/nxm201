const express=require("express");
require('dotenv').config();
const {connection}=require("./config/db")
const {userRouter}=require("./routes/user")
const {productRouter}=require("./routes/goldrate");
const {authenticate}=require("./middlewares/authenticate");
const {authorise}=require("./middlewares/authorise")
const app=express();


app.get("/",(req,res)=>{
    res.send("Welcome to Home page")
})

app.use("/user",userRouter)
app.use("/goldrate",authenticate,authorise(["user","manager"]),(req,res)=>{
res.send("All Goldrate data")
})
app.get("/userstats",authenticate,authorise(["manager"]),(req,res)=>{

})

app.listen(process.env.port,async()=>{
    try {
        await connection;
        console.log("Connected to Db");
    } catch (error) {
        console.log("NOt Connected to Db");
        console.log(error);
    }
    console.log(`Server is listening to port ${process.env.port}`);
})
