import mongoose from "mongoose";


const dlSchema= new mongoose.Schema({
      captain_id:{
          type:mongoose.Schema.Types.ObjectId,
          ref:'Captain'
      },
      number:{
        type:String,
        required:true,
        minlength: 12,  
      },
      dob:{
         type:Date,
         required:true
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
const DlSchema=mongoose.model('DlSchema',dlSchema)

export default DlSchema
