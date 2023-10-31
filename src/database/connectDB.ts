import mongoose from "mongoose";

require("dotenv").config();

const connectDB = async () => {
  try {
    console.log("Connecting to Database...");
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
    } else {
      console.error("The MONGODB_URI environment variable is not set.");
    }
    console.log("Connected to Database...");
  } catch (err) {
    console.log(`Some Error occured while connecting to Database: ${err}`);
  }
};

export default connectDB;
