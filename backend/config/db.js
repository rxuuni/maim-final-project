import mongoose from "mongoose";

const connectDB = async () => {
  const uri = "mongodb+srv://ruxinftw_db_user:oxPPRAckKfC9Xv6X@cluster0.eklr4xj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/test";
  if (!uri) throw new Error("MONGO_URI not set");
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  console.log("✅ MongoDB connected");
};

export default connectDB;
