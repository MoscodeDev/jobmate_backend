import mongoose from "mongoose";

const connectDb = async(db) =>{
    try {
        await mongoose.connect(db);
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Database connection failed:", error.message);
        process.exit(1); // Exit the process with failure
    }
};

export default connectDb;
