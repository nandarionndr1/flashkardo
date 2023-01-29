import FlashcardsDAO from "../dao/flashcardsDAO.js"

export default class FlashcardsController{

    // GET Flashcards
    static async apiGetFlashcards(req, res, next){
        const flashcardsPerPage = req.query.flashcardsPerPage ? parseInt(req.query.flashcardsPerPage, 10) : 20
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}
        if(req.query.author){
            filters.author = req.query.author
        }
        else if(req.query.subject){
            filters.subject = req.query.subject
        }

        const{flashcardsList, totalFlashcards} = await FlashcardsDAO.getFlashcards({
            filters,
            page,
            flashcardsPerPage
        })

        let response = {
            flashcards: flashcardsList,
            page: page,
            filters: filters,
            entries_per_page: flashcardsPerPage,
            total_results: totalFlashcards
        }
        res.json(response)
    }

    // POST Flashcard
    static async apiPostFlashcard(req, res, next){
        try{
            const author = req.body.author
            const subject = req.body.subject
            const front = req.body.front
            const back = req.body.back
            const flashcardResponse = await FlashcardsDAO.addFlashcard(
                author,
                subject,
                front,
                back
            )
            res.json({status: "success"})
        } catch(e){
            res.status(500).json({error:e.message})
        }
    }

    // UPDATE Flashcard
    static async apiUpdateFlashcard(req, res, next){
        try{
            const id = req.body.id
            const author = req.body.author
            const subject = req.body.subject
            const front = req.body.front
            const back = req.body.back
            
            const flashcardResponse = await FlashcardsDAO.updateFlashcard(
                id,
                author,
                subject,
                front,
                back
            )

            var { error } = flashcardResponse
            if(error){
                res.status(400).json({error})
            }

            if(flashcardResponse.modifiedCount === 0){
                throw new Error("Unable to update flashcard - no modification was made")
            }

            res.json({status: "success"})
        } catch(e){
            res.status(500).json({error:e.message})
        }
    }

    // DELETE Flashcard
    static async apiDeleteFlashcard(req, res, next){
        try{
            const id = req.query.id
            const flashcardResponse = await FlashcardsDAO.deleteFlashcard(
                id
            )

            if(flashcardResponse.deletedCount === 0){
                throw new Error("No flashcard was deleted")
            }

            res.json({status: "success"})
        } catch(e){
            res.status(500).json({error:e.message})
        }
    }
}