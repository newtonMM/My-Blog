import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/user";
import seriesRoutes from "./routes/series";
import categoryRoutes from "./routes/category";
import artticleRoutes from "./routes/articles";
import commentRoutes from "./routes/comments";
import session from "express-session";
import { sessionStore } from "./models/sessions";

import * as dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(
  session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(userRoutes);
app.use(seriesRoutes);
app.use(categoryRoutes);
app.use(artticleRoutes);
app.use(commentRoutes);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.log("from server", error);
  const statusCode = 500;
  const message = "an error occured";
  res.status(statusCode).json({ message: message });
});

app.listen(3000, () => {
  console.log("we are server is running at port 3000");
});
