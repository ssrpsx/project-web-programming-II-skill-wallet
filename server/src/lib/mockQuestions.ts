export interface ChoiceQuestion {
  question: string;
  options: string[];
  answer: string;
}

export function generateMockQuestions(skillTitle: string): ChoiceQuestion[] {
  // Mock questions based on skill title - can be replaced with LLM call later
  const skillLower = skillTitle.toLowerCase();

  // Generic questions that work for most skills
  const questions: ChoiceQuestion[] = [
    {
      question: `What is ${skillTitle}?`,
      options: [
        "A programming tool",
        "A conceptual framework",
        "A testing methodology",
        "A deployment platform",
      ],
      answer: "A conceptual framework",
    },
    {
      question: `What are the main benefits of using ${skillTitle}?`,
      options: [
        "Increased complexity",
        "Better maintainability and scalability",
        "Reduced performance",
        "Elimination of all bugs",
      ],
      answer: "Better maintainability and scalability",
    },
    {
      question: `In what scenario is ${skillTitle} most commonly used?`,
      options: [
        "For simple scripts only",
        "For large-scale applications and teams",
        "For hardware programming exclusively",
        "For entertainment purposes only",
      ],
      answer: "For large-scale applications and teams",
    },
    {
      question: `What skill level is typically required to master ${skillTitle}?`,
      options: [
        "Beginner only",
        "Intermediate to advanced",
        "Only for experts with 20+ years",
        "No skill level required",
      ],
      answer: "Intermediate to advanced",
    },
    {
      question: `How frequently is ${skillTitle} updated or evolved?`,
      options: [
        "Never, it's completely static",
        "Regularly to adapt to industry needs",
        "Only when someone complains",
        "Every single day",
      ],
      answer: "Regularly to adapt to industry needs",
    },
  ];

  return questions;
}
