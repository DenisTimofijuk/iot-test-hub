import { Router } from "express";
import {
    createNewDocument,
    deleteDocument,
    getAllDocuments,
    getDocumentByID,
    updateDocument,
} from "../controllers/mongoContrillers";

const mongoRouter = Router();

// order matters in Express.js!
// mongoRouter.get("/:collection/stats", getCollectionStats); // #1
mongoRouter.get("/:collection/:id", getDocumentByID);
mongoRouter.get("/:collection", getAllDocuments);
mongoRouter.post("/:collection", createNewDocument);
mongoRouter.put("/:collection/:id", updateDocument);
mongoRouter.delete("/:collection/:id", deleteDocument);


export default mongoRouter;
