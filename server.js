import mongoose from "mongoose";
import app from "./app.js";
const { HOST, PORT = 3000 } = process.env;

mongoose
  .connect(HOST)
  .then(() =>
    app.listen(PORT, () => {
      console.log("Database connection successful");
    })
  )
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit();
  });
