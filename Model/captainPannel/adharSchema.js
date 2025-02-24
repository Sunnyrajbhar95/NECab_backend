import mongoose from "mongoose";


const AdSchema= new mongoose.Schema({
      captain_id:{
          type:mongoose.Schema.Types.ObjectId,
          ref:'Captain'
      },
      number:{
        type:String,
        required:true,
        minlength: 12,  
      },
      front_url:{
          type:String,
          required:true
      },
      backend_url:{
          type:String,
          required:true
      }

})
const AdModel=mongoose.model('AdModel',AdSchema)

export default AdModel
