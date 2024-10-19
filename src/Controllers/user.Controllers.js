import AsyncHandler from "../Utils/AsyncHandler.js";
import ApiError from "../Utils/ApiError.js";
import { Muser } from "../Models/user.Models.js";
import { uploadOnCloudinary } from "../Utils/Cloudinary.js";
import ApiResponse from "../Utils/ApiResponse.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await Muser.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refershing & access tokens"
    );
  }
};

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

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created successfully!!!"));
});

const loginUser = AsyncHandler(async (req, res) => {
  //req body -> data
  //check if user exists username or email
  //check password
  //generate access and refresh token
  //send cookies

  const { email, username, password } = req.body;
  if (!email && !username) {
    throw new ApiError(400, "Please provide either email or username");
  }
  const user = await Muser.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "Invalid USER credentials");
  }
  const isPasswordMatch = await findUser.isPasswordCorrect(password);
  if (!isPasswordMatch) {
    throw new ApiError(401, "Invalid password credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  const loggedinUser = Muser.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, {
        success: true,
        message: "User logged in successfully",
        user: loggedinUser,
        accessToken,
        refreshToken,
      })
    );
});

const loggedoutUser = AsyncHandler(async (req, res) => {
  await Muser.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new ApiResponse(200, {
        success: true,
        message: "User logged out successfully",
      })
    );
});

export { registerUser, loginUser, loggedoutUser };
