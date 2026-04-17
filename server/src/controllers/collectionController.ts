import type { Request, Response } from "express";
import { Collection } from "@/lib/schema";
import { createCollectionSchema, updateCollectionSchema, validateData } from "@/lib/validation";

export const createCollection = async (req: Request, res: Response) => {
  try {
    const result = validateData(createCollectionSchema, req.body);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    const collection = await Collection.create(result.data as any);
    res.status(201).json(collection);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create collection";
    res.status(500).json({ error: message });
  }
};

export const getAllCollections = async (req: Request, res: Response) => {
  try {
    const collections = await Collection.find().populate("userId").populate("skills");
    res.json(collections);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch collections";
    res.status(500).json({ error: message });
  }
};

export const getCollectionById = async (req: Request, res: Response) => {
  try {
    const collection = await Collection.findById(req.params.id).populate("userId").populate("skills");
    if (!collection) return res.status(404).json({ error: "Collection not found" });
    res.json(collection);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch collection";
    res.status(500).json({ error: message });
  }
};

export const updateCollection = async (req: Request, res: Response) => {
  try {
    const result = validateData(updateCollectionSchema, req.body);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    const collection = await Collection.findByIdAndUpdate(req.params.id, result.data as any, { new: true })
      .populate("userId")
      .populate("skills");
    if (!collection) return res.status(404).json({ error: "Collection not found" });
    res.json(collection);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update collection";
    res.status(500).json({ error: message });
  }
};

export const deleteCollection = async (req: Request, res: Response) => {
  try {
    const collection = await Collection.findByIdAndDelete(req.params.id);
    if (!collection) return res.status(404).json({ error: "Collection not found" });
    res.json({ message: "Collection deleted successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete collection";
    res.status(500).json({ error: message });
  }
};
