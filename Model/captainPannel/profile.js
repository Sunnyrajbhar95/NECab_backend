import mongoose, { Mongoose } from "mongoose";

const captainSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "please enter your email address"],
    match:[/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
  },
  phoneNumber: {
    type: String,
    required: true,
    minlength:[10,"enter 10 degit mobile number"],
    maxlength:[10,"enter 10 degit mobile number"],
    match:[/^[6-9]\d{9}$/, 'Please enter a valid phone number']
  },
  alternatePhoneNumber: {
    type: String,
  },
  vehicalType: {
    type: String,
    required:true
  },
  vehicalNumber:{
     type:String,
     required:true  
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
  },
  profilePicture:{
      type:String   
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
