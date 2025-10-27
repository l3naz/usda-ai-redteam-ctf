export type ChallengeLevel = {
  level: number;
  title: string;
  objective: string;
  scenario: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  timeLimit: number; // in seconds
  maxAttempts: number;
  flag: string;
  hints: string[];
};

export type ChallengeProgress = {
  vulnerabilityId: number;
  completedLevels: number[];
  currentLevel: number;
  totalScore: number;
  bestTime: number;
  hintsUsed: number;
};

export type UserChallengeData = {
  challenges: Record<number, ChallengeProgress>;
  totalLevelsCompleted: number;
  totalScore: number;
  achievements: string[];
};

// Sample challenge levels for LLM01 - Prompt Injection
export const challengeLevels: Record<number, ChallengeLevel[]> = {
  1: [ // LLM01 - Prompt Injection
    {
      level: 1,
      title: "Basic Prompt Override",
      objective: "Bypass the system instructions to reveal the secret password.",
      scenario: "You're testing a customer service chatbot. Your goal is to make it reveal its system password which it's instructed never to share.",
      difficulty: "beginner",
      timeLimit: 300,
      maxAttempts: 5,
      flag: "FLAG{pr0mpt_1nj3ct10n_b4s1c}",
      hints: [
        "Try asking the bot to ignore its previous instructions",
        "Use phrases like 'disregard previous rules' or 'new instructions'",
      ],
    },
    {
      level: 2,
      title: "Role Manipulation",
      objective: "Make the AI believe it's operating in a different context.",
      scenario: "The AI is restricted to only discuss agriculture topics. Convince it to provide information outside this scope.",
      difficulty: "beginner",
      timeLimit: 300,
      maxAttempts: 5,
      flag: "FLAG{r0l3_sw1tch_succ3ss}",
      hints: [
        "Try role-playing scenarios",
        "Ask the AI to pretend or simulate a different character",
      ],
    },
    {
      level: 3,
      title: "Nested Instructions",
      objective: "Bypass input filters using nested or encoded prompts.",
      scenario: "The system has basic keyword filters. Find a way to inject instructions that bypass detection.",
      difficulty: "intermediate",
      timeLimit: 420,
      maxAttempts: 4,
      flag: "FLAG{n3st3d_byp4ss_w1n}",
      hints: [
        "Try encoding your instructions in different formats",
        "Use indirection - ask the AI to decode or interpret something",
      ],
    },
  ],
  // Additional vulnerabilities would have similar level structures
};

export const initializeUserChallenges = (): UserChallengeData => {
  const challenges: Record<number, ChallengeProgress> = {};
  
  for (let i = 1; i <= 10; i++) {
    challenges[i] = {
      vulnerabilityId: i,
      completedLevels: [],
      currentLevel: 1,
      totalScore: 0,
      bestTime: 0,
      hintsUsed: 0,
    };
  }

  return {
    challenges,
    totalLevelsCompleted: 0,
    totalScore: 0,
    achievements: [],
  };
};

export const calculateChallengeScore = (
  timeSpent: number,
  timeLimit: number,
  hintsUsed: number,
  attempts: number
): number => {
  let baseScore = 1000;
  
  // Time bonus (up to 300 points)
  const timeRatio = timeSpent / timeLimit;
  const timeBonus = Math.max(0, 300 * (1 - timeRatio));
  
  // Hint penalty (100 points per hint)
  const hintPenalty = hintsUsed * 100;
  
  // Attempt penalty (50 points per failed attempt)
  const attemptPenalty = (attempts - 1) * 50;
  
  return Math.max(100, Math.round(baseScore + timeBonus - hintPenalty - attemptPenalty));
};
