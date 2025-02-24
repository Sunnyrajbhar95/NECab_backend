import mongoose, { Mongoose } from "mongoose";

const captainSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  vehcleType:{
     type:String,
     required:true
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
  },
  license: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DlSchema",
  },
  adhar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdModel",
  },
  pancard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pan",
  },
  rc: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RcModel",
  },
  insurance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "InsModel",
  },
  permit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Permit",
  },
});

const Profile = mongoose.model("Profile", captainSchema);

export default Profile;
