import mongoose from "mongoose";


const rcSchema= new mongoose.Schema({
      captain_id:{
          type:mongoose.Schema.Types.ObjectId,
          ref:'Captain'
      },
      front_url:{
          type:String,
          required:true
      },
     

})
const RcModel=mongoose.model('RcModel',rcSchema)

export default RcModel
