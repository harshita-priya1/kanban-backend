import express, { Express, Request, Response } from "express";

const app: Express = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hi it is working...");
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
