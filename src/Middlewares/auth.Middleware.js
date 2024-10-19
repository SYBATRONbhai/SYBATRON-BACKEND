import AsyncHandler from "../Utils/AsyncHandler.js";
import ApiError from "../Utils/ApiError.js";
import JWT from "jsonwebtoken";
import { Muser } from "../Models/user.Models.js";

export const verifyJWT = AsyncHandler(async (req,res,next) => {
  try {
    const GetToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
    
    if (!GetToken) {
      throw new ApiError(401,"Not authenticated");
  }
  
   const DecodedToken = JWT.verify(GetToken, process.env.ACCESS_TOKEN_SECRET)
   const user = await Muser.findById(DecodedToken?._id).select("-password -refreshToken");
   if (!user) {
      throw new ApiError(401,"InValid Access Token");
  }
  req.user = user;
  
  next();
  } catch (error) {
    throw new ApiError(401, error?.message || "INVALID ACCESS TOKEN")
  }
})

