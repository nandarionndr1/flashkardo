import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let flashcards

export default class FlashcardsDAO {
    static async injectDB(conn){
        if(flashcards){
            return
        }
        try{
            flashcards = await conn.db(process.env.FLASHCARDS_NS).collection("flashcards")
        } catch(e){
            console.error(`Unable to establish a collection handle in flashcardsDAO: ${e}`)
        }
    }

    static async getFlashcards({
        filters = null,
        page = 0,
        flashcardsPerPage = 20,
    } = {}) {
        let query
        if (filters){
            if("subject" in filters){
                query = {"subject":{$eq: filters["subject"]}}
            }
            else if("author" in filters){
                query = {"author":{$eq: filters["author"]}}
            }
        }

        let cursor
        try{
            cursor = await flashcards.find(query)
        } catch(e){
            console.error(`Unable to issue find command, ${e}`)
            return {flashcardsList: [], totalFlashcards: 0}
        }

        const displayCursor = cursor.limit(flashcardsPerPage).skip(flashcardsPerPage * page)

        try{
            const flashcardsList = await displayCursor.toArray()
            const totalFlashcards = await flashcards.countDocuments(query)

            return{flashcardsList, totalFlashcards}
        } catch(e){
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`)
            return {flashcardsList: [], totalFlashcards: 0}
        }
    }

    static async addFlashcard(subject, author, front, back){
        try{
            const flashcardDocument = {
                subject: subject,
                author: author,
                front: front,
                back: back
            }

            return await flashcards.insertOne(flashcardDocument)
        } catch(e){
            console.error(`Unable to post flashcard: ${e}`)
            return {error: e}
        }
    }

    static async updateFlashcard(id, subject, author, front, back){
        try{
            const updateResponse = await flashcards.updateOne(
                { _id: ObjectId(id) },
                { $set: {subject: subject, author: author, front:front, back:back} }
            )

            return updateResponse
        } catch(e){
            console.error(`Unable to update card: ${e}`)
            return { error: e }
        }
    }

    static async deleteFlashcard(id){
        try{
            const deleteResponse = await flashcards.deleteOne(
                { _id: ObjectId(id) }
            )

            return deleteResponse
        } catch(e){
            console.error(`Unable to delete flashcard: ${e}`)
            return { error: e }
        }
    }
}