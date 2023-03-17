import mongoose from "mongoose";

// const whatsappSchema=mongoose.Schema({
//     message:String,
//     name:String,
//     timestamp:String,
//     received:Boolean,
// });

// export default mongoose.model('messagecontents',whatsappSchema);

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