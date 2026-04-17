import type { Request, Response } from "express";
import { Verification, Skill } from "@/lib/schema";
import { createVerificationSchema, updateVerificationSchema, submitAnswersSchema, completeLevelSchema, verificationLevels, validateData } from "@/lib/validation";
import { generateMockQuestions } from "@/lib/mockQuestions";

export const createVerification = async (req: Request, res: Response) => {
  try {
    const result = validateData(createVerificationSchema, req.body);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    // Validate that skill exists
    const skill = await Skill.findById((result.data as any).skillId);
    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }

    const verification = await Verification.create(result.data as any);

    // Auto-generate choice level with mock questions
    const mockQuestions = generateMockQuestions(skill.title);
    verification.levelData.push({
      level: "choice",
      status: "pending",
      choice: { questions: mockQuestions },
    });

    await verification.save();
    res.status(201).json(verification);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create verification";
    res.status(500).json({ error: message });
  }
};

export const getAllVerifications = async (req: Request, res: Response) => {
  try {
    const verifications = await Verification.find().populate("userId").populate("skillId");
    res.json(verifications);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch verifications";
    res.status(500).json({ error: message });
  }
};

export const getVerificationById = async (req: Request, res: Response) => {
  try {
    const verification = await Verification.findById(req.params.id)
      .populate("userId")
      .populate("skillId");
    if (!verification) return res.status(404).json({ error: "Verification not found" });
    res.json(verification);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch verification";
    res.status(500).json({ error: message });
  }
};

export const updateVerification = async (req: Request, res: Response) => {
  try {
    const result = validateData(updateVerificationSchema, req.body);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    const verification = await Verification.findByIdAndUpdate(req.params.id, result.data as any, { new: true })
      .populate("userId")
      .populate("skillId");
    if (!verification) return res.status(404).json({ error: "Verification not found" });
    res.json(verification);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update verification";
    res.status(500).json({ error: message });
  }
};

export const deleteVerification = async (req: Request, res: Response) => {
  try {
    const verification = await Verification.findByIdAndDelete(req.params.id);
    if (!verification) return res.status(404).json({ error: "Verification not found" });
    res.json({ message: "Verification deleted successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete verification";
    res.status(500).json({ error: message });
  }
};

export const submitAnswers = async (req: Request, res: Response) => {
  try {
    const result = validateData(submitAnswersSchema, req.body);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    const verification = await Verification.findById(req.params.id);
    if (!verification) {
      return res.status(404).json({ error: "Verification not found" });
    }

    // Find choice level
    const choiceLevel = verification.levelData.find((level) => level.level === "choice");
    if (!choiceLevel) {
      return res.status(400).json({ error: "No choice level found on this verification" });
    }

    if (choiceLevel.status !== "pending") {
      return res.status(400).json({ error: `Choice level is not pending (status: ${choiceLevel.status})` });
    }

    const answers = (result.data as any).answers;
    const questions = choiceLevel.choice?.questions || [];

    if (answers.length !== questions.length) {
      return res.status(400).json({ error: `Expected ${questions.length} answers, got ${answers.length}` });
    }

    // Calculate score
    const correct = answers.filter((ans: string, i: number) => ans === questions[i].answer).length;
    const score = (correct / questions.length) * 100;

    // Update choice level with answers and score (inside the choice object)
    if (!choiceLevel.choice) {
      choiceLevel.choice = { questions };
    }
    choiceLevel.choice.userAnswers = answers;
    choiceLevel.choice.score = score;

    // Determine pass/fail and auto-create next level
    if (score >= 80) {
      choiceLevel.status = "completed";

      // Auto-create p2p_interview level
      verification.levelData.push({
        level: "p2p_interview",
        status: "pending",
        link: "https://discord.gg/mock-link",
      });

      await verification.save();
      return res.status(200).json({
        passed: true,
        score,
        message: "Level 1 passed! p2p_interview level created.",
        verification,
      });
    } else {
      choiceLevel.status = "failed";
      await verification.save();
      return res.status(200).json({
        passed: false,
        score,
        message: "Score too low. Retry to reset.",
        verification,
      });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to submit answers";
    res.status(500).json({ error: message });
  }
};

export const completeLevel = async (req: Request, res: Response) => {
  try {
    // Validate level param
    if (!(verificationLevels as readonly string[]).includes(req.params.level)) {
      return res.status(400).json({ error: "Invalid verification level" });
    }

    // Cannot complete choice via this endpoint
    if (req.params.level === "choice") {
      return res.status(400).json({ error: "Cannot complete choice level via this endpoint. Use /submit instead." });
    }

    const result = validateData(completeLevelSchema, req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    const verification = await Verification.findById(req.params.id);
    if (!verification) {
      return res.status(404).json({ error: "Verification not found" });
    }

    // Find level entry
    const levelEntry = verification.levelData.find((level) => level.level === req.params.level);
    if (!levelEntry) {
      return res.status(404).json({ error: `Level '${req.params.level}' not found on this verification` });
    }

    if (levelEntry.status !== "pending") {
      return res.status(409).json({ error: `Level '${req.params.level}' is not pending (status: ${levelEntry.status})` });
    }

    // Mark level as completed
    levelEntry.status = "completed";
    levelEntry.verifiedAt = new Date();
    const data = result.data as any;
    if (data.verifiedBy) {
      levelEntry.verifiedBy = data.verifiedBy as any;
    }

    // Auto-create interview level if completing p2p_interview
    if (req.params.level === "p2p_interview") {
      verification.levelData.push({
        level: "interview",
        status: "pending",
        link: "https://meet.google.com/mock-link",
      });
    }

    await verification.save();
    res.status(200).json(verification);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to complete level";
    res.status(500).json({ error: message });
  }
};

export const retryChoice = async (req: Request, res: Response) => {
  try {
    const verification = await Verification.findById(req.params.id);
    if (!verification) {
      return res.status(404).json({ error: "Verification not found" });
    }

    // Find choice level
    const choiceLevel = verification.levelData.find((level) => level.level === "choice");
    if (!choiceLevel) {
      return res.status(400).json({ error: "No choice level found on this verification" });
    }

    if (choiceLevel.status !== "failed") {
      return res.status(409).json({ error: `Choice level is not failed (status: ${choiceLevel.status})` });
    }

    // Get skill to regenerate questions
    const skill = await Skill.findById(verification.skillId);
    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }

    // Reset choice level with fresh questions
    const mockQuestions = generateMockQuestions(skill.title);
    choiceLevel.status = "pending";
    choiceLevel.choice = { questions: mockQuestions };

    // Remove any levels beyond choice (user starts over)
    verification.levelData = verification.levelData.filter((level) => level.level === "choice");

    await verification.save();
    res.status(200).json(verification);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to retry choice";
    res.status(500).json({ error: message });
  }
};
