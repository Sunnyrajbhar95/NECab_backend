import mongoose from "mongoose";


const AdSchema= new mongoose.Schema({
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
