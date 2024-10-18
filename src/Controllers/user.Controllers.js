import AsyncHandler from "../Utils/AsyncHandler.js";
import ApiError from "../Utils/ApiError.js";
import {Muser} from "../Models/user.Models.js";
import {uploadOnCloudinary} from "../Utils/Cloudinary.js";
import ApiResponse from "../Utils/ApiResponse.js";
const registerUser = AsyncHandler(async (req, res) => {
  //get user details.
  //validation- not empty
  //check if user already exists: username, email
  //check images, avatar
  //upload to cloudary,avatar
  //create user object - entry in db
  //remove password and refresh token
  //check for user creation
  //return res

  const { fullname, email, username, password } = req.body;
 /* console.log("fullname :", fullname);
  console.log("email :", email);
  console.log("username :", username);
  console.log("password :", password);
*/
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "1 or more fields are empty!!");
  }

  const ExistedUser = await Muser.findOne({
    $or: [{ username }, { email }],
  });

  //console.log(req.files);

  if (ExistedUser) {
    throw new ApiError(409, "Username or email already exists!!");
  }
  const AvatarLocalpath = req.files?.avatar[0]?.path;
  const CoverImageLocalpath = req.files?.coverimage[0]?.path;

  if (!AvatarLocalpath) {
    throw new ApiError(400, "Please upload an avatar image");
  }
  if (!CoverImageLocalpath) {
    throw new ApiError(400, "Please upload a cover image");
  }
  const Avatar = await uploadOnCloudinary(AvatarLocalpath);
  const coverImage = await uploadOnCloudinary(CoverImageLocalpath);
   if (!Avatar) {
    throw new ApiError(500, "Failed to upload avatar image");
  }

  if (!coverImage) {
    throw new ApiError(500, "Failed to upload cover image");
  }

  const Newuser = await Muser.create({
    fullname,
    email,
    username,
    password,
    avatar: Avatar.url,
    coverimage: coverImage.url,
  });

  const createdUser = await Muser.findById(Newuser._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Failed to create user");
  }

  return res.status(201).json(new ApiResponse(200, createdUser, "User created successfully!!!"));
});

export default registerUser ;
