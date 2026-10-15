// import "dotenv/config";
// import express from "express";
// import { createServer } from "node:http";
// import { Server } from "socket.io";
// import cors from "cors";
// import mongoose from "mongoose";
// import { connectToSocket } from "./controller/socketManager.js";
// import userRoute from "./routes/users.router.js";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// const server = createServer(app);
// const io = connectToSocket(server);
// const uri = process.env.MONGO_URL;

// app.set("port", process.env.PORT || 8000);
// app.use(cors());
// app.use(express.json({ limit: "40kb" }));
// app.use(express.urlencoded({ limit: "40kb", extended: true }));
// app.use("/api/v1/user", userRoute);

// app.use(express.static(path.join(__dirname, "build")));

// app.use((req, res) => {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });

// const start = async () => {
//   try {
//     await mongoose.connect(uri);
//     console.log("MongoDB connected");

//     server.listen(app.get("port"), () => {
//       console.log(`Server listening on port ${app.get("port")}`);
//     });
//   } catch (error) {
//     console.error(error);
//   }
// };

// start();

import "dotenv/config";
import express from "express";
import { createServer } from "node:http";
import cors from "cors";
import mongoose from "mongoose";
import { connectToSocket } from "./controller/socketManager.js";
import userRoute from "./routes/users.router.js";

const app = express();
const server = createServer(app);

connectToSocket(server);

const uri = process.env.MONGO_URL;

app.set("port", process.env.PORT || 8000);

app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Zoom Clone Backend is running",
  });
});

// API routes
app.use("/api/v1/user", userRoute);

const start = async () => {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");

    server.listen(app.get("port"), () => {
      console.log(`Server listening on port ${app.get("port")}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

start();
