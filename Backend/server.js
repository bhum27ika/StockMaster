import express from "express";
import { connectDB } from "./config/db.js";

const app = express();
app.use(express.json());

// connect to MongoDB
connectDB();

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
