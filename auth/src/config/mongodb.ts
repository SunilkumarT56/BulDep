import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("MongoDB connected");
        });
        mongoose.connection.on("error", (error) => {
            console.error("MongoDB connection error:", error);
        });
        await mongoose.connect(`${process.env.MONGO_URI}/repo-metadata-service`);
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};
