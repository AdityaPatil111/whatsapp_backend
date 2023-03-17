// import express from "express";
// import mongoose from "mongoose";
// import Messages from "./dbMessages.js";
// import Pusher from "pusher";
// import cors from 'cors';

// const app=express();
// const port=process.env.PORT || 9000;

// const pusher = new Pusher({
//   appId: "1566904",
//   key: "6dc3088535a85a56dfee",
//   secret: "190bd4dbe3cae38e6de4",
//   cluster: "ap2",
//   useTLS: true
// });

// //middleware
// app.use(express.json()); 

// app.use(cors());



// //DB config
// const connection_url="mongodb+srv://admin:P6vectY5qYvjr7A3@cluster0.pcut5za.mongodb.net/Cluster0?retryWrites=true&w=majority";

// mongoose.connect(connection_url,{

//     // useCreateIndex:true,
    
//     useNewUrlParser:true,
//     useUnifiedTopology:true,
// });

// const db = mongoose.connection;

// db.once("open", ()=>{
//   console.log("Db connected");

//   const msgCollection = db.collection("messagecontents");
//   const changeStream=msgCollection.watch();

//   changeStream.on("change", (change)=>{
//     console.log("A change occure",change);

//     if(change.operationType === "insert"){
//       const messageDetails = change.fullDocument;
//       pusher.trigger("messages", "inserted",{
//         name: messageDetails.name,
//         message:messageDetails.message,
//         timestamp:messageDetails.timestamp,
//         received:messageDetails.received,
//       });
//     }else{
//       console.log("Error triggering pusher");
//     }
//   });
// });

// //api routes
// app.get("/",(req,res)=>res.status(200).send("hello world"));

// app.get("/api/v1/messages/sync", (req, res) => {

//     Messages.find()
//       .then((data) => {
//         res.status(201).send(data);
//       })
//       .catch((err) => {
//         res.status(500).send(err);
//       });
//   });
  
  

// app.post("/api/v1/messages/new", (req, res) => {
//     const dbMessage = req.body;
  
//     Messages.create(dbMessage)
//       .then((data) => {
//         res.status(201).send(data);
//       })
//       .catch((err) => {
//         res.status(500).send(err);
//       });
      
//   }); 
  

// app.listen(port,()=>console.log(`Listening on localhost :${port}`));




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

  // const msgCollection = db.collection("messagecontents");
  // const changeStream=msgCollection.watch();

  // changeStream.on("change", (change)=>{
  //   console.log("A change occure",change);

  //   if(change.operationType === "insert"){
  //     const messageDetails = change.fullDocument;
  //     pusher.trigger("messages", "inserted",{
  //       name: messageDetails.name,
  //       message:messageDetails.message,
  //       timestamp:messageDetails.timestamp,
  //       received:messageDetails.received,
  //     });
  //   }else{
  //     console.log("Error triggering pusher");
  //   }
  // });
});

//api routes


// app.get("/api/v1/messages/sync", (req, res) => {

//     Messages.find()
//       .then((data) => {
//         res.status(201).send(data);
//       })
//       .catch((err) => {
//         res.status(500).send(err);
//       });
//   });
  
app.get("/",(req,res)=>res.status(200).send("hello world"));


// app.post("/api/v1/messages/chat", (req, res) =>{
//   const dbMessage = req.body;
//   Messages.create(dbMessage, (err, data)=>{
//     if(err){
//       return res.status(500).send(err);             //this is for messages;
//     }else{
//       return res.status(201).send(data);
//     }
//   });
// });

// app.get("/room/:id",(req, res) => {
   
//     Rooms.find({ _id:req.params.id},(err,data)=>{
//       if(err){
//         return res.status(500).send(err);
//       }else{
//         return res.status(200).send(data[0]);
//       }
//     });
   
// });

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

// app.post("/api/v1/messages/new", (req, res) => {
//     const name = req.body.groupName;
  
//     Rooms.create({name},(err,data)=>{
//         if(err){
//           return res.status(500).send(err);
//         }else{
//           return res.status(201).send(data);
//         }
//     });
      
      
//   }); 

app.post("/api/v1/messages/new", async (req, res) => {
  try {
    const name = req.body.groupName;
    const room = await Rooms.create({ name });                    //this is for groups;
    return res.status(201).send(room);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// app.get("/api/v1/messages/room", (req, res) => {
//   Rooms.find({}, (err, data) =>{
//     if(err){
//       return res.status(500).send(err);
//     }else{
//       return res.status(200).send(data);
//     }
//   });    
// });

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
