import type { Request, Response } from "express";
import { User } from "@/lib/schema";
import { updateUserSchema, validateData } from "@/lib/validation";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch users";
    res.status(500).json({ error: message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch user";
    res.status(500).json({ error: message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const result = validateData(updateUserSchema, req.body);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    const user = await User.findByIdAndUpdate(req.params.id, result.data as any, { new: true }).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update user";
    res.status(500).json({ error: message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete user";
    res.status(500).json({ error: message });
  }
};
