import mongoose from "mongoose";
import app from "./app.js";
const { HOST } = process.env;

mongoose
  .connect(HOST)
  .then(() =>
    app.listen(3000, () => {
      console.log("Server is running. Use our API on port: 3000");
    })
  )
  .catch(() => {
    process.exit();
  });
