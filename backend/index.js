import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import application from "express";
dotenv.config()
const MongoClient = mongodb.MongoClient;

import FlashcardsDAO from "./dao/flashcardsDAO.js"

const port = process.env.PORT || 8000;
MongoClient.connect( 
    process.env.FLASHCARDS_DB_URI,
    {
        maxPoolSize : 50,
        waitQueueTimeoutMS : 2500
    } 
).catch(
    err => { 
        console.error (err.stack)
        process.exit(1)
    }
).then(async client => {
    await FlashcardsDAO.injectDB(client)
    app.listen(port, () => {
        console.log(`Listening on Port ${port}`);

    })
});
