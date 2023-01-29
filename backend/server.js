import express  from "express";
import cors from "cors";
import flashcards from "./api/flashcards.route.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/v1/flashcards", flashcards);
app.use("*",(req, res) => res.status(404).json({ error : "Not Found"}));


export default app;
