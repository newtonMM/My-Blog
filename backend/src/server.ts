import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/user";
import seriesRoutes from "./routes/series";
import categoryRoutes from "./routes/category";
import artticleRoutes from "./routes/articles";

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

app.use(userRoutes);
app.use(seriesRoutes);
app.use(categoryRoutes);
app.use(artticleRoutes);

app.listen(3000, () => {
  console.log("we are server is running at port 3000");
});
