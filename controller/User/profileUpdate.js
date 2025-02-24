// import UserLogin from "../../Model/userPanel/userLogin.js";
import User from "../../Model/userPanel/userSchema.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import UserLogin from "../../Model/userPanel/userLogin.js";

export const profileUpdate = async (req, res) => {
  try {
    const { phoneNumber, name, email, gender } = req.body;
   
    // Find user by phone number, create if not found
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required",
      });
    }
    const user = await User.findOneAndUpdate(
      { phoneNumber }, // Search condition
      { $set: { name, email, gender } }, // Update fields
      { new: true, upsert: true, runValidators: true } // Return updated doc, create if not found
    );
    // const user1 = await User.findOne({ phoneNumber });

    // if (user1) {
    //   if (user1.photo) {
    //     const filePath = path.join("public", "image", user1.photo);
    //     console.log("File Path:", filePath);
    //     if (fs.existsSync(filePath)) {
    //       fs.unlinkSync(filePath);
    //       console.log("File deleted successfully");
    //     }
    //   }
    //   user1.name = name,
    //   user1.email = email,
    //   user1.gender = gender
    //   user1.photo = req.file?.filename;

    //   await user1.save();

    // } else {
    //   console.log("hello")
    //   user1 = await User.create({
    //     phoneNumber,
    //     name,
    //     email,
    //     gender,
    //     photo:req.file?.filename,
    //   });
    // }

    // console.log(user1);
    return res.status(200).json({
      success: true,
      message: User.isNew ? "User Created" : "Profile Updated",
      user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating profile", error, success: false });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId)
      return res.status(400).json({
        success: false,
        message: "User id not found",
      });
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    return res.status(200).json({
      user,
      success: true,
      message: "Profile fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetched profile",
      error,
    });
  }
};

export const updateProfilepicture = async (req, res) => {
  try {
    const userId = req.params.id;
    // console.log(req.file.filename);
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id not found",
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }
    if (user.photo) {
      const filePath = path.join("public", "image", user.photo);
      console.log("File Path:", filePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("File deleted successfully");
      }
    }
    user.photo = req.file?.filename;
    const respnse = await user.save();
    return res.status(200).json({
      respnse,
      success: true,
      message: "Profile picture updated success fully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    // console.log(req.params.id);
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id not found",
      });
    }
    const user = await User.findById(userId);

    if (user.photo) {
      const filePath = path.join("public", "image", user.photo);
      console.log("File Path:", filePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("File deleted successfully");
      }
    }
    await UserLogin.deleteOne({ phoneNumber: user.phoneNumber });
    await User.deleteOne({ phoneNumber: user.phoneNumber });

    return res.status(200).json({
      success: true,
      message: "Account Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
