import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MultipleChoiceQuestion, MockExamResult } from "@/types";
import { fisherYatesShuffle } from "@/utils/shuffle";

const SMALL_SUBJECTS = new Set(["s4", "s6"]);

function getExamConfig(subjectId: string) {
  const isSmall = SMALL_SUBJECTS.has(subjectId);
  return {
    questionsPerExam: isSmall ? 20 : 40,
    durationSeconds: isSmall ? 25 * 60 : 50 * 60,
  };
}
const MAX_HISTORY = 50;

interface MockExamState {
  // Session state (not persisted)
  questions: MultipleChoiceQuestion[];
  answers: Record<string, number>; // questionId → selectedIndex
  currentIndex: number;
  remainingSeconds: number;
  isStarted: boolean;
  isFinished: boolean;
  examId: string;
  subjectId: string;
  subjectName: string;

  // Persisted
  examHistory: MockExamResult[];

  // Actions
  startExam: (
    examId: string,
    subjectId: string,
    subjectName: string,
    allQuestions: MultipleChoiceQuestion[]
  ) => void;
  selectAnswer: (questionId: string, selectedIndex: number) => void;
  goToQuestion: (index: number) => void;
  tick: () => void;
  finishExam: () => MockExamResult;
  resetSession: () => void;
}

export const useMockExamStore = create<MockExamState>()(
  persist(
    (set, get) => ({
      questions: [],
      answers: {},
      currentIndex: 0,
      remainingSeconds: 50 * 60,
      isStarted: false,
      isFinished: false,
      examId: "",
      subjectId: "",
      subjectName: "",
      examHistory: [],

      startExam: (examId, subjectId, subjectName, allQuestions) => {
        const config = getExamConfig(subjectId);
        const mcQuestions = allQuestions.filter((q) => q.type === "multiple_choice");
        const shuffled = fisherYatesShuffle(mcQuestions, `${examId}-${subjectId}-${Date.now()}`);
        const selected = shuffled.slice(0, config.questionsPerExam);

        set({
          questions: selected,
          answers: {},
          currentIndex: 0,
          remainingSeconds: config.durationSeconds,
          isStarted: true,
          isFinished: false,
          examId,
          subjectId,
          subjectName,
        });
      },

      selectAnswer: (questionId, selectedIndex) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: selectedIndex },
        })),

      goToQuestion: (index) => set({ currentIndex: index }),

      tick: () =>
        set((state) => {
          if (state.remainingSeconds <= 0) return state;
          return { remainingSeconds: state.remainingSeconds - 1 };
        }),

      finishExam: () => {
        const state = get();
        const config = getExamConfig(state.subjectId);
        const correctCount = state.questions.filter(
          (q) => state.answers[q.id] === q.correctIndex
        ).length;

        const result: MockExamResult = {
          id: `mock-${Date.now()}`,
          examId: state.examId,
          subjectId: state.subjectId,
          subjectName: state.subjectName,
          totalQuestions: state.questions.length,
          correctCount,
          timeSpentSeconds: config.durationSeconds - state.remainingSeconds,
          timestamp: Date.now(),
          answers: { ...state.answers },
          questionIds: state.questions.map((q) => q.id),
        };

        set((s) => ({
          isFinished: true,
          isStarted: false,
          examHistory: [result, ...s.examHistory].slice(0, MAX_HISTORY),
        }));

        return result;
      },

      resetSession: () =>
        set({
          questions: [],
          answers: {},
          currentIndex: 0,
          remainingSeconds: 50 * 60,
          isStarted: false,
          isFinished: false,
          examId: "",
          subjectId: "",
          subjectName: "",
        }),
    }),
    {
      name: "certipass-mock-exam",
      partialize: (state) => ({ examHistory: state.examHistory }),
    }
  )
);
