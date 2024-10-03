//require('dotenv').config({path: "./env"})
//import mongoose from "mongoose";
//import { DB_Name } from "./constants";
import dotenv from "dotenv";
import connectDB from "./DB/index.js";

dotenv.config({
    path: "./env"
})

connectDB()
.then(()=>{
  app.listen(process.env.PORT || 8000,()=>{
    console.log(`Server is running on port : ${process.env.PORT}`);
  });
})
.catch((err)=>{
console.log("MONGO DB Connection has Failed!!",err);
})













/*(async () => {
  try {
   await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`);
  } catch (error) {
    console.error("ERROR: ", error);
    throw error;
  }
})();
*/