import type { Request, Response } from "express";
import { Skill } from "@/lib/schema";
import { createSkillSchema, updateSkillSchema, validateData } from "@/lib/validation";

export const createSkill = async (req: Request, res: Response) => {
  try {
    const result = validateData(createSkillSchema, req.body);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    const skill = await Skill.create(result.data as any);
    res.status(201).json(skill);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create skill";
    res.status(500).json({ error: message });
  }
};

export const getAllSkills = async (req: Request, res: Response) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch skills";
    res.status(500).json({ error: message });
  }
};

export const getSkillById = async (req: Request, res: Response) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ error: "Skill not found" });
    res.json(skill);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch skill";
    res.status(500).json({ error: message });
  }
};

export const getSkillsByCategory = async (req: Request, res: Response) => {
  try {
    const skills = await Skill.find({ category: req.params.category });
    res.json(skills);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch skills";
    res.status(500).json({ error: message });
  }
};

export const updateSkill = async (req: Request, res: Response) => {
  try {
    const result = validateData(updateSkillSchema, req.body);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    const skill = await Skill.findByIdAndUpdate(req.params.id, result.data as any, { new: true });
    if (!skill) return res.status(404).json({ error: "Skill not found" });
    res.json(skill);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update skill";
    res.status(500).json({ error: message });
  }
};

export const deleteSkill = async (req: Request, res: Response) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ error: "Skill not found" });
    res.json({ message: "Skill deleted successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete skill";
    res.status(500).json({ error: message });
  }
};
