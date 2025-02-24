import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const app = express();
import http from "http";
import { Server } from "socket.io";
import { userRouter } from "./Routes/UserRoutes/LoginUser.js";
import { router } from "./Routes/UserRoutes/Captain.js";
import { rideRouter } from "./Routes/UserRoutes/rides.js";
const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api/uploads", express.static("public/image"))

// Websocket Setup from here
// const activeCaptains = {};
// const activeUser = {};

// Handle WebSocket Connections
// io.on("connection", (socket) => {
//   console.log(`User connected: ${socket.id}`);

//   // Register Captains
//   socket.on("registerCaptain", ({ captain_id, lat, lon }) => {
//     activeCaptains[captain_id] = {
//       socketId: socket.id,
//       lat: lat,
//       lon: lon,
//     };
//     console.log(activeCaptains);
//     console.log(`Captain ${captain_id} connected.`);
//   });

  //Register User
  // socket.on("registerUser", (user_id) => {
  //   activeUser[user_id] = socket.id;
  //   // console.log(activeUser)
  //   console.log(`User ${user_id} connected.`);
  // });

  // Disconnect event
//   socket.on("disconnect", () => {
//     for (let captain_id in activeCaptains) {
//       if (activeCaptains[captain_id] === socket.id) {
//         delete activeCaptains[captain_id];
//         console.log(`Captain ${captain_id} disconnected.`);
//       }
//     }

//     for (let user_id in activeUser) {
//       if (activeUser[user_id] === socket.id) {
//         delete activeUser[user_id];
//         console.log(`User ${user_id} disconnected.`);
//       }
//     }
//   });
// });

// Make io accessible in routes
// app.use((req, res, next) => {
//   req.io = io;
//   req.activeCaptains = activeCaptains;
//   req.activeUser = activeUser;
//   next();
// });

// Connect to MongoDB
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error);
  });

// Routes

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1/user", userRouter);
app.use("/api/v2/captain", router);
app.use("/api/v3/ride",rideRouter)
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server started ON PORT ${port}`);
});
