import {
  login,
  optVerifaiction,
} from "../../controller/Captain/hnadleLogin.js";
import {
  updateProfile,
  getCaptainProfile,
} from "../../controller/Captain/updateProfile.js";

import {
  dl,
  Adharuplaod,
  PanUpload,
  Rcupload,
  InsUpload,
  PermitUplaod,
} from "../../controller/Captain/documentController.js";
import { upload } from "../../utilities/index.js";
import { capAuth } from "../../Middleware/captainAuth.js";

import express from "express";
export const router = express.Router();
router.post("/login", login);
router.post("/verify", optVerifaiction);
router.post("/profileUpdate", updateProfile);
router.get("/getprofile/:id", getCaptainProfile);
router.post("/dl/:id", capAuth, upload, dl);
router.post("/adhar/:id", capAuth, upload, Adharuplaod);
router.post("/pan/:id", capAuth, upload, PanUpload);
router.post("/rc/:id", capAuth, upload, Rcupload);
router.post("/ins/:id", capAuth, upload, InsUpload);
router.post("/permit/:id", capAuth, upload, PermitUplaod);
