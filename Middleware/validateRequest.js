export const validate=async(req,res,next)=>{
    console.log(req.body)
     const {number , dob}=req.body
     if(!number || !dob)
     {
         return res.status(401).json({
             message:"Incomplete data"
         })
     }
     next();
}