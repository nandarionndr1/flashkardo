import express from "express";
import FlashcardsController from "./flashcards.controller.js"
const router = express.Router();

//router.route("/").get((req, res) => res.send("testing testing.."));


router
    .route("/")
    .get(FlashcardsController.apiGetFlashcards)
    .post(FlashcardsController.apiPostFlashcard)
    .put(FlashcardsController.apiUpdateFlashcard)
    .delete(FlashcardsController.apiDeleteFlashcard)
    
export default router;
