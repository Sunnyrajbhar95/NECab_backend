import mongoose from "mongoose";

const rideSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    captain_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Captain",
    },
    startLocation: {
      type: String,
      required: true,
    },
    endLocation: {
      type: String,
      required: true,
    },
    fare: {
      type: Number,
      required: true,
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    vehicalType:{
     type:String,
     required:true
    },
    
    status: {
      type: String,
      enum: ["pending", "accepted", "completed", "cancelled"],
      default: "pending",
      required: true,
    },
    otp:{
        type:Number
    }
  },
  { timestamps: true }
);


const Ride=mongoose.model("Ride",rideSchema);
 
export default Ride