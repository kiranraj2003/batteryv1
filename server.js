import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import batteryRoutes from "./routes/batteryRoutes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


mongoose
  .connect(
    process.env.MONGODB_URI
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));


app.use("/api/batteries", batteryRoutes);

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);


// mongoose
//   .connect("mongodb://127.0.0.1:27017/batterydb")
//   .then(() => console.log("MongoDB connected"))
//   .catch(err => console.error(err));

// mongoose
//   .connect(
//     "mongodb+srv://kiranindevelopment_db_user:V4zxYlZieka3250W@cluster0.0fs1jgd.mongodb.net/?appName=Cluster0"
//   )
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error(err));