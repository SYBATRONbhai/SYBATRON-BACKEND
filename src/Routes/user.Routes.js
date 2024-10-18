import { Router } from "express";
import registerUser from "../Controllers/user.Controllers.js";
import { upload } from "../Middlewares/Multer.Middleware.js";

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

export default router;
