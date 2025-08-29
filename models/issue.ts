import mongoose,{ Schema, model, models } from "mongoose";

const issueSchema =new Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    status:{type:String,enum:["open","in_progress","resolved","closed"],default:"open"},
    image:{type:String}, // URL or file reference
    createdBy:{type:Schema.Types.ObjectId,ref:"User",required:true},
    

},{})