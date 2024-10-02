//require('dotenv').config({path: "./env"})
//import mongoose from "mongoose";
//import { DB_Name } from "./constants";
import dotenv from "dotenv";
import connectDB from "./DB/index.js";

dotenv.config({
    path: "./env"
})

connectDB()














/*(async () => {
  try {
   await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`);
  } catch (error) {
    console.error("ERROR: ", error);
    throw error;
  }
})();
*/