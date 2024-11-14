import mongoose from "mongoose";
import app from "./app.js";
const { HOST, PORT = 3000 } = process.env;
console.log(HOST, PORT);

mongoose
  .connect(HOST)
  .then(() =>
    app.listen(PORT, () => {
      console.log(`Server is running. Use our API on port: ${PORT}`);
    })
  )
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit();
  });
