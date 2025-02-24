import express from "express";
import {
  handleLogin,
  handleVerifyOTP,
} from "../../controller/User/handleLogin.js";
import {
  profileUpdate,
  getProfile,
  updateProfilepicture,
  deleteProfile
} from "../../controller/User/profileUpdate.js";
// import { verifyUser } from '../../Middleware/userAuth.js'
  // import { verifyUser } from "../../Middleware/userAuth.js";
  import { uploads } from "../../Middleware/MulterConfig.js";
  import { verifyUser } from "../../Middleware/userAuth.js";

export const userRouter = express.Router();

userRouter.post("/login", handleLogin);

userRouter.post("/verify", handleVerifyOTP);

userRouter.put("/updateUserDetails", profileUpdate);

userRouter.get("/get-profile/:id", getProfile);

userRouter.put("/update-profile/:id",uploads.single("profilePicture"),updateProfilepicture)

userRouter.delete("/delete-profile/:id", deleteProfile)
