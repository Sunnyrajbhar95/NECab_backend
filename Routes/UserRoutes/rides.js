import express from "express";
import {
  getRides,
  CreateRide,
  rideAcceptance,
  rideOtpVerification,
  getAllRide,
  rideCancel,
  userRideHistory,
  rideComplete,
  rideHistory
} from "../../controller/RideController/userRide.js";
export const rideRouter = express.Router();

rideRouter.post("/getRide", getRides);

rideRouter.post("/createRide", CreateRide);

rideRouter.patch("/rideAcceptance", rideAcceptance);

rideRouter.post("/rideOptVerification", rideOtpVerification);

rideRouter.get("/user/ride-history/:id",userRideHistory)

rideRouter.get("/captain/rides-History/:id", rideHistory);

rideRouter.patch("/rideCompletde/:id", rideComplete);

rideRouter.get('/allRide',getAllRide)

rideRouter.patch("/cancelRide",rideCancel)

