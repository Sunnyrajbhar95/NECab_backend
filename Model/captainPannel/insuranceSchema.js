import mongoose from "mongoose";


const insSchema= new mongoose.Schema({
      captain_id:{
          type:mongoose.Schema.Types.ObjectId,
          ref:'Captain'
      },
      front_url:{
          type:String,
          required:true
      },
     

})
const InsModel=mongoose.model('InsModel',insSchema)

export default InsModel