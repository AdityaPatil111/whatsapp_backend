
import express from "express";
import mongoose from "mongoose";
import Pusher from "pusher";
import cors from 'cors';
import Rooms from "./dbRooms.js";
import Messages from "./dbMessages.js";

// const Rooms=require("./dbRooms");

const app=express();

const pusher = new Pusher({
  appId: "1569961",
  key: "6eeb781fc3b777771f72",
  secret: "0dd395be5550471e322a",
  cluster: "ap2",
  useTLS: true
});

const port=process.env.PORT || 8000;



//middleware
app.use(express.json()); 

app.use(cors());



//DB config
const connection_url="mongodb+srv://admin123:JHs5tf2u9iFgViIG@cluster123.nkxjqqx.mongodb.net/Cluster123?retryWrites=true&w=majority";

mongoose.connect(connection_url);

const db = mongoose.connection;

db.once("open", ()=>{
  console.log("Db connected");

  const roomCollection = db.collection("rooms");
  const changeStream = roomCollection.watch();
  
   changeStream.on("change",(change)=>{
    if(change.operationType === "insert"){
      const roomDetails = change.fullDocument;
      pusher.trigger("room","inserted",roomDetails);
    }else{
      console.log("Not expected event to trigger");
    }
  });

  const msgCollection = db.collection("messages");
  const changeStream1 = msgCollection.watch();
  
   changeStream1.on("change",(change)=>{
    if(change.operationType === "insert"){
      const messageDetails = change.fullDocument;
      pusher.trigger("messages","inserted",messageDetails);
    }else{
      console.log("Not expected event to trigger");
    }
  });


});


  
app.get("/",(req,res)=>res.status(200).send("hello world"));




app.get("/room/:id", async (req, res) => {
  try {
    const room = await Rooms.findOne({ _id: req.params.id });
    if (!room) {
      return res.status(404).send('Room not found');
    }
    return res.status(200).send(room);
  } catch (err) {
   
    return res.status(500).send(err);
  }
});

app.get("/messages/:id", async (req, res) => {
  try {
    const data = await Messages.find({ roomId: req.params.id });
    return res.status(200).send(data);
  } catch (err) {
    return res.status(500).send(err);
  }
});




app.post("/api/v1/messages/chat", (req, res) => {
  const dbMessage = req.body;
  Messages.create(dbMessage)
    .then((data) => {
      return res.status(201).send(data);
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
});

 

app.post("/api/v1/messages/new", async (req, res) => {
  try {
    const name = req.body.groupName;
    const room = await Rooms.create({ name });                    //this is for groups;
    return res.status(201).send(room);
  } catch (error) {
    return res.status(500).send(error);
  }
});


app.get("/api/v1/messages/room", async (req, res) => {
  try {
    const rooms = await Rooms.find({});
    return res.status(200).send(rooms);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
});



  

app.listen(port,()=>console.log(`Listening on localhost :${port}`));
