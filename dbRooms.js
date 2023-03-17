// const mongoose=require("mongoose");
import mongoose from "mongoose";

const roomSchema=new mongoose.Schema(
    {
        name:String,
    },
    {
        timestamp:true,
    }
);

const Rooms=mongoose.model("rooms",roomSchema);
export default Rooms;