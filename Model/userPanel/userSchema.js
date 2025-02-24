import mongoose from "mongoose";

const userSchema = mongoose.Schema({
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
  gender:{  
    type: String,
    required: true,
    enum : ["Male","Female", "Other"]
  },
  photo:{
      type:String
  }
});

const User = mongoose.model("User", userSchema);

export default User;