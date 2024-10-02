import mongoose from "mongoose";
import { DB_Name } from "../constants.js";

const connectDB = async ()=>{
    try {
      const connectionDone =  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`);
      console.log(`MongoDB Connected !! DB HOST:${connectionDone.connection.host}`);
    } catch (error) {
        console.log("MONGODB CONNECTION FAILED!! " , error);
        process.exit(1);
    }
}

export default connectDB;