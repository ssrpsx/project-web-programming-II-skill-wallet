import { test, expect, beforeAll, afterAll } from "bun:test";
import { connectDB, disconnectDB } from "@/lib/db";
import { User, Skill } from "@/lib/schema";

const API_URL = "http://localhost:8080/api";

let userId: string;
let skillId: string;
let verificationId: string;
let token: string;

beforeAll(async () => {
  await connectDB();

  // Clean up test data
  await User.deleteMany({ email: "apitest@verification.com" });
  await Skill.deleteMany({ title: "API Test TypeScript" });
});

afterAll(async () => {
  await User.deleteMany({ email: "apitest@verification.com" });
  await Skill.deleteMany({ title: "API Test TypeScript" });
  await disconnectDB();
});

test("1. Sign up user", async () => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "apitest@verification.com",
      password: "testpass123",
      name: "API Test User",
    }),
  });

  expect(response.status).toBe(201);
  const data = await response.json();
  expect(data.token).toBeDefined();
  expect(data.user._id).toBeDefined();
  expect(data.user.email).toBe("apitest@verification.com");

  token = data.token;
  userId = data.user._id;
});

test("2. Create a skill", async () => {
  const response = await fetch(`${API_URL}/skills`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "API Test TypeScript",
      description: "A test skill via API",
      category: "technical",
      level: "one",
    }),
  });

  expect(response.status).toBe(201);
  const data = await response.json();
  expect(data._id).toBeDefined();
  expect(data.title).toBe("API Test TypeScript");

  skillId = data._id;
});

test("3. Create verification (auto-creates choice level)", async () => {
  const response = await fetch(`${API_URL}/verifications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      skillId,
    }),
  });

  expect(response.status).toBe(201);
  const data = await response.json();
  expect(data._id).toBeDefined();
  expect(data.levelData).toHaveLength(1);
  expect(data.levelData[0].level).toBe("choice");
  expect(data.levelData[0].status).toBe("pending");
  expect(data.levelData[0].choice?.questions).toHaveLength(5);

  const firstQuestion = data.levelData[0].choice?.questions[0];
  expect(firstQuestion?.question).toBeDefined();
  expect(firstQuestion?.options).toHaveLength(4);
  expect(firstQuestion?.answer).toBeDefined();

  verificationId = data._id;
});

test("4. Get verification by ID", async () => {
  const response = await fetch(`${API_URL}/verifications/${verificationId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  expect(response.status).toBe(200);
  const data = await response.json();
  expect(data._id).toBe(verificationId);
  expect(data.levelData).toHaveLength(1);
  expect(data.levelData[0].level).toBe("choice");
});

test("5. Submit answers - FAIL (score < 80%)", async () => {
  // Get the verification to see what questions are there
  const getResponse = await fetch(`${API_URL}/verifications/${verificationId}`, {
    method: "GET",
  });
  const verification = await getResponse.json();
  const questions = verification.levelData[0].choice?.questions || [];

  // Submit wrong answers (0/5 = 0%)
  const wrongAnswers = questions.map(() => "Wrong Answer");

  const response = await fetch(`${API_URL}/verifications/${verificationId}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers: wrongAnswers }),
  });

  expect(response.status).toBe(200);
  const data = await response.json();
  expect(data.passed).toBe(false);
  expect(data.score).toBe(0);
  expect(data.message).toContain("Score too low");
  expect(data.verification.levelData).toHaveLength(1);
  expect(data.verification.levelData[0].status).toBe("failed");
});

test("6. Retry choice - reset with fresh questions", async () => {
  const response = await fetch(`${API_URL}/verifications/${verificationId}/retry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  expect(response.status).toBe(200);
  const data = await response.json();
  expect(data.levelData).toHaveLength(1);
  expect(data.levelData[0].level).toBe("choice");
  expect(data.levelData[0].status).toBe("pending");
  expect(data.levelData[0].choice?.questions).toHaveLength(5);
  expect(data.levelData[0].choice?.userAnswers).toBeUndefined();
  expect(data.levelData[0].choice?.score).toBeUndefined();
});

test("7. Submit answers - PASS (score >= 80%, auto-create p2p_interview)", async () => {
  // Get current verification to see correct answers
  const getResponse = await fetch(`${API_URL}/verifications/${verificationId}`, {
    method: "GET",
  });
  const verification = await getResponse.json();
  const questions = verification.levelData[0].choice?.questions || [];

  // Submit correct answers (5/5 = 100%)
  const correctAnswers = questions.map((q: any) => q.answer);

  const response = await fetch(`${API_URL}/verifications/${verificationId}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers: correctAnswers }),
  });

  expect(response.status).toBe(200);
  const data = await response.json();
  expect(data.passed).toBe(true);
  expect(data.score).toBe(100);
  expect(data.message).toContain("Level 1 passed");
  expect(data.verification.levelData).toHaveLength(2);

  const choiceLevel = data.verification.levelData.find((l: any) => l.level === "choice");
  expect(choiceLevel.status).toBe("completed");
  expect(choiceLevel.choice?.score).toBe(100);
  expect(choiceLevel.choice?.userAnswers).toHaveLength(5);

  const p2pLevel = data.verification.levelData.find((l: any) => l.level === "p2p_interview");
  expect(p2pLevel).toBeDefined();
  expect(p2pLevel.status).toBe("pending");
  expect(p2pLevel.link).toBe("https://discord.gg/mock-link");
});

test("8. Complete p2p_interview (auto-create interview)", async () => {
  const response = await fetch(
    `${API_URL}/verifications/${verificationId}/levels/p2p_interview/complete`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verifiedBy: userId }),
    }
  );

  expect(response.status).toBe(200);
  const data = await response.json();
  expect(data.levelData).toHaveLength(3);

  const p2pLevel = data.levelData.find((l: any) => l.level === "p2p_interview");
  expect(p2pLevel.status).toBe("completed");
  expect(p2pLevel.verifiedAt).toBeDefined();
  expect(p2pLevel.verifiedBy).toBeDefined();

  const interviewLevel = data.levelData.find((l: any) => l.level === "interview");
  expect(interviewLevel).toBeDefined();
  expect(interviewLevel.status).toBe("pending");
  expect(interviewLevel.link).toBe("https://meet.google.com/mock-link");
});

test("9. Complete interview (verification fully complete)", async () => {
  const response = await fetch(
    `${API_URL}/verifications/${verificationId}/levels/interview/complete`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verifiedBy: userId }),
    }
  );

  expect(response.status).toBe(200);
  const data = await response.json();
  expect(data.levelData).toHaveLength(3);

  const allCompleted = data.levelData.every((l: any) => l.status === "completed");
  expect(allCompleted).toBe(true);

  const interviewLevel = data.levelData.find((l: any) => l.level === "interview");
  expect(interviewLevel.status).toBe("completed");
  expect(interviewLevel.verifiedAt).toBeDefined();
  expect(interviewLevel.verifiedBy).toBeDefined();
});

test("10. Get all verifications", async () => {
  const response = await fetch(`${API_URL}/verifications`, {
    method: "GET",
  });

  expect(response.status).toBe(200);
  const data = await response.json();
  expect(Array.isArray(data)).toBe(true);
  expect(data.length).toBeGreaterThan(0);

  const testVerification = data.find((v: any) => v._id === verificationId);
  expect(testVerification).toBeDefined();
  expect(testVerification.levelData).toHaveLength(3);
});

test("11. Error handling - invalid verification ID", async () => {
  const response = await fetch(`${API_URL}/verifications/invalid123`, {
    method: "GET",
  });

  // Invalid ObjectId format returns 500 (MongoDB cast error)
  expect(response.status).toBe(500);
  const data = await response.json();
  expect(data.error).toBeDefined();
});

test("12. Error handling - invalid level param", async () => {
  const response = await fetch(
    `${API_URL}/verifications/${verificationId}/levels/invalid_level/complete`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verifiedBy: userId }),
    }
  );

  expect(response.status).toBe(400);
  const data = await response.json();
  expect(data.error).toContain("Invalid verification level");
});

test("13. Error handling - cannot complete choice via endpoint", async () => {
  // Try to complete choice (which should only be done via /submit)
  // This will fail because choice is already completed in our test workflow
  const response = await fetch(
    `${API_URL}/verifications/${verificationId}/levels/choice/complete`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verifiedBy: userId }),
    }
  );

  expect(response.status).toBe(400);
  const data = await response.json();
  expect(data.error).toContain("Cannot complete choice level via this endpoint");
});

test("14. Error handling - wrong answer count", async () => {
  // Create fresh verification to test wrong answer count
  const createResp = await fetch(`${API_URL}/verifications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, skillId }),
  });
  const freshVerification = await createResp.json();

  // Try submitting wrong number of answers (1 instead of 5)
  const response = await fetch(
    `${API_URL}/verifications/${freshVerification._id}/submit`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: ["only one answer"] }),
    }
  );

  expect(response.status).toBe(400);
  const data = await response.json();
  expect(data.error).toContain("Expected 5 answers");
});

test("15. Full workflow complete - verify final state", async () => {
  const response = await fetch(`${API_URL}/verifications/${verificationId}`, {
    method: "GET",
  });

  expect(response.status).toBe(200);
  const verification = await response.json();

  // Check all 3 levels exist and are completed
  expect(verification.levelData).toHaveLength(3);

  const choice = verification.levelData.find((l: any) => l.level === "choice");
  expect(choice.status).toBe("completed");
  expect(choice.choice?.score).toBe(100);
  expect(choice.choice?.userAnswers).toHaveLength(5);

  const p2p = verification.levelData.find((l: any) => l.level === "p2p_interview");
  expect(p2p.status).toBe("completed");
  expect(p2p.verifiedBy).toBeDefined();
  expect(p2p.verifiedAt).toBeDefined();

  const interview = verification.levelData.find((l: any) => l.level === "interview");
  expect(interview.status).toBe("completed");
  expect(interview.verifiedBy).toBeDefined();
  expect(interview.verifiedAt).toBeDefined();

  // Verify skill and user are populated
  expect(verification.userId).toBeDefined();
  expect(verification.skillId).toBeDefined();
});
