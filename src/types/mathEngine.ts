/**
 * Type definitions for the Deterministic Preschool Math Engine
 * Covers all 10 progressive levels from First Addition to Word Problems
 */

export type QuestionType =
  | 'first_addition'
  | 'counting_addition'
  | 'basic_subtraction'
  | 'mixed_operations'
  | 'missing_number'
  | 'addition_subtraction_20'
  | 'pattern_sequence'
  | 'multi_step'
  | 'grouping_multiplication'
  | 'word_problem';

export interface VisualIllustration {
  type: 'token_count' | 'formula' | 'pattern' | 'grouping' | 'story';
  items?: Array<{
    emoji: string;
    label?: string;
    count?: number;
  }>;
  groups?: Array<{
    label: string;
    count: number;
    itemEmoji: string;
  }>;
  patternElements?: string[];
  formulaDisplay?: string;
  storyScene?: {
    character: 'andy' | 'sancho' | 'osi' | 'team';
    setting: string;
    heroItem: string;
  };
}

export interface MathQuestion {
  id: string;
  levelNumber: number; // 1 to 10
  questionType: QuestionType;
  text: string;
  correctAnswer: string | number;
  options: [string | number, string | number, string | number];
  illustration?: VisualIllustration;
  hint: string;
  narration: string;
  speaker?: 'andy' | 'sancho' | 'osi' | 'narrator';
  explanation?: string;
}

export interface LevelQuestionBank {
  levelNumber: number;
  levelTitle: string;
  topic: string;
  description: string;
  questions: MathQuestion[];
}

export interface QuestionBankValidationResult {
  isValid: boolean;
  totalQuestions: number;
  levelCounts: Record<number, number>;
  errors: string[];
}
