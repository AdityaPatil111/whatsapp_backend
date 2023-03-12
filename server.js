import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import Pusher from "pusher";
import cors from 'cors';

const app=express();
const port=process.env.PORT || 9000;

const pusher = new Pusher({
  appId: "1566904",
  key: "6dc3088535a85a56dfee",
  secret: "190bd4dbe3cae38e6de4",
  cluster: "ap2",
  useTLS: true
});

//middleware
app.use(express.json()); 

app.use(cors());

// app.use((req, res, next)=>{
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Header", "*");
//   next();
// });

//DB config
const connection_url="mongodb+srv://admin:P6vectY5qYvjr7A3@cluster0.pcut5za.mongodb.net/Cluster0?retryWrites=true&w=majority";

mongoose.connect(connection_url,{

    // useCreateIndex:true,
    
    useNewUrlParser:true,
    useUnifiedTopology:true,
});

const db = mongoose.connection;

db.once("open", ()=>{
  console.log("Db connected");

  const msgCollection = db.collection("messagecontents");
  const changeStream=msgCollection.watch();

  changeStream.on("change", (change)=>{
    console.log("A change occure",change);

    if(change.operationType === "insert"){
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted",{
        name: messageDetails.name,
        message:messageDetails.message,
        timestamp:messageDetails.timestamp,
        received:messageDetails.received,
      });
    }else{
      console.log("Error triggering pusher");
    }
  });
});

//api routes
app.get("/",(req,res)=>res.status(200).send("hello world"));

app.get("/api/v1/messages/sync", (req, res) => {

    Messages.find()
      .then((data) => {
        res.status(201).send(data);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  });
  
  

app.post("/api/v1/messages/new", (req, res) => {
    const dbMessage = req.body;
  
    Messages.create(dbMessage)
      .then((data) => {
        res.status(201).send(data);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
      
  }); 
  

app.listen(port,()=>console.log(`Listening on localhost :${port}`));