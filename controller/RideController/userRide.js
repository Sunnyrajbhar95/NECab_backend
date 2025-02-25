import { getDistance } from "./GetLocation.js";
import Ride from "../../Model/ride/rideSchema.js";
// import { findNearbyCaptains } from "../../utilities/index.js";
import User from "../../Model/userPanel/userSchema.js";
import Captain from "../../Model/captainPannel/captain.js";
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

const generateOTP = () => {
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
        .status(500)
        .json({ success: false, message: "Internal Server problem" });
    }
    const FareAndTime = fareAndTime(getDistanceAndTime);
    return res.status(200).json({
      FareAndTime,
      time: getDistanceAndTime.time,
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
    const { source, destination, vehicalType } = req.body;
    const user_id=req.params.id
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
    // const { io, activeCaptains } = req; websocket
    const user = await User.findById(user_id);

    //finding user on the basis of user id
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" });

    const getDistanceAndTime = await getDistance(source, destination);
    if (getDistanceAndTime.success === false) {
      return res
        .status(401)
        .json({ success: false, message: "Internal Server problem" });
    }

    // finding the fare and distance from source and destination
    const FareAndTime = fareAndTime(getDistanceAndTime);

    if (!FareAndTime || !FareAndTime[vehicalType]) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to calculate fare" });
    }
    const ride = await Ride.create({
      user_id: user_id,
      startLocation: getDistanceAndTime.origin,
      endLocation: getDistanceAndTime.destination,
      vehicalType: vehicalType,
      fare: FareAndTime[vehicalType].price,
    });

    // notification to all active captain
    // const nearbyCaptains = findNearbyCaptains(source, activeCaptains);
    // console.log(nearbyCaptains);
    // nearbyCaptains.forEach(({ socketId }) => {
    //   io.to(socketId).emit("newRideRequest", {
    //     rideId: ride._id,
    //     source,
    //     destination,
    //     fare: FareAndTime[vehicalType].price,
    //     phoneNumber: user.phoneNumber,
    //   });
    // });
    return res
      .status(200)
      .json({ ride, success: true, message: "Ride created successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: err.message,
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
    const { ride_id} = req.body;
    const captain_id=req.params.id
    console.log(captain_id)

    // Validate required fields
    if (!ride_id || !captain_id) {
      return res.status(400).json({ success: false, message: "Captain ID or Ride ID is required" });
    }

    // Check if the captain exists
    const captain = await Captain.findById(captain_id);
    console.log(captain)
    if (!captain) {
      return res.status(404).json({ success: false, message: "Captain not found" });
    }

    // Generate OTP
    const generateOtp = generateOTP(); // Fixed typo

    // Atomic update to prevent race condition
    const ride = await Ride.findOneAndUpdate(
      { _id: ride_id, status: "pending" },  // Ensure ride is still pending
      { status: "accepted", captain_id, otp: generateOtp },
      { new: true }  // Return updated ride
    );

    if (!ride) {
      return res.status(400).json({ success: false, message: "Ride is already accepted" });
    }

    // const { io, activeUser } = req;
    // Emit WebSocket event only if user is online
    // if (activeUser[ride.user_id]) {
    //   io.to(activeUser[ride.user_id]).emit("rideAccepted", {
    //     id: ride._id,
    //     captain_id,
    //     phoneNumber: captain.phoneNumber,
    //     generateOtp,
    //     message: "Your ride has been accepted!",
    //   });
    // }

    res.status(200).json({
      success: true,
      message: "Ride accepted",
      otp: generateOtp,  // Return OTP
    });

  } catch (err) {
    console.error("Error accepting ride:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// Ride completion logic
export const rideComplete = async (req, res) => {
  try {
    const { ride_id } = req.body;
    
    if (!ride_id) {
      return res
        .status(400)
        .json({ success: false, message: "Ride ID is required" });
    }

    // Use findOneAndUpdate to prevent race conditions
    const ride = await Ride.findOneAndUpdate(
      { _id: ride_id, status: "accepted" },  // Ensure only accepted rides can be completed
      { status: "completed" }, 
      { new: true }  // Return updated document
    );

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found or already completed/canceled",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ride completed successfully",
      ride,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// Ride otp verifiaction  logic
export const rideOtpVerification = async (req, res) => {
  try {
    const { ride_id, otp } = req.body;
    if (!ride_id) {
      return res.status(400).json({
        success: false,
        message: "Ride id is required",
      });
    }
    const ride = await Ride.findById(ride_id);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }
    if (ride.otp !== otp) {
      return res.status(400).json({
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
    return res.status(500).json({
      success: false,
      message: "Internal Server Problem",
    });
  }
};

// Ride Concellation logic
export const rideCancel = async (req, res) => {
  try {
    const { ride_id, user_id } = req.body; // Extract from req.body, not req.params
    const { io, activeCaptains } = req;

    // Validate required fields
    if (!ride_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: "Ride ID and User ID are required.",
      });
    }

    // Find ride by ID
    const ride = await Ride.findById(ride_id);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found.",
      });
    }

    // Check if the requesting user is the ride owner
    if (ride.user_id?.toString() !== user_id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to cancel this ride.",
      });
    }

    // Prevent cancellation if the ride is already completed
    if (ride.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Ride is already completed, cannot be cancelled.",
      });
    }

    // Prevent re-cancellation
    if (ride.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Ride is already cancelled.",
      });
    }

    // Mark ride as cancelled
    ride.status = "cancelled";
    await ride.save();

    // Notify captain if assigned
    if (ride.captain_id && activeCaptains[ride.captain_id]) {
      const captainSocketId = activeCaptains[ride.captain_id].socketId;
      io.to(captainSocketId).emit("rideCancelled", {
        rideId: ride._id, // Use `_id` instead of `id`
        message: "The ride has been cancelled by the user.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ride cancelled successfully.",
    });

  } catch (err) {
    console.error("Error in rideCancel:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
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
    const userId = req.params.id
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
