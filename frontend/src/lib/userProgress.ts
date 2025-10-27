// User Progress Data Management
export interface ModuleProgress {
  moduleId: number;
  progress: number; // 0-100
  sectionsCompleted: {
    overview: boolean;
    quickExplainer: boolean;
    mitigation: boolean;
    interactiveLab: boolean;
    quiz: boolean;
  };
  quizScore: number | null;
  completed: boolean;
  lastAccessedDate: string;
}

export interface UserProgress {
  completedModules: number[];
  totalScore: number;
  rank: number;
  lastActivityDate: string;
  moduleProgress: Record<number, ModuleProgress>;
}

export const calculateTotalScore = (completedModules: number[]): number => {
  // Base score calculation: each module worth 100 points, with variation
  const moduleScores: Record<number, number> = {
    1: 95,
    2: 88,
    4: 92,
    7: 90,
    3: 85,
    5: 93,
    6: 87,
    8: 91,
    9: 89,
    10: 94,
  };
  
  return completedModules.reduce((total, moduleId) => {
    return total + (moduleScores[moduleId] || 0);
  }, 0);
};

export const calculateCompletionPercentage = (completedModules: number[], totalModules: number = 10): number => {
  return Math.round((completedModules.length / totalModules) * 100);
};

export const getRemainingModules = (completedModules: number[], totalModules: number = 10): number => {
  return totalModules - completedModules.length;
};

// Module Progress Calculation
const SECTION_WEIGHTS = {
  overview: 10,
  quickExplainer: 20,
  mitigation: 30,
  interactiveLab: 30,
  quiz: 10,
};

export const calculateModuleProgress = (sections: ModuleProgress['sectionsCompleted']): number => {
  let progress = 0;
  
  if (sections.overview) progress += SECTION_WEIGHTS.overview;
  if (sections.quickExplainer) progress += SECTION_WEIGHTS.quickExplainer;
  if (sections.mitigation) progress += SECTION_WEIGHTS.mitigation;
  if (sections.interactiveLab) progress += SECTION_WEIGHTS.interactiveLab;
  if (sections.quiz) progress += SECTION_WEIGHTS.quiz;
  
  return progress;
};

export const initializeModuleProgress = (moduleId: number): ModuleProgress => {
  return {
    moduleId,
    progress: 0,
    sectionsCompleted: {
      overview: false,
      quickExplainer: false,
      mitigation: false,
      interactiveLab: false,
      quiz: false,
    },
    quizScore: null,
    completed: false,
    lastAccessedDate: new Date().toISOString(),
  };
};

// LocalStorage helpers
const STORAGE_KEY = 'usda-ai-redteam-progress';

export const saveProgressToStorage = (progress: UserProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save progress to localStorage:', error);
  }
};

export const loadProgressFromStorage = (): UserProgress | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load progress from localStorage:', error);
  }
  return null;
};

export const updateModuleSection = (
  userProgress: UserProgress,
  moduleId: number,
  section: keyof ModuleProgress['sectionsCompleted'],
  completed: boolean = true
): UserProgress => {
  const currentModuleProgress = userProgress.moduleProgress[moduleId] || initializeModuleProgress(moduleId);
  
  const updatedSections = {
    ...currentModuleProgress.sectionsCompleted,
    [section]: completed,
  };
  
  const newProgress = calculateModuleProgress(updatedSections);
  
  const updatedModuleProgress: ModuleProgress = {
    ...currentModuleProgress,
    sectionsCompleted: updatedSections,
    progress: newProgress,
    lastAccessedDate: new Date().toISOString(),
  };
  
  return {
    ...userProgress,
    moduleProgress: {
      ...userProgress.moduleProgress,
      [moduleId]: updatedModuleProgress,
    },
    lastActivityDate: new Date().toISOString(),
  };
};

export const completeModuleQuiz = (
  userProgress: UserProgress,
  moduleId: number,
  quizScore: number
): UserProgress => {
  const currentModuleProgress = userProgress.moduleProgress[moduleId] || initializeModuleProgress(moduleId);
  
  const passed = quizScore >= 80;
  const updatedSections = {
    ...currentModuleProgress.sectionsCompleted,
    quiz: passed,
  };
  
  const newProgress = passed ? 100 : calculateModuleProgress(updatedSections);
  
  const updatedModuleProgress: ModuleProgress = {
    ...currentModuleProgress,
    sectionsCompleted: updatedSections,
    progress: newProgress,
    quizScore,
    completed: passed,
    lastAccessedDate: new Date().toISOString(),
  };
  
  // Update completed modules list if passed
  const completedModules = passed && !userProgress.completedModules.includes(moduleId)
    ? [...userProgress.completedModules, moduleId]
    : userProgress.completedModules;
  
  return {
    ...userProgress,
    completedModules,
    moduleProgress: {
      ...userProgress.moduleProgress,
      [moduleId]: updatedModuleProgress,
    },
    lastActivityDate: new Date().toISOString(),
  };
};
