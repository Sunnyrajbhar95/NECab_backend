import mongoose from "mongoose";


const rcSchema= new mongoose.Schema({
      front_url:{
          type:String,
          required:true
      },

})
const RcModel=mongoose.model('RcModel',rcSchema)

export default RcModel
