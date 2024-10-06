import AsyncHandler from "../Utils/AsyncHandler.js";

const registerUser = AsyncHandler(async(req, res)=>{
      res.status(200).json({
        success: true,
        message: 'User registered successfully.'
    });

});

export default registerUser;