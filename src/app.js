import cors from "cors";
import express from "express";
import morgan from "morgan";
import { errorHandler } from "./middleware/error.js";
import { notFound } from "./middleware/notFound.js";
import routes from "./routes/index.js";

const app = express();

app.use(cors());

app.use(express.json());

// Log HTTP requests (dev only)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// all routes

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
