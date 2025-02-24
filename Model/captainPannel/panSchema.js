import mongoose from "mongoose";


const PanSchema= new mongoose.Schema({
      number:{
        type:String,
        required:true,
        minlength: 12,  
      },
      
      front_url:{
          type:String,
          required:true
      },
     

})
const Pan=mongoose.model('Pan',PanSchema)

export default Pan
