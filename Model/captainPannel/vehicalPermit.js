import mongoose from "mongoose";


const PerSchema= new mongoose.Schema({
      front_url:{
          type:String,
          required:true
      },
})
const Permit=mongoose.model('Permit',PerSchema)

export default Permit
