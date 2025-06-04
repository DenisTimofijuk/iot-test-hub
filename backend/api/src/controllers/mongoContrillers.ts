import { Request, Response } from "express";
import { initializeDatabase } from "../models/mongodb";
import { ObjectId } from "mongodb";

// export const getAllDocuments = async (req: Request, res: Response) => {
//   try {
//     const { collection } = req.params;
//     const { limit = 50, skip = 0, sort } = req.query;
//     const limitNum = parseInt(limit?.toString() ?? "50");
//     const skipNum = parseInt(skip?.toString() ?? "0");

//     const database = await initializeDatabase();

//     const coll = database.collection(collection);
//     let query = coll.find({});

//     // Apply sorting if provided
//     if (sort && typeof sort === "string") {
//       const sortObj = JSON.parse(sort);
//       query = query.sort(sortObj);
//     }

//     const documents = await query.skip(skipNum).limit(limitNum).toArray();

//     const total = await coll.countDocuments({});

//     res.json({
//       success: true,
//       data: documents,
//       total,
//       count: documents.length,
//     });
//   } catch (error: any) {
//     console.error("Error fetching documents:", error);
//     res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };

export const getAllDocuments = async (req: Request, res: Response) => {
    try {
        const { collection } = req.params;
        const { limit = 50, skip = 0, sort } = req.query;

        // Allow "0" or "-1" to mean no limit, but set a reasonable max
        const MAX_LIMIT = 10000; // Prevent memory issues
        let limitNum: number | undefined;

        if (limit === "0" || limit === "-1") {
            limitNum = undefined; // No limit
        } else {
            limitNum = Math.min(parseInt(limit?.toString() ?? "50"), MAX_LIMIT);
        }

        const skipNum = parseInt(skip?.toString() ?? "0");

        const database = await initializeDatabase();
        const coll = database.collection(collection);
        let query = coll.find({});

        if (sort && typeof sort === "string") {
            const sortObj = JSON.parse(sort);
            query = query.sort(sortObj);
        }

        // Apply limit conditionally
        query = query.skip(skipNum);
        if (limitNum !== undefined) {
            query = query.limit(limitNum);
        }

        const documents = await query.toArray();
        const total = await coll.countDocuments({});

        res.json({
            success: true,
            data: documents,
            total,
            count: documents.length,
        });
    } catch (error: any) {
        console.error("Error fetching documents:", error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

export const getLastDocuments = async (req: Request, res: Response) => {
    try {
        const { collection } = req.params;
        const { limit = 50, skip = 0, sort } = req.query;

        const MAX_LIMIT = 10000;
        let limitNum: number | undefined;

        if (limit === "0" || limit === "-1") {
            limitNum = undefined;
        } else {
            limitNum = Math.min(parseInt(limit?.toString() ?? "50"), MAX_LIMIT);
        }

        const skipNum = parseInt(skip?.toString() ?? "0");

        const database = await initializeDatabase();
        const coll = database.collection(collection);
        let query = coll.find({});

        // Apply sorting
        if (sort && typeof sort === "string") {
            query = query.sort(JSON.parse(sort));
        } else {
            // Default: get latest records first
            query = query.sort({ createdAt: -1 });
        }

        query = query.skip(skipNum);
        if (limitNum !== undefined) {
            query = query.limit(limitNum);
        }

        const documents = await query.toArray();
        const total = await coll.countDocuments({});

        res.json({
            success: true,
            data: documents,
            total,
            count: documents.length,
        });
    } catch (error: any) {
        console.error("Error fetching documents:", error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

export const getDocumentByID = async (req: Request, res: Response) => {
    try {
        const { collection, id } = req.params;
        const database = await initializeDatabase();
        const coll = database.collection(collection);

        const document = await coll.findOne({ _id: new ObjectId(id) });

        if (!document) {
            res.status(404).json({
                success: false,
                error: "Document not found",
            });

            return;
        }

        res.json({
            success: true,
            data: document,
        });
    } catch (error: any) {
        console.error("Error fetching document:", error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

export const createNewDocument = async (req: Request, res: Response) => {
    try {
        const { collection } = req.params;
        const document = req.body;

        // Add timestamp
        document.createdAt = new Date();
        const database = await initializeDatabase();
        const coll = database.collection(collection);
        const result = await coll.insertOne(document);

        res.status(201).json({
            success: true,
            data: {
                _id: result.insertedId,
                ...document,
            },
        });
    } catch (error: any) {
        console.error("Error creating document:", error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

export const updateDocument = async (req: Request, res: Response) => {
    try {
        const { collection, id } = req.params;
        const updates = req.body;

        // Add update timestamp
        updates.updatedAt = new Date();
        const database = await initializeDatabase();
        const coll = database.collection(collection);
        const result = await coll.updateOne(
            { _id: new ObjectId(id) },
            { $set: updates }
        );

        if (result.matchedCount === 0) {
            res.status(404).json({
                success: false,
                error: "Document not found",
            });
            return;
        }

        res.json({
            success: true,
            message: "Document updated successfully",
            modifiedCount: result.modifiedCount,
        });
    } catch (error: any) {
        console.error("Error updating document:", error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

export const deleteDocument = async (req: Request, res: Response) => {
    try {
        const { collection, id } = req.params;
        const database = await initializeDatabase();
        const coll = database.collection(collection);

        const result = await coll.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            res.status(404).json({
                success: false,
                error: "Document not found",
            });
            return;
        }

        res.json({
            success: true,
            message: "Document deleted successfully",
        });
    } catch (error: any) {
        console.error("Error deleting document:", error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};
