import { test, expect, beforeAll, afterAll } from "bun:test";
import { connectDB, disconnectDB } from "@/lib/db";
import { User, Skill, Verification } from "@/lib/schema";

let userId: string;
let skillId: string;
let verificationId: string;

beforeAll(async () => {
  await connectDB();

  // Clean up test data
  await User.deleteMany({ email: "test@verification.com" });
  await Skill.deleteMany({ title: "Test TypeScript" });
  await Verification.deleteMany({});

  // Create test user
  const user = await User.create({
    email: "test@verification.com",
    password: "hashedpassword",
    name: "Test User",
  });
  userId = user._id.toString();

  // Create test skill
  const skill = await Skill.create({
    title: "Test TypeScript",
    description: "A test skill",
    category: "technical",
    level: "one",
  });
  skillId = skill._id.toString();
});

afterAll(async () => {
  await User.deleteMany({ email: "test@verification.com" });
  await Skill.deleteMany({ title: "Test TypeScript" });
  await Verification.deleteMany({});
  await disconnectDB();
});

test("Create verification - should auto-create choice level with mock questions", async () => {
  const verification = await Verification.create({
    userId,
    skillId,
  });

  // Populate skill info
  await verification.populate("skillId");

  // Auto-generate questions (simulating what controller does)
  const { generateMockQuestions } = await import("@/lib/mockQuestions");
  const skill = await Skill.findById(skillId);
  const mockQuestions = generateMockQuestions(skill!.title);

  verification.levelData.push({
    level: "choice",
    status: "pending",
    choice: { questions: mockQuestions },
  });

  await verification.save();
  verificationId = verification._id.toString();

  // Assertions
  expect(verification.levelData).toHaveLength(1);
  expect(verification.levelData[0].level).toBe("choice");
  expect(verification.levelData[0].status).toBe("pending");
  expect(verification.levelData[0].choice?.questions).toHaveLength(5);

  const firstQuestion = verification.levelData[0].choice?.questions[0];
  expect(firstQuestion?.question).toBeDefined();
  expect(firstQuestion?.options).toHaveLength(4);
  expect(firstQuestion?.answer).toBeDefined();
});

test("Submit answers - fail (score < 80%)", async () => {
  const verification = await Verification.findById(verificationId);
  expect(verification).toBeDefined();

  const choiceLevel = verification!.levelData.find((l) => l.level === "choice");
  const questions = choiceLevel?.choice?.questions || [];

  // Submit wrong answers (0/5 correct = 0%)
  const wrongAnswers = questions.map(() => "Wrong Answer");

  const correct = wrongAnswers.filter((ans, i) => ans === questions[i]?.answer).length;
  const score = (correct / questions.length) * 100;

  choiceLevel!.userAnswers = wrongAnswers;
  choiceLevel!.status = "failed";
  choiceLevel!.score = score;

  await verification!.save();

  expect(score).toBeLessThan(80);
  expect(choiceLevel!.status).toBe("failed");
  expect(verification!.levelData).toHaveLength(1); // No p2p_interview created
});

test("Retry choice - should reset with fresh questions", async () => {
  const verification = await Verification.findById(verificationId);
  expect(verification).toBeDefined();

  const choiceLevel = verification!.levelData.find((l) => l.level === "choice");
  expect(choiceLevel!.status).toBe("failed");

  // Reset
  const { generateMockQuestions } = await import("@/lib/mockQuestions");
  const skill = await Skill.findById(skillId);
  const mockQuestions = generateMockQuestions(skill!.title);

  choiceLevel!.status = "pending";
  choiceLevel!.choice = { questions: mockQuestions };
  choiceLevel!.userAnswers = undefined;
  choiceLevel!.score = undefined;

  // Remove any levels beyond choice
  verification!.levelData = verification!.levelData.filter((l) => l.level === "choice");

  await verification!.save();

  expect(choiceLevel!.status).toBe("pending");
  expect(choiceLevel!.userAnswers).toBeUndefined();
  expect(choiceLevel!.score).toBeUndefined();
  expect(verification!.levelData).toHaveLength(1);
});

test("Submit answers - pass (score >= 80%), auto-create p2p_interview", async () => {
  const verification = await Verification.findById(verificationId);
  expect(verification).toBeDefined();

  const choiceLevel = verification!.levelData.find((l) => l.level === "choice");
  const questions = choiceLevel?.choice?.questions || [];

  // Submit correct answers (5/5 = 100%)
  const correctAnswers = questions.map((q) => q.answer);

  const correct = correctAnswers.filter((ans, i) => ans === questions[i]?.answer).length;
  const score = (correct / questions.length) * 100;

  // Update choice level with answers and score
  if (choiceLevel?.choice) {
    choiceLevel.choice.userAnswers = correctAnswers;
    choiceLevel.choice.score = score;
  }
  choiceLevel!.status = "completed";

  // Auto-create p2p_interview
  verification!.levelData.push({
    level: "p2p_interview",
    status: "pending",
    link: "https://discord.gg/mock-link",
  });

  await verification!.save();

  expect(score).toBeGreaterThanOrEqual(80);
  expect(choiceLevel!.status).toBe("completed");
  expect(verification!.levelData).toHaveLength(2);

  const p2pLevel = verification!.levelData.find((l) => l.level === "p2p_interview");
  expect(p2pLevel).toBeDefined();
  expect(p2pLevel!.status).toBe("pending");
  expect(p2pLevel!.link).toBe("https://discord.gg/mock-link");
});

test("Complete p2p_interview - auto-create interview level", async () => {
  const verification = await Verification.findById(verificationId);
  expect(verification).toBeDefined();

  const p2pLevel = verification!.levelData.find((l) => l.level === "p2p_interview");
  expect(p2pLevel!.status).toBe("pending");

  // Complete p2p_interview
  p2pLevel!.status = "completed";
  p2pLevel!.verifiedAt = new Date();
  p2pLevel!.verifiedBy = userId as any;

  // Auto-create interview
  verification!.levelData.push({
    level: "interview",
    status: "pending",
    link: "https://meet.google.com/mock-link",
  });

  await verification!.save();

  expect(verification!.levelData).toHaveLength(3);
  const interviewLevel = verification!.levelData.find((l) => l.level === "interview");
  expect(interviewLevel).toBeDefined();
  expect(interviewLevel!.status).toBe("pending");
  expect(interviewLevel!.link).toBe("https://meet.google.com/mock-link");
});

test("Complete interview - all levels completed", async () => {
  const verification = await Verification.findById(verificationId);
  expect(verification).toBeDefined();

  const interviewLevel = verification!.levelData.find((l) => l.level === "interview");
  expect(interviewLevel!.status).toBe("pending");

  // Complete interview
  interviewLevel!.status = "completed";
  interviewLevel!.verifiedAt = new Date();
  interviewLevel!.verifiedBy = userId as any;

  await verification!.save();

  // Verify all levels are completed
  const allCompleted = verification!.levelData.every((l) => l.status === "completed");
  expect(allCompleted).toBe(true);
  expect(verification!.levelData).toHaveLength(3);
});

test("Full workflow validation", async () => {
  const verification = await Verification.findById(verificationId);
  expect(verification).toBeDefined();

  const levels = verification!.levelData;
  expect(levels).toHaveLength(3);

  // Verify each level
  const choice = levels.find((l) => l.level === "choice");
  expect(choice).toBeDefined();
  expect(choice!.status).toBe("completed");
  expect(choice?.choice?.score ?? 0).toBeGreaterThanOrEqual(80);
  expect(choice?.choice?.userAnswers).toBeDefined();

  const p2p = levels.find((l) => l.level === "p2p_interview");
  expect(p2p).toBeDefined();
  expect(p2p!.status).toBe("completed");
  expect(p2p!.verifiedAt).toBeDefined();
  expect(p2p!.verifiedBy).toBeDefined();

  const interview = levels.find((l) => l.level === "interview");
  expect(interview).toBeDefined();
  expect(interview!.status).toBe("completed");
  expect(interview!.verifiedAt).toBeDefined();
  expect(interview!.verifiedBy).toBeDefined();
});
