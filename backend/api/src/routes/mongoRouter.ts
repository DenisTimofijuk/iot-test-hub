import { Router } from "express";
import {
    createNewDocument,
    deleteDocument,
    getAllDocuments,
    getDocumentByID,
    getLastDocuments,
    updateDocument,
} from "../controllers/mongoContrillers";
import { authenticateToken } from "../middlewares/authMiddleware";

const mongoRouter = Router();

// Protect all routes by using authenticateToken
mongoRouter.use(authenticateToken);

// order matters in Express.js!
mongoRouter.get("/:collection/all", getAllDocuments);
mongoRouter.get("/:collection/:id", getDocumentByID);
mongoRouter.get("/:collection", getLastDocuments);
mongoRouter.post("/:collection", createNewDocument);
mongoRouter.put("/:collection/:id", updateDocument);
mongoRouter.delete("/:collection/:id", deleteDocument);


export default mongoRouter;
