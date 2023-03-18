import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
    name:String,
    message:String,
    timestamp:String,
    uid:String,
    roomId:String
},
{
    timestamp: true,
});
const Messages = mongoose.model("messages",messageSchema);
// module.exports = Messages;
 export default Messages;