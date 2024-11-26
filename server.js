import mongoose from "mongoose";
import app from "./app.js";

const { DB_HOST, PORT = 3000 } = process.env;

mongoose
	.connect(DB_HOST)
	.then(() =>
		app.listen(PORT, () => {
			console.log("Database connection successful");
		})
	)
	.catch((error) => {
		console.error("Error connecting to MongoDB:", error.message);
		process.exit();
	});
