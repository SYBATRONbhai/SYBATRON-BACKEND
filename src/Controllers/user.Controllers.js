import AsyncHandler from "../Utils/AsyncHandler.js";
import ApiError from "../Utils/ApiError.js";
import { Msuer, Muser } from "../Models/user.Models.js";
import uploadOnCloudinary from "../Utils/Cloudinary.js";
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

  const { fullName, email, username, password } = req.body;
  console.log("email :", email);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "This Field is required!!");
  }

  const ExistedUser = Msuer.findOne({
    $or: [{ username }, { email }],
  });

  if (ExistedUser) {
    throw new ApiError(409, "Username or email already exists!!");
  }
  const AvatarLocalpath = req.files?.avatar[0]?.path;
  const CoverImageLocalpath = req.files?.coverImage[0]?.path;

  if (!AvatarLocalpath) {
    throw new ApiError(400, "Please upload an avatar image");
  }
  if (!CoverImageLocalpath) {
    throw new ApiError(400, "Please upload a cover image");
  }

  const Avatar = await uploadOnCloudinary(AvatarLocalpath);
  const CoverImage = await uploadOnCloudinary(CoverImageLocalpath);
  if (!Avatar) {
    throw new ApiError(500, "Failed to upload avatar image");
  }

  if (!CoverImage) {
    throw new ApiError(500, "Failed to upload cover image");
  }

  const user = await Msuer.create({
    fullName,
    email,
    username: username.toLowercase(),
    password,
    avatar: Avatar.url,
    coverImage: CoverImage.url,
  });

  const createdUser = Muser.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Failed to create user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created successfully!!!"));
});

export default registerUser;
