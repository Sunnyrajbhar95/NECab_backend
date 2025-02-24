import mongoose from "mongoose";


const insSchema= new mongoose.Schema({
      front_url:{
          type:String,
          required:true
      },
})
const InsModel=mongoose.model('InsModel',insSchema)

export default InsModel