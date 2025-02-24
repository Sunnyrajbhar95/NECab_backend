import Profile from "../../Model/captainPannel/profile.js";

export const updateProfile = async (req, res) => {
  try {
     console.log(req.body)
    const { phoneNumber, name, email, gender } = req.body;
    
    
    const captain = await Profile.findOne({ phoneNumber});


    if(captain)
    {
          captain.name=name
          captain.email=email
          captain.gender=gender
          await  captain.save();
          return res.status(200).json({
              message:"Profile Updated"
          })
    }
    else{
      const captain=await Profile.create({phoneNumber, name, email, gender})
      return res.status(200).json({
           message:"Profile Created"
      }) 
    }
  } catch (err) {
    console.log(err)
    return res.status(401).json({
      success: false,
      error: err,
    });
  }
};


export const getCaptainProfile=async(req,res)=>{
   try{
        const {id}=req.params
       const profile=await Profile.findById(id)
       .populate("license","-_id")
       .populate('adhar',"-_id")
       .populate('pancard',"-_id")
       .populate("rc","-_id")
       .populate('insurance',"-_id")
       .populate('permit',"-_id")

       if(!profile)
       {
          return res.status(401).json({
              message:"Profile does not exist"
          })
       }
       return res.status(200).json({
           profile,
           success:true,   
       })

   }
   catch(err)
   {    console.log(err)
       return res.status(401).json({
           success:false,
           error:err
       })
   }
}
