import Profile from "../../Model/captainPannel/profile.js";
import path from "path";
import fs from "fs";
export const updateProfile = async (req, res) => {
  try {
    console.log(req.body);
    const { phoneNumber, name, alternatePhoneNumber, gender, email,vehicalType,vehicalNumber } = req.body;
    const captain = await Profile.findOne({ phoneNumber });
    if (captain) {
      captain.name = name;
      captain.alternatePhoneNumber = alternatePhoneNumber;
      captain.gender = gender;
      await captain.save();
      return res.status(200).json({
        success: true,
        message: "Profile Updated",
      });
    } else {
      const captain = await Profile.create({
        phoneNumber,
        name,
        alternatePhoneNumber,
        gender,
        email,
        vehicalType,
        vehicalNumber
        
      });
      return res.status(200).json({
        captain,
        success: true,
        message: "Profile Created",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getCaptainProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await Profile.findById(id)
      .populate("license", "-_id")
      .populate("adhar", "-_id")
      .populate("pancard", "-_id")
      .populate("rc", "-_id")
      .populate("insurance", "-_id")
      .populate("permit", "-_id");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile does not exist",
      });
    }
    return res.status(200).json({
      profile,
      success: true,
      message: "Profile fetched successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const updateProfilepicture = async (req, res) => {
  try {
    const captainId = req.params.id;
    if (!captainId)
      return res.status(400).json({
        success: false,
        message: "captain id is required",
      });
    const captain = await Profile.findById(captainId);
    if (!captain)
      return res.status(404).json({
        success: false,
        message: "profile does not exist",
      });

    if (captain.profilePicture) {
      const filePath = path.join("public", "image", captain.profilePicture);
      console.log("File Path:", filePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("File deleted successfully");
      }
    }

    captain.profilePicture = req.file?.filename;
    await captain.save();
    return res.status(200).json({
      success: true,
      message: "Profile Picture  Updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server Problem",
    });
  }
};
