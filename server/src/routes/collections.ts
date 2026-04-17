import { Router } from "express";
import * as collectionController from "@/controllers/collectionController";

const router = Router();

router.post("/", collectionController.createCollection);
router.get("/", collectionController.getAllCollections);
router.get("/:id", collectionController.getCollectionById);
router.patch("/:id", collectionController.updateCollection);
router.delete("/:id", collectionController.deleteCollection);

export default router;
