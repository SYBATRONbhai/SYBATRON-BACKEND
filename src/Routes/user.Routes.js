import { Router } from "express";
import {registerUser,loggedinUser,loggedoutUser} from "../Controllers/user.Controllers.js";
import { upload } from "../Middlewares/Multer.Middleware.js";
import {verifyJWT} from "../Middlewares/auth.Middleware.js"

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverimage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/Login").post(loggedinUser);

router.route("/LogOut").post( verifyJWT , loggedoutUser);

export default router;
