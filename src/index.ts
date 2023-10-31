import express, { Express, Request, Response } from "express";
import connectDB from "./database/connectDB";
import cors from "cors";

const app: Express = express();

const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hi it is working...");
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
