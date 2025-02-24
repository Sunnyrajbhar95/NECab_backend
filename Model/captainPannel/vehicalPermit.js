import mongoose from "mongoose";


const PerSchema= new mongoose.Schema({
      captain_id:{
          type:mongoose.Schema.Types.ObjectId,
          ref:'Captain'
      },
      front_url:{
          type:String,
          required:true
      },
     

})
const Permit=mongoose.model('Permit',PerSchema)

export default Permit
