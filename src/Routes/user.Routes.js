import { Router } from "express";
import registerUser from "../Controllers/user.Controllers.js";
import { upload } from "../Middlewares/Multer.Middlewares.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

export default router;
