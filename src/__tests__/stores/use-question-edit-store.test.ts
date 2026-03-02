import { describe, it, expect, beforeEach } from "vitest";
import { useQuestionEditStore } from "@/stores/use-question-edit-store";
import type { MultipleChoiceQuestion, FillInTheBlankQuestion } from "@/types";

const mcQuestion: MultipleChoiceQuestion = {
  id: "mc_001",
  type: "multiple_choice",
  year: 2024,
  content: "What is the maximum LTV ratio for residential mortgages?",
  options: ["60%", "70%", "80%", "90%"],
  correctIndex: 2,
  explanation: "The standard maximum LTV ratio is 80%.",
};

const fillQuestion: FillInTheBlankQuestion = {
  id: "fill_001",
  type: "fill_in_the_blank",
  content: "The legal term for ownership transfer is ___.",
  answer: "conveyance",
  explanation: "Conveyance refers to the transfer of property ownership.",
};

describe("useQuestionEditStore", () => {
  beforeEach(() => {
    useQuestionEditStore.setState({ questionEdits: {} });
  });

  it("initially has empty questionEdits", () => {
    const { questionEdits } = useQuestionEditStore.getState();

    expect(questionEdits).toEqual({});
  });

  it("setQuestionEdit stores partial edits", () => {
    useQuestionEditStore.getState().setQuestionEdit("mc_001", {
      content: "Updated content",
    });

    const { questionEdits } = useQuestionEditStore.getState();
    expect(questionEdits["mc_001"]).toEqual({ content: "Updated content" });
  });

  it("getEditedQuestion returns original when no edits exist", () => {
    const result = useQuestionEditStore.getState().getEditedQuestion(mcQuestion);

    expect(result).toBe(mcQuestion);
  });

  it("getEditedQuestion merges edits with original multiple-choice question", () => {
    useQuestionEditStore.getState().setQuestionEdit("mc_001", {
      content: "Edited MC content",
      correctIndex: 3,
    });

    const result = useQuestionEditStore.getState().getEditedQuestion(mcQuestion);

    expect(result).toEqual({
      ...mcQuestion,
      content: "Edited MC content",
      correctIndex: 3,
    });
    expect(result.id).toBe("mc_001");
    expect(result.type).toBe("multiple_choice");
    expect(result.year).toBe(2024);
    expect(result.options).toEqual(mcQuestion.options);
  });

  it("getEditedQuestion merges edits with original fill-in-the-blank question", () => {
    useQuestionEditStore.getState().setQuestionEdit("fill_001", {
      answer: "deed transfer",
      explanation: "Updated explanation.",
    });

    const result = useQuestionEditStore.getState().getEditedQuestion(fillQuestion);

    expect(result).toEqual({
      ...fillQuestion,
      answer: "deed transfer",
      explanation: "Updated explanation.",
    });
    expect(result.id).toBe("fill_001");
    expect(result.type).toBe("fill_in_the_blank");
    expect(result.content).toBe(fillQuestion.content);
  });

  it("removeQuestionEdit removes edits for a question", () => {
    useQuestionEditStore.getState().setQuestionEdit("mc_001", {
      content: "Edited content",
    });
    useQuestionEditStore.getState().removeQuestionEdit("mc_001");

    const { questionEdits } = useQuestionEditStore.getState();
    expect(questionEdits["mc_001"]).toBeUndefined();
    expect(Object.keys(questionEdits)).toHaveLength(0);
  });

  it("resetAll clears all edits", () => {
    useQuestionEditStore.getState().setQuestionEdit("mc_001", {
      content: "Edit 1",
    });
    useQuestionEditStore.getState().setQuestionEdit("fill_001", {
      answer: "Edit 2",
    });

    useQuestionEditStore.getState().resetAll();

    const { questionEdits } = useQuestionEditStore.getState();
    expect(questionEdits).toEqual({});
  });

  it("multiple edits for different questions do not interfere", () => {
    useQuestionEditStore.getState().setQuestionEdit("mc_001", {
      content: "Edited MC",
      correctIndex: 0,
    });
    useQuestionEditStore.getState().setQuestionEdit("fill_001", {
      answer: "new answer",
    });

    const editedMc = useQuestionEditStore.getState().getEditedQuestion(mcQuestion);
    const editedFill = useQuestionEditStore.getState().getEditedQuestion(fillQuestion);

    expect(editedMc.content).toBe("Edited MC");
    expect(editedMc.correctIndex).toBe(0);
    expect(editedMc.year).toBe(2024);

    expect(editedFill.answer).toBe("new answer");
    expect(editedFill.content).toBe(fillQuestion.content);
    expect(editedFill.explanation).toBe(fillQuestion.explanation);

    const { questionEdits } = useQuestionEditStore.getState();
    expect(Object.keys(questionEdits)).toHaveLength(2);
  });
});
