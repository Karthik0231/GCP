import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BranchId, DifficultyLevel, LabProgress, TopicProgress } from '../types';

const localDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

interface LearningState {
  completedTopics: string[];
  inProgressTopics: string[];
  bookmarks: string[];
  activeTopicId: string | null;
  activeView: 'roadmap' | 'topics' | 'labs' | 'projects' | 'commands' | 'architecture' | 'interview';
  selectedBranch: BranchId;
  selectedDifficulty: DifficultyLevel | 'all';
  searchQuery: string;
  isSearchOpen: boolean;
  roadmapZoom: number;
  roadmapPan: { x: number; y: number };
  theme: 'dark' | 'light';
  streak: number;
  lastActiveDate: string;
  labProgress: Record<string, LabProgress>;
  topicProgress: Record<string, TopicProgress>;

  // Actions
  toggleTopicCompletion: (topicId: string) => void;
  setTopicInProgress: (topicId: string) => void;
  toggleBookmark: (topicId: string) => void;
  setActiveTopicId: (topicId: string | null) => void;
  setActiveView: (view: 'roadmap' | 'topics' | 'labs' | 'projects' | 'commands' | 'architecture' | 'interview') => void;
  setSelectedBranch: (branch: BranchId) => void;
  setSelectedDifficulty: (difficulty: DifficultyLevel | 'all') => void;
  setSearchQuery: (query: string) => void;
  setIsSearchOpen: (open: boolean) => void;
  setRoadmapZoom: (zoom: number) => void;
  setRoadmapPan: (pan: { x: number; y: number }) => void;
  toggleTheme: () => void;
  recordActivity: () => void;
  resetProgress: () => void;
  setLabProgress: (labId: string, progress: Partial<Omit<LabProgress, 'updatedAt'>>) => void;
  resetLabProgress: (labId: string) => void;
  setTopicProgress: (topicId: string, progress: Partial<Omit<TopicProgress, 'updatedAt'>>) => void;
  resetTopicProgress: (topicId: string) => void;
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set, get) => ({
      completedTopics: [
        'cloud-foundations', // Default friendly start
      ],
      inProgressTopics: [
        'gcp-fundamentals',
      ],
      bookmarks: [],
      activeTopicId: null,
      activeView: 'roadmap',
      selectedBranch: 'all',
      selectedDifficulty: 'all',
      searchQuery: '',
      isSearchOpen: false,
      roadmapZoom: 1,
      roadmapPan: { x: 0, y: 0 },
      theme: 'dark',
      streak: 0,
      lastActiveDate: localDateKey(),
      labProgress: {},
      topicProgress: {},

      toggleTopicCompletion: (topicId: string) => {
        const { completedTopics, inProgressTopics } = get();
        const isCompleted = completedTopics.includes(topicId);
        if (isCompleted) {
          set({
            completedTopics: completedTopics.filter(id => id !== topicId)
          });
        } else {
          set({
            completedTopics: [...completedTopics, topicId],
            inProgressTopics: inProgressTopics.filter(id => id !== topicId)
          });
          get().recordActivity();
        }
      },

      setTopicInProgress: (topicId: string) => {
        const { completedTopics, inProgressTopics } = get();
        if (!completedTopics.includes(topicId) && !inProgressTopics.includes(topicId)) {
          set({ inProgressTopics: [...inProgressTopics, topicId] });
        }
      },

      toggleBookmark: (topicId: string) => {
        const { bookmarks } = get();
        if (bookmarks.includes(topicId)) {
          set({ bookmarks: bookmarks.filter(id => id !== topicId) });
        } else {
          set({ bookmarks: [...bookmarks, topicId] });
        }
      },

      setActiveTopicId: (topicId: string | null) => {
        set({ activeTopicId: topicId });
        if (topicId) {
          get().setTopicInProgress(topicId);
        }
      },

      setActiveView: (view) => set({ activeView: view }),
      setSelectedBranch: (branch) => set({ selectedBranch: branch }),
      setSelectedDifficulty: (difficulty) => set({ selectedDifficulty: difficulty }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setIsSearchOpen: (open) => set({ isSearchOpen: open }),
      setRoadmapZoom: (zoom) => set({ roadmapZoom: Math.max(0.6, Math.min(1.6, zoom)) }),
      setRoadmapPan: (pan) => set({ roadmapPan: pan }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

      recordActivity: () => {
        const today = localDateKey();
        const { lastActiveDate, streak } = get();
        if (lastActiveDate === today) {
          if (streak === 0) set({ streak: 1 });
          return;
        }
        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const yesterday = localDateKey(yesterdayDate);
        set({ streak: lastActiveDate === yesterday ? streak + 1 : 1, lastActiveDate: today });
      },

      resetProgress: () => set({
        completedTopics: [],
        inProgressTopics: [],
        labProgress: {},
        topicProgress: {},
        streak: 0,
        lastActiveDate: localDateKey(),
      }),
      setLabProgress: (labId, progress) => set((state) => ({
        labProgress: {
          ...state.labProgress,
          [labId]: {
            activePhase: progress.activePhase ?? state.labProgress[labId]?.activePhase ?? 0,
            completedPhases: progress.completedPhases ?? state.labProgress[labId]?.completedPhases ?? [],
            completedVerificationItems: progress.completedVerificationItems ?? state.labProgress[labId]?.completedVerificationItems ?? [],
            updatedAt: new Date().toISOString(),
          },
        },
      })),
      resetLabProgress: (labId) => set((state) => {
        const next = { ...state.labProgress };
        delete next[labId];
        return { labProgress: next };
      }),
      setTopicProgress: (topicId, progress) => set((state) => ({
        topicProgress: {
          ...state.topicProgress,
          [topicId]: {
            activeSection: progress.activeSection ?? state.topicProgress[topicId]?.activeSection ?? 'console',
            quizAnswers: progress.quizAnswers ?? state.topicProgress[topicId]?.quizAnswers ?? {},
            completedExerciseSteps: progress.completedExerciseSteps ?? state.topicProgress[topicId]?.completedExerciseSteps ?? [],
            updatedAt: new Date().toISOString(),
          },
        },
      })),
      resetTopicProgress: (topicId) => set((state) => {
        const next = { ...state.topicProgress };
        delete next[topicId];
        return { topicProgress: next };
      })
    }),
    {
      name: 'gcp-forge-learning-progress',
      version: 2,
      migrate: (persistedState: unknown) => {
        const state = (persistedState || {}) as Record<string, unknown>;
        const legacyProgress = (state.labProgress || {}) as Record<string, Partial<LabProgress> & { activeStep?: number; completedSteps?: number[] }>;
        const labProgress: Record<string, LabProgress> = {};
        Object.entries(legacyProgress).forEach(([labId, progress]) => {
          labProgress[labId] = {
            activePhase: progress.activePhase ?? progress.activeStep ?? 0,
            completedPhases: progress.completedPhases ?? (progress.completedSteps || []).filter(step => step < 100),
            completedVerificationItems: progress.completedVerificationItems ?? (progress.completedSteps || []).filter(step => step >= 100).map(step => `verification-${step - 100}`),
            updatedAt: progress.updatedAt || new Date().toISOString(),
          };
        });
        const legacyTopicProgress = (state.topicProgress || {}) as Record<string, Partial<TopicProgress>>;
        const topicProgress: Record<string, TopicProgress> = {};
        Object.entries(legacyTopicProgress).forEach(([topicId, progress]) => {
          topicProgress[topicId] = {
            activeSection: progress.activeSection || 'console',
            quizAnswers: progress.quizAnswers || {},
            completedExerciseSteps: Array.isArray(progress.completedExerciseSteps) ? progress.completedExerciseSteps : [],
            updatedAt: progress.updatedAt || new Date().toISOString(),
          };
        });
        return { ...state, labProgress, topicProgress };
      },
      partialize: (state) => ({
        completedTopics: state.completedTopics,
        inProgressTopics: state.inProgressTopics,
        bookmarks: state.bookmarks,
        streak: state.streak,
        lastActiveDate: state.lastActiveDate,
        theme: state.theme,
        labProgress: state.labProgress,
        topicProgress: state.topicProgress,
      }),
    }
  )
);

// Helper for skill calculation
export function calculateProgression(completedCount: number, totalCount: number) {
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (completedCount >= 30 || percent >= 85) {
    return { levelName: 'Production Architect', levelNumber: 6, percent, nextThreshold: 35 };
  }
  if (completedCount >= 22 || percent >= 65) {
    return { levelName: 'Advanced Cloud Engineer', levelNumber: 5, percent, nextThreshold: 30 };
  }
  if (completedCount >= 15 || percent >= 45) {
    return { levelName: 'Cloud Engineer', levelNumber: 4, percent, nextThreshold: 22 };
  }
  if (completedCount >= 8 || percent >= 25) {
    return { levelName: 'Cloud Practitioner', levelNumber: 3, percent, nextThreshold: 15 };
  }
  if (completedCount >= 3 || percent >= 10) {
    return { levelName: 'Cloud Developer', levelNumber: 2, percent, nextThreshold: 8 };
  }
  return { levelName: 'Cloud Beginner', levelNumber: 1, percent, nextThreshold: 3 };
}

