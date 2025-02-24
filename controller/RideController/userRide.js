import { getDistance } from "./GetLocation.js";
import Ride from "../../Model/ride/rideSchema.js";
import { findNearbyCaptains } from "../../utilities/index.js";
const baseFare = {
  auto: 10,
  car: 30,
  bike: 20,
};

const perKmRate = {
  auto: 10,
  car: 15,
  bike: 8,
};

const perMinuteRate = {
  auto: 2,
  car: 3,
  bike: 1.5,
};

const genrarateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

// To calculate the fare between source and destination
const fareAndTime = (getDistanceAndTime) => {
  const fareAndTime = {
    auto: {
      price: Math.round(
        baseFare.auto +
          (getDistanceAndTime.distance / 1000) * perKmRate.auto +
          (getDistanceAndTime.duration / 60) * perMinuteRate.auto
      ),
      time: Math.round(getDistanceAndTime.duration / (60 * 60)),
    },
    car: {
      price: Math.round(
        baseFare.car +
          (getDistanceAndTime.distance / 1000) * perKmRate.car +
          (getDistanceAndTime.duration / 60) * perMinuteRate.car
      ),
      time: Math.round((getDistanceAndTime.duration / (60 * 60)) * 0.9),
    },
    bike: {
      price: Math.round(
        baseFare.bike +
          (getDistanceAndTime.distance / 1000) * perKmRate.bike +
          (getDistanceAndTime.duration / 60) * perMinuteRate.bike
      ),
      time: Math.round((getDistanceAndTime.duration / (60 * 60)) * 0.8),
    },
  };
  return fareAndTime;
};

// to get distance and time and price from source to destination
export const getRides = async (req, res) => {
  try {
    console.log(req.body);
    const { source, destination } = req.body;

    if (
      !source ||
      !destination ||
      !source.lat ||
      !source.lng ||
      !destination.lat ||
      !destination.lng
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing source or destination coordinates",
      });
    }
    const getDistanceAndTime = await getDistance(source, destination);
    console.log(getDistanceAndTime);
    if (getDistanceAndTime.success == false) {
      return res
        .status(401)
        .json({ success: false, message: "Internal Server problem" });
    }
    const FareAndTime = fareAndTime(getDistanceAndTime);
    return res.status(200).json({
      FareAndTime,
      time:getDistanceAndTime.time,
      pickup: getDistanceAndTime.origin,
      destination: getDistanceAndTime.destination,
      success: true,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: "something went wrong",
    });
  }
};

//to create ride  it is working
export const CreateRide = async (req, res) => {
  try {
    console.log(req.body);
    const { source, destination, vehicalType, user_id, captain_id } = req.body;
    if (
      !source ||
      !destination ||
      !source.lat ||
      !source.lng ||
      !destination.lat ||
      !destination.lng ||
      !vehicalType
    ) {
      return res.status(400).json({
        sucess: false,
        message: "Missing source or destination coordinates",
      });
    }
    const { io, activeCaptains } = req;

    const getDistanceAndTime = await getDistance(source, destination);
    if (getDistanceAndTime.success == false) {
      return res
        .status(401)
        .json({ success: false, message: "Internal Server problem" });
    }
    // finding the fare and distance from source and destination
    const FareAndTime = fareAndTime(getDistanceAndTime);
    const ride = await Ride.create({
      user_id: user_id,
      captain_id: captain_id,
      startLocation: getDistanceAndTime.origin,
      endLocation: getDistanceAndTime.destination,
      vehicalType: vehicalType,
      fare: FareAndTime[vehicalType].price,
    });

    // notification to all active captain
    const nearbyCaptains = findNearbyCaptains(source, activeCaptains);
    console.log(nearbyCaptains);
    nearbyCaptains.forEach(({ socketId }) => {
      io.to(socketId).emit("newRideRequest", {
        rideId: ride._id,
        source,
        destination,
        fare: FareAndTime[vehicalType].price,
      });
    });
    return res
      .status(200)
      .json({ ride, success: true, message: "Ride created successfully" });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      success: false,
      error: err,
    });
  }
};

// Captain ride history
export const rideHistory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(401).json({
        success: false,
        message: " ID is required",
      });
    }

    const rides = await Ride.find({ captain_id: id });
    if (rides.length == 0) {
      return res.status(401).json({
        success: false,
        message: "ride not found",
      });
    }

    return res.status(200).json({
      rides,
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      success: false,
      message: "Internal server Problem",
    });
  }
};

//rideacceptance notifiaction for user is working
export const rideAcceptance = async (req, res) => {
  try {
    const { id, captain_id } = req.body;
    if (!id || !captain_id) {
      return res
        .status(401)
        .json({ success: false, message: "captain Id or ride id is required" });
    }
    const ride = await Ride.findById(id);
    if (!ride) {
      return res
        .status(404)
        .json({ success: false, message: "Ride not found" });
    }

    if (ride.status !== "pending") {
      return res.status(400).json({ message: "Ride is already accepted" });
    }
    const { io, activeUser } = req;
    console.log(activeUser, "hello");

    io.to(activeUser[ride.user_id]).emit("rideAccepted", {
      id: ride._id,
      captain_id: ride.captain_id,
      message: "Your ride has been accepted!",
    });
    const generateOtp = genrarateOTP();
    ride.status = "accepted";
    ride.captain_id = captain_id;
    ride.otp = generateOtp;
    await ride.save();
    res.status(200).json({
      success: true,
      message: "Ride accepted",
      generateOtp,
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      success: false,
      message: "Internal Server Problem",
    });
  }
};

// Ride completion logic
export const rideComplete = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(401)
        .json({ success: false, message: "RideId is required" });
    }
    const ride = await Ride.findById(id);
    if (!ride) {
      return res
        .status(401)
        .json({ success: false, message: "Ride not found" });
    }
    (ride.status = "completed"), await ride.save();
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ success: false, err });
  }
};

// Ride otp verifiaction  logic
export const rideOtpVerification = async (req, res) => {
  try {
    const { id, otp } = req.body;
    if (!id) {
      return res.status(401).json({
        success: false,
        message: "Ride id is required",
      });
    }
    const ride = await Ride.findById(id);
    if (!ride) {
      return res.status(401).json({
        success: false,
        message: "Ride not found",
      });
    }
    if (ride.otp !== otp) {
      return res.status(401).json({
        success: false,
        message: "Invalid otp",
      });
    }
    ride.otp = null;
    await ride.save();
    return res.status(200).json({
      success: true,
      message: "Opt verified successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      success: false,
      message: "Internal Server Problem",
    });
  }
};

// Ride Concellation logic
export const rideCancel = async (req, res) => {
  try {
    const { id, user_id } = req.body;

    const { io, activeCaptains } = req;
    if (!id || !user_id) {
      return res
        .status(401)
        .json({ success: false, message: "RideId or UserId Required" });
    }

    const ride = await Ride.findById(id);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }
    if (ride.user_id.toString() !== user_id) {
      return res
        .status(403)
        .json({ message: "You are not allowed to cancel this ride" });
    }
    if (ride.status === "completed") {
      return res
        .status(400)
        .json({ message: "Ride is already completed, cannot be cancelled" });
    }
    if (ride.status === "cancelled") {
      return res.status(400).json({ message: "Ride is already cancelled" });
    }
    ride.status = "cancelled";
    await ride.save();

    if (ride.captain_id && activeCaptains[ride.captain_id]) {
      const captainSocketId = activeCaptains[ride.captain_id].socketId;
      io.to(captainSocketId).emit("rideCancelled", {
        rideId: ride.id,
        message: "The ride has been cancelled by the user.",
      });
    }

    return res
      .status(401)
      .json({ sucess: true, message: "Ride CancelLed Successfully" });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      success: false,
      message: "internal server Problem",
    });
  }
};

//All rides for the admin logic
export const getAllRide = async (req, res) => {
  try {
    const rides = await Ride.find();
    return res
      .status(200)
      .json({ rides, success: true, message: "Getting All Ride Successfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(401)
      .json({ success: false, message: "internal server problem" });
  }
};

// UserRide History

export const userRideHistory = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId)
      return res
        .status(400)
        .json({ success: false, message: "user id required" });

    const rides = await Ride.find({ user_id: userId }).populate("captain_id");
    if (rides.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Rides Not found" });
    }
    return res.status(200).json({
      rides,
      success: true,
      message: "Rides fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || "Internal Server Problem",
    });
  }
};
