import {
  MathQuestion,
  LevelQuestionBank,
  QuestionBankValidationResult
} from '../types/mathEngine';

/**
 * 10-LEVEL DETERMINISTIC MATH ENGINE QUESTION BANK
 * Exactly 10 levels, exactly 10 deterministic questions per level (100 total questions).
 * Kept completely decoupled from map, gameplay, and animation UI.
 * Zero Generative AI calls during live gameplay.
 */

export const LEVEL_1_QUESTIONS: MathQuestion[] = [
  {
    id: 'lvl1_q01',
    levelNumber: 1,
    questionType: 'first_addition',
    text: 'What is 1 + 1?',
    correctAnswer: 2,
    options: [2, 3, 4],
    illustration: {
      type: 'token_count',
      items: [
        { emoji: '🍎', label: '1 apple', count: 1 },
        { emoji: '🍎', label: '1 more apple', count: 1 }
      ],
      formulaDisplay: '1 + 1 = ?'
    },
    hint: 'Count on your fingers: 1... and 1 more makes 2!',
    narration: 'What is one plus one?',
    speaker: 'andy',
    explanation: '1 plus 1 equals 2!'
  },
  {
    id: 'lvl1_q02',
    levelNumber: 1,
    questionType: 'first_addition',
    text: 'What is 2 + 1?',
    correctAnswer: 3,
    options: [3, 2, 4],
    illustration: {
      type: 'token_count',
      items: [
        { emoji: '🌼', label: '2 daisies', count: 2 },
        { emoji: '🌼', label: '1 daisy', count: 1 }
      ],
      formulaDisplay: '2 + 1 = ?'
    },
    hint: 'Start with 2, then count up one: 2... 3!',
    narration: 'What is two plus one?',
    speaker: 'sancho',
    explanation: '2 plus 1 equals 3!'
  },
  {
    id: 'lvl1_q03',
    levelNumber: 1,
    questionType: 'first_addition',
    text: 'What is 1 + 2?',
    correctAnswer: 3,
    options: [3, 4, 1],
    illustration: {
      type: 'token_count',
      items: [
        { emoji: '⭐', label: '1 star', count: 1 },
        { emoji: '⭐', label: '2 stars', count: 2 }
      ],
      formulaDisplay: '1 + 2 = ?'
    },
    hint: '1 star and 2 stars together make 3 stars!',
    narration: 'What is one plus two?',
    speaker: 'andy',
    explanation: '1 plus 2 equals 3!'
  },
  {
    id: 'lvl1_q04',
    levelNumber: 1,
    questionType: 'first_addition',
    text: 'What is 2 + 2?',
    correctAnswer: 4,
    options: [4, 5, 3],
    illustration: {
      type: 'token_count',
      items: [
        { emoji: '🐸', label: '2 frogs', count: 2 },
        { emoji: '🐸', label: '2 frogs', count: 2 }
      ],
      formulaDisplay: '2 + 2 = ?'
    },
    hint: 'Count 2 on one hand and 2 on the other: 1, 2, 3, 4!',
    narration: 'What is two plus two?',
    speaker: 'sancho',
    explanation: '2 plus 2 equals 4!'
  },
  {
    id: 'lvl1_q05',
    levelNumber: 1,
    questionType: 'first_addition',
    text: 'What is 3 + 1?',
    correctAnswer: 4,
    options: [4, 5, 2],
    illustration: {
      type: 'token_count',
      items: [
        { emoji: '🍓', label: '3 berries', count: 3 },
        { emoji: '🍓', label: '1 berry', count: 1 }
      ],
      formulaDisplay: '3 + 1 = ?'
    },
    hint: 'Start at 3 and take one step forward: 4!',
    narration: 'What is three plus one?',
    speaker: 'andy',
    explanation: '3 plus 1 equals 4!'
  },
  {
    id: 'lvl1_q06',
    levelNumber: 1,
    questionType: 'first_addition',
    text: 'What is 1 + 3?',
    correctAnswer: 4,
    options: [4, 3, 5],
    illustration: {
      type: 'token_count',
      items: [
        { emoji: '🎈', label: '1 balloon', count: 1 },
        { emoji: '🎈', label: '3 balloons', count: 3 }
      ],
      formulaDisplay: '1 + 3 = ?'
    },
    hint: 'Flip it around: 3 plus 1 is 4!',
    narration: 'What is one plus three?',
    speaker: 'sancho',
    explanation: '1 plus 3 equals 4!'
  },
  {
    id: 'lvl1_q07',
    levelNumber: 1,
    questionType: 'first_addition',
    text: 'What is 2 + 3?',
    correctAnswer: 5,
    options: [5, 4, 3],
    illustration: {
      type: 'token_count',
      items: [
        { emoji: '🍄', label: '2 mushrooms', count: 2 },
        { emoji: '🍄', label: '3 mushrooms', count: 3 }
      ],
      formulaDisplay: '2 + 3 = ?'
    },
    hint: 'Show 2 fingers and 3 fingers: that makes a whole hand of 5!',
    narration: 'What is two plus three?',
    speaker: 'andy',
    explanation: '2 plus 3 equals 5!'
  },
  {
    id: 'lvl1_q08',
    levelNumber: 1,
    questionType: 'first_addition',
    text: 'What is 3 + 2?',
    correctAnswer: 5,
    options: [5, 6, 4],
    illustration: {
      type: 'token_count',
      items: [
        { emoji: '🐾', label: '3 paws', count: 3 },
        { emoji: '🐾', label: '2 paws', count: 2 }
      ],
      formulaDisplay: '3 + 2 = ?'
    },
    hint: '3 plus 2 gives us 5 high-fives!',
    narration: 'What is three plus two?',
    speaker: 'sancho',
    explanation: '3 plus 2 equals 5!'
  },
  {
    id: 'lvl1_q09',
    levelNumber: 1,
    questionType: 'first_addition',
    text: 'What is 4 + 1?',
    correctAnswer: 5,
    options: [5, 3, 6],
    illustration: {
      type: 'token_count',
      items: [
        { emoji: '🦋', label: '4 butterflies', count: 4 },
        { emoji: '🦋', label: '1 butterfly', count: 1 }
      ],
      formulaDisplay: '4 + 1 = ?'
    },
    hint: 'What number comes right after 4? It is 5!',
    narration: 'What is four plus one?',
    speaker: 'andy',
    explanation: '4 plus 1 equals 5!'
  },
  {
    id: 'lvl1_q10',
    levelNumber: 1,
    questionType: 'first_addition',
    text: 'What is 1 + 4?',
    correctAnswer: 5,
    options: [5, 4, 2],
    illustration: {
      type: 'token_count',
      items: [
        { emoji: '💎', label: '1 gem', count: 1 },
        { emoji: '💎', label: '4 gems', count: 4 }
      ],
      formulaDisplay: '1 + 4 = ?'
    },
    hint: 'Count all the gems: 1, 2, 3, 4, 5!',
    narration: 'What is one plus four?',
    speaker: 'sancho',
    explanation: '1 plus 4 equals 5!'
  }
];

export const LEVEL_2_QUESTIONS: MathQuestion[] = [
  {
    id: 'lvl2_q01',
    levelNumber: 2,
    questionType: 'counting_addition',
    text: 'Count and add: 3 red apples + 2 red apples = ?',
    correctAnswer: 5,
    options: [5, 4, 6],
    illustration: {
      type: 'token_count',
      items: [
        { emoji: '🍎', label: '3 apples', count: 3 },
        { emoji: '🍎', label: '2 apples', count: 2 }
      ],
      formulaDisplay: '3 + 2 = ?'
    },
    hint: 'Count all the apples together: 1, 2, 3, 4, 5!',
    narration: 'Three apples plus two apples equals how many apples?',
    speaker: 'andy',
    explanation: '3 apples + 2 apples = 5 apples!'
  },
  {
    id: 'lvl2_q02',
    levelNumber: 2,
    questionType: 'counting_addition',
    text: 'Count and add: 4 green frogs + 2 green frogs = ?',
    correctAnswer: 6,
    options: [6, 7, 5],
    illustration: {
      type: 'token_count',
      items: [
        { emoji: '🐸', label: '4 frogs', count: 4 },
        { emoji: '🐸', label: '2 frogs', count: 2 }
      ],
      formulaDisplay: '4 + 2 = ?'
    },
    hint: 'Start at 4 and count two more: 5, 6!',
    narration: 'Four frogs plus two frogs equals how many frogs?',
    speaker: 'sancho',
    explanation: '4 frogs + 2 frogs = 6 frogs!'
  },
  {
    id: 'lvl2_q03',
    levelNumber: 2,
    questionType: 'counting_addition',
    text: 'Count and add: 3 shiny stars + 4 shiny stars = ?',
    correctAnswer: 7,
    options: [7, 6, 8],
    illustration: {
      type: 'token_count',
      items: [
        { emoji: '⭐', label: '3 stars', count: 3 },
        { emoji: '⭐', label: '4 stars', count: 4 }
      ],
      formulaDisplay: '3 + 4 = ?'
    },
    hint: '3 plus 4 is 7 twinkling stars!',
    narration: 'Three stars plus four stars equals how many?',
    speaker: 'andy',
    explanation: '3 + 4 = 7 stars!'
  },
  {
    id: 'lvl2_q04',
    levelNumber: 2,
    questionType: 'counting_addition',
    text: 'Count and add: 5 yellow daisies + 2 yellow daisies = ?',
    correctAnswer: 7,
    options: [7, 8, 6],
    illustration: {
      type: 'token_count',
      items: [
        { emoji: '🌼', label: '5 daisies', count: 5 },
        { emoji: '🌼', label: '2 daisies', count: 2 }
      ],
      formulaDisplay: '5 + 2 = ?'
    },
    hint: '5 on one hand, add 2 more fingers: 6, 7!',
    narration: 'Five daisies plus two daisies equals how many?',
    speaker: 'sancho',
    explanation: '5 + 2 = 7 daisies!'
  },
  {
    id: 'lvl2_q05',
    levelNumber: 2,
    questionType: 'counting_addition',
    text: 'Count and add: 4 bouncy balls + 4 bouncy balls = ?',
    correctAnswer: 8,
    options: [8, 9, 7],
    illustration: {
      type: 'token_count',
      items: [
        { emoji: '⚽', label: '4 balls', count: 4 },
        { emoji: '⚽', label: '4 balls', count: 4 }
      ],
      formulaDisplay: '4 + 4 = ?'
    },
    hint: 'Double 4 is 8!',
    narration: 'Four balls plus four balls equals how many balls?',
    speaker: 'andy',
    explanation: '4 + 4 = 8 balls!'
  },
  {
    id: 'lvl2_q06',
    levelNumber: 2,
    questionType: 'counting_addition',
    text: 'Count and add: 6 sweet candies + 2 sweet candies = ?',
    correctAnswer: 8,
    options: [8, 7, 9],
    illustration: {
      type: 'token_count',
      items: [
        { emoji: '🍬', label: '6 candies', count: 6 },
        { emoji: '🍬', label: '2 candies', count: 2 }
      ],
      formulaDisplay: '6 + 2 = ?'
    },
    hint: '6... 7, 8! Two more gives 8!',
    narration: 'Six candies plus two candies equals how many candies?',
    speaker: 'sancho',
    explanation: '6 + 2 = 8 candies!'
  },
  {
    id: 'lvl2_q07',
    levelNumber: 2,
    questionType: 'counting_addition',
    text: 'Count and add: 5 juicy strawberries + 4 juicy strawberries = ?',
    correctAnswer: 9,
    options: [9, 8, 10],
    illustration: {
      type: 'token_count',
      items: [
        { emoji: '🍓', label: '5 berries', count: 5 },
        { emoji: '🍓', label: '4 berries', count: 4 }
      ],
      formulaDisplay: '5 + 4 = ?'
    },
    hint: 'Just one less than 10 is 9!',
    narration: 'Five strawberries plus four strawberries equals how many?',
    speaker: 'andy',
    explanation: '5 + 4 = 9 strawberries!'
  },
  {
    id: 'lvl2_q08',
    levelNumber: 2,
    questionType: 'counting_addition',
    text: 'Count and add: 3 forest mushrooms + 6 forest mushrooms = ?',
    correctAnswer: 9,
    options: [9, 8, 7],
    illustration: {
      type: 'token_count',
      items: [
        { emoji: '🍄', label: '3 mushrooms', count: 3 },
        { emoji: '🍄', label: '6 mushrooms', count: 6 }
      ],
      formulaDisplay: '3 + 6 = ?'
    },
    hint: 'Start with the bigger group 6, and count up 3: 7, 8, 9!',
    narration: 'Three mushrooms plus six mushrooms equals how many?',
    speaker: 'sancho',
    explanation: '3 + 6 = 9 mushrooms!'
  },
  {
    id: 'lvl2_q09',
    levelNumber: 2,
    questionType: 'counting_addition',
    text: 'Count and add: 5 gold stars + 5 gold stars = ?',
    correctAnswer: 10,
    options: [10, 9, 8],
    illustration: {
      type: 'token_count',
      items: [
        { emoji: '⭐', label: '5 stars', count: 5 },
        { emoji: '⭐', label: '5 stars', count: 5 }
      ],
      formulaDisplay: '5 + 5 = ?'
    },
    hint: 'Two full hands of 5 make 10!',
    narration: 'Five stars plus five stars equals how many?',
    speaker: 'andy',
    explanation: '5 + 5 = 10 stars!'
  },
  {
    id: 'lvl2_q10',
    levelNumber: 2,
    questionType: 'counting_addition',
    text: 'Count and add: 7 pink blossoms + 3 pink blossoms = ?',
    correctAnswer: 10,
    options: [10, 8, 9],
    illustration: {
      type: 'token_count',
      items: [
        { emoji: '🌸', label: '7 blossoms', count: 7 },
        { emoji: '🌸', label: '3 blossoms', count: 3 }
      ],
      formulaDisplay: '7 + 3 = ?'
    },
    hint: '7 plus 3 makes the magical number 10!',
    narration: 'Seven blossoms plus three blossoms equals how many?',
    speaker: 'sancho',
    explanation: '7 + 3 = 10 blossoms!'
  }
];

export const LEVEL_3_QUESTIONS: MathQuestion[] = [
  {
    id: 'lvl3_q01',
    levelNumber: 3,
    questionType: 'basic_subtraction',
    text: '3 apples on the tree. 1 falls down. How many are left? 3 − 1 = ?',
    correctAnswer: 2,
    options: [2, 1, 3],
    illustration: {
      type: 'token_count',
      items: [
        { emoji: '🍎', label: 'Start with 3', count: 3 },
        { emoji: '🍂', label: 'Take away 1', count: 1 }
      ],
      formulaDisplay: '3 − 1 = ?'
    },
    hint: 'Hold up 3 fingers and put 1 down. How many are left?',
    narration: 'Three apples minus one apple leaves how many?',
    speaker: 'andy',
    explanation: '3 − 1 = 2 apples left!'
  },
  {
    id: 'lvl3_q02',
    levelNumber: 3,
    questionType: 'basic_subtraction',
    text: '4 frogs on a log. 2 hop away into the pond. 4 − 2 = ?',
    correctAnswer: 2,
    options: [2, 3, 1],
    illustration: {
      type: 'token_count',
      items: [
        { emoji: '🐸', label: '4 frogs', count: 4 },
        { emoji: '💦', label: '2 hop away', count: 2 }
      ],
      formulaDisplay: '4 − 2 = ?'
    },
    hint: '4 take away 2 leaves 2!',
    narration: 'Four frogs minus two frogs leaves how many?',
    speaker: 'sancho',
    explanation: '4 − 2 = 2 frogs left!'
  },
  {
    id: 'lvl3_q03',
    levelNumber: 3,
    questionType: 'basic_subtraction',
    text: '5 sweet candies. Osi eats 1 candy. 5 − 1 = ?',
    correctAnswer: 4,
    options: [4, 3, 5],
    illustration: {
      type: 'token_count',
      items: [
        { emoji: '🍬', label: '5 candies', count: 5 },
        { emoji: '🐶', label: '1 eaten', count: 1 }
      ],
      formulaDisplay: '5 − 1 = ?'
    },
    hint: 'What number comes right before 5? It is 4!',
    narration: 'Five candies minus one candy leaves how many?',
    speaker: 'andy',
    explanation: '5 − 1 = 4 candies left!'
  },
  {
    id: 'lvl3_q04',
    levelNumber: 3,
    questionType: 'basic_subtraction',
    text: '5 gold stars. 2 hide behind a cloud. 5 − 2 = ?',
    correctAnswer: 3,
    options: [3, 2, 4],
    illustration: {
      type: 'token_count',
      items: [
        { emoji: '⭐', label: '5 stars', count: 5 },
        { emoji: '☁️', label: '2 behind cloud', count: 2 }
      ],
      formulaDisplay: '5 − 2 = ?'
    },
    hint: 'Count down 2 from 5: 4, 3!',
    narration: 'Five stars minus two stars leaves how many?',
    speaker: 'sancho',
    explanation: '5 − 2 = 3 stars left!'
  },
  {
    id: 'lvl3_q05',
    levelNumber: 3,
    questionType: 'basic_subtraction',
    text: '6 colorful balls. 3 roll down the hill. 6 − 3 = ?',
    correctAnswer: 3,
    options: [3, 4, 2],
    illustration: {
      type: 'token_count',
      items: [
        { emoji: '⚽', label: '6 balls', count: 6 },
        { emoji: '💨', label: '3 roll away', count: 3 }
      ],
      formulaDisplay: '6 − 3 = ?'
    },
    hint: 'Half of 6 is 3!',
    narration: 'Six balls minus three balls leaves how many?',
    speaker: 'andy',
    explanation: '6 − 3 = 3 balls left!'
  },
  {
    id: 'lvl3_q06',
    levelNumber: 3,
    questionType: 'basic_subtraction',
    text: '6 butterflies on a flower. 2 fly away. 6 − 2 = ?',
    correctAnswer: 4,
    options: [4, 5, 3],
    illustration: {
      type: 'token_count',
      items: [
        { emoji: '🦋', label: '6 butterflies', count: 6 },
        { emoji: '🌸', label: '2 fly off', count: 2 }
      ],
      formulaDisplay: '6 − 2 = ?'
    },
    hint: 'Count backwards two steps from 6: 5... 4!',
    narration: 'Six butterflies minus two leaves how many?',
    speaker: 'sancho',
    explanation: '6 − 2 = 4 butterflies left!'
  },
  {
    id: 'lvl3_q07',
    levelNumber: 3,
    questionType: 'basic_subtraction',
    text: '7 mushrooms in the grass. Sancho picks 3. 7 − 3 = ?',
    correctAnswer: 4,
    options: [4, 5, 3],
    illustration: {
      type: 'token_count',
      items: [
        { emoji: '🍄', label: '7 mushrooms', count: 7 },
        { emoji: '🧺', label: '3 picked', count: 3 }
      ],
      formulaDisplay: '7 − 3 = ?'
    },
    hint: '7 take away 3 leaves 4!',
    narration: 'Seven mushrooms minus three leaves how many?',
    speaker: 'andy',
    explanation: '7 − 3 = 4 mushrooms left!'
  },
  {
    id: 'lvl3_q08',
    levelNumber: 3,
    questionType: 'basic_subtraction',
    text: '7 toy blocks. Andy puts 4 in the box. 7 − 4 = ?',
    correctAnswer: 3,
    options: [3, 2, 5],
    illustration: {
      type: 'token_count',
      items: [
        { emoji: '🧱', label: '7 blocks', count: 7 },
        { emoji: '📦', label: '4 packed', count: 4 }
      ],
      formulaDisplay: '7 − 4 = ?'
    },
    hint: '7 minus 4 leaves 3!',
    narration: 'Seven blocks minus four leaves how many?',
    speaker: 'sancho',
    explanation: '7 − 4 = 3 blocks left!'
  },
  {
    id: 'lvl3_q09',
    levelNumber: 3,
    questionType: 'basic_subtraction',
    text: '8 yellow daisies. 3 are picked for Andy. 8 − 3 = ?',
    correctAnswer: 5,
    options: [5, 4, 6],
    illustration: {
      type: 'token_count',
      items: [
        { emoji: '🌼', label: '8 daisies', count: 8 },
        { emoji: '💐', label: '3 picked', count: 3 }
      ],
      formulaDisplay: '8 − 3 = ?'
    },
    hint: '8 take away 3 leaves 5!',
    narration: 'Eight daisies minus three leaves how many?',
    speaker: 'andy',
    explanation: '8 − 3 = 5 daisies left!'
  },
  {
    id: 'lvl3_q10',
    levelNumber: 3,
    questionType: 'basic_subtraction',
    text: '9 shiny crystals. 4 are placed in the chest. 9 − 4 = ?',
    correctAnswer: 5,
    options: [5, 6, 4],
    illustration: {
      type: 'token_count',
      items: [
        { emoji: '💎', label: '9 crystals', count: 9 },
        { emoji: '🎁', label: '4 stored', count: 4 }
      ],
      formulaDisplay: '9 − 4 = ?'
    },
    hint: '9 take away 4 leaves 5!',
    narration: 'Nine crystals minus four leaves how many?',
    speaker: 'sancho',
    explanation: '9 − 4 = 5 crystals left!'
  }
];

export const LEVEL_4_QUESTIONS: MathQuestion[] = [
  {
    id: 'lvl4_q01',
    levelNumber: 4,
    questionType: 'mixed_operations',
    text: 'What is 4 + 3?',
    correctAnswer: 7,
    options: [7, 6, 8],
    illustration: { type: 'formula', formulaDisplay: '4 + 3 = ?' },
    hint: 'Count on from 4: 5, 6, 7!',
    narration: 'What is four plus three?',
    speaker: 'andy',
    explanation: '4 + 3 = 7'
  },
  {
    id: 'lvl4_q02',
    levelNumber: 4,
    questionType: 'mixed_operations',
    text: 'What is 8 − 3?',
    correctAnswer: 5,
    options: [5, 6, 4],
    illustration: { type: 'formula', formulaDisplay: '8 − 3 = ?' },
    hint: 'Start with 8 and count back 3: 7, 6, 5!',
    narration: 'What is eight minus three?',
    speaker: 'sancho',
    explanation: '8 − 3 = 5'
  },
  {
    id: 'lvl4_q03',
    levelNumber: 4,
    questionType: 'mixed_operations',
    text: 'What is 5 + 3?',
    correctAnswer: 8,
    options: [8, 7, 9],
    illustration: { type: 'formula', formulaDisplay: '5 + 3 = ?' },
    hint: '5 plus 3 makes 8!',
    narration: 'What is five plus three?',
    speaker: 'andy',
    explanation: '5 + 3 = 8'
  },
  {
    id: 'lvl4_q04',
    levelNumber: 4,
    questionType: 'mixed_operations',
    text: 'What is 9 − 5?',
    correctAnswer: 4,
    options: [4, 5, 3],
    illustration: { type: 'formula', formulaDisplay: '9 − 5 = ?' },
    hint: 'Think: 4 + 5 = 9, so 9 − 5 = 4!',
    narration: 'What is nine minus five?',
    speaker: 'sancho',
    explanation: '9 − 5 = 4'
  },
  {
    id: 'lvl4_q05',
    levelNumber: 4,
    questionType: 'mixed_operations',
    text: 'What is 6 + 4?',
    correctAnswer: 10,
    options: [10, 9, 8],
    illustration: { type: 'formula', formulaDisplay: '6 + 4 = ?' },
    hint: '6 and 4 are number buddies that make 10!',
    narration: 'What is six plus four?',
    speaker: 'andy',
    explanation: '6 + 4 = 10'
  },
  {
    id: 'lvl4_q06',
    levelNumber: 4,
    questionType: 'mixed_operations',
    text: 'What is 10 − 4?',
    correctAnswer: 6,
    options: [6, 5, 7],
    illustration: { type: 'formula', formulaDisplay: '10 − 4 = ?' },
    hint: 'From 10, take away 4 and you get 6!',
    narration: 'What is ten minus four?',
    speaker: 'sancho',
    explanation: '10 − 4 = 6'
  },
  {
    id: 'lvl4_q07',
    levelNumber: 4,
    questionType: 'mixed_operations',
    text: 'What is 2 + 7?',
    correctAnswer: 9,
    options: [9, 8, 10],
    illustration: { type: 'formula', formulaDisplay: '2 + 7 = ?' },
    hint: 'Start with 7 and add 2: 8, 9!',
    narration: 'What is two plus seven?',
    speaker: 'andy',
    explanation: '2 + 7 = 9'
  },
  {
    id: 'lvl4_q08',
    levelNumber: 4,
    questionType: 'mixed_operations',
    text: 'What is 7 − 5?',
    correctAnswer: 2,
    options: [2, 3, 1],
    illustration: { type: 'formula', formulaDisplay: '7 − 5 = ?' },
    hint: '7 take away 5 leaves 2!',
    narration: 'What is seven minus five?',
    speaker: 'sancho',
    explanation: '7 − 5 = 2'
  },
  {
    id: 'lvl4_q09',
    levelNumber: 4,
    questionType: 'mixed_operations',
    text: 'What is 3 + 6?',
    correctAnswer: 9,
    options: [9, 8, 7],
    illustration: { type: 'formula', formulaDisplay: '3 + 6 = ?' },
    hint: '6 plus 3 gives 9!',
    narration: 'What is three plus six?',
    speaker: 'andy',
    explanation: '3 + 6 = 9'
  },
  {
    id: 'lvl4_q10',
    levelNumber: 4,
    questionType: 'mixed_operations',
    text: 'What is 8 − 6?',
    correctAnswer: 2,
    options: [2, 3, 4],
    illustration: { type: 'formula', formulaDisplay: '8 − 6 = ?' },
    hint: 'How many between 6 and 8? Just 2!',
    narration: 'What is eight minus six?',
    speaker: 'sancho',
    explanation: '8 − 6 = 2'
  }
];

export const LEVEL_5_QUESTIONS: MathQuestion[] = [
  {
    id: 'lvl5_q01',
    levelNumber: 5,
    questionType: 'missing_number',
    text: 'Find the missing number: 3 + ? = 5',
    correctAnswer: 2,
    options: [2, 3, 1],
    illustration: { type: 'formula', formulaDisplay: '3 + ? = 5' },
    hint: 'Start at 3 and count up to 5: 4, 5 (that is 2 steps)!',
    narration: 'Three plus what number equals five?',
    speaker: 'andy',
    explanation: '3 + 2 = 5'
  },
  {
    id: 'lvl5_q02',
    levelNumber: 5,
    questionType: 'missing_number',
    text: 'Find the missing number: ? + 2 = 6',
    correctAnswer: 4,
    options: [4, 3, 5],
    illustration: { type: 'formula', formulaDisplay: '? + 2 = 6' },
    hint: 'What number plus 2 makes 6? Think 6 − 2 = 4!',
    narration: 'What number plus two equals six?',
    speaker: 'sancho',
    explanation: '4 + 2 = 6'
  },
  {
    id: 'lvl5_q03',
    levelNumber: 5,
    questionType: 'missing_number',
    text: 'Find the missing number: 7 − ? = 4',
    correctAnswer: 3,
    options: [3, 2, 4],
    illustration: { type: 'formula', formulaDisplay: '7 − ? = 4' },
    hint: '7 take away how many leaves 4? 7 − 4 = 3!',
    narration: 'Seven minus what number equals four?',
    speaker: 'andy',
    explanation: '7 − 3 = 4'
  },
  {
    id: 'lvl5_q04',
    levelNumber: 5,
    questionType: 'missing_number',
    text: 'Find the missing number: ? − 3 = 2',
    correctAnswer: 5,
    options: [5, 4, 6],
    illustration: { type: 'formula', formulaDisplay: '? − 3 = 2' },
    hint: 'Add 3 and 2 together to find the starting number: 5!',
    narration: 'What number minus three equals two?',
    speaker: 'sancho',
    explanation: '5 − 3 = 2'
  },
  {
    id: 'lvl5_q05',
    levelNumber: 5,
    questionType: 'missing_number',
    text: 'Find the missing number: 4 + ? = 8',
    correctAnswer: 4,
    options: [4, 3, 5],
    illustration: { type: 'formula', formulaDisplay: '4 + ? = 8' },
    hint: 'Double 4 is 8, so the missing number is 4!',
    narration: 'Four plus what number equals eight?',
    speaker: 'andy',
    explanation: '4 + 4 = 8'
  },
  {
    id: 'lvl5_q06',
    levelNumber: 5,
    questionType: 'missing_number',
    text: 'Find the missing number: ? + 5 = 9',
    correctAnswer: 4,
    options: [4, 3, 5],
    illustration: { type: 'formula', formulaDisplay: '? + 5 = 9' },
    hint: '9 − 5 = 4!',
    narration: 'What number plus five equals nine?',
    speaker: 'sancho',
    explanation: '4 + 5 = 9'
  },
  {
    id: 'lvl5_q07',
    levelNumber: 5,
    questionType: 'missing_number',
    text: 'Find the missing number: 8 − ? = 5',
    correctAnswer: 3,
    options: [3, 4, 2],
    illustration: { type: 'formula', formulaDisplay: '8 − ? = 5' },
    hint: 'Count down from 8 to 5: 7, 6, 5 (3 steps)!',
    narration: 'Eight minus what number equals five?',
    speaker: 'andy',
    explanation: '8 − 3 = 5'
  },
  {
    id: 'lvl5_q08',
    levelNumber: 5,
    questionType: 'missing_number',
    text: 'Find the missing number: ? − 4 = 3',
    correctAnswer: 7,
    options: [7, 6, 8],
    illustration: { type: 'formula', formulaDisplay: '? − 4 = 3' },
    hint: 'Put 4 and 3 back together: 4 + 3 = 7!',
    narration: 'What number minus four equals three?',
    speaker: 'sancho',
    explanation: '7 − 4 = 3'
  },
  {
    id: 'lvl5_q09',
    levelNumber: 5,
    questionType: 'missing_number',
    text: 'Find the missing number: 6 + ? = 10',
    correctAnswer: 4,
    options: [4, 5, 3],
    illustration: { type: 'formula', formulaDisplay: '6 + ? = 10' },
    hint: 'What does 6 need to make 10? 4 more!',
    narration: 'Six plus what number equals ten?',
    speaker: 'andy',
    explanation: '6 + 4 = 10'
  },
  {
    id: 'lvl5_q10',
    levelNumber: 5,
    questionType: 'missing_number',
    text: 'Find the missing number: 10 − ? = 7',
    correctAnswer: 3,
    options: [3, 2, 4],
    illustration: { type: 'formula', formulaDisplay: '10 − ? = 7' },
    hint: '10 take away 3 leaves 7!',
    narration: 'Ten minus what number equals seven?',
    speaker: 'sancho',
    explanation: '10 − 3 = 7'
  }
];

export const LEVEL_6_QUESTIONS: MathQuestion[] = [
  {
    id: 'lvl6_q01',
    levelNumber: 6,
    questionType: 'addition_subtraction_20',
    text: 'What is 10 + 4?',
    correctAnswer: 14,
    options: [14, 13, 15],
    illustration: { type: 'formula', formulaDisplay: '10 + 4 = ?' },
    hint: 'A group of ten and 4 ones makes 14!',
    narration: 'What is ten plus four?',
    speaker: 'andy',
    explanation: '10 + 4 = 14'
  },
  {
    id: 'lvl6_q02',
    levelNumber: 6,
    questionType: 'addition_subtraction_20',
    text: 'What is 15 − 3?',
    correctAnswer: 12,
    options: [12, 11, 13],
    illustration: { type: 'formula', formulaDisplay: '15 − 3 = ?' },
    hint: 'Subtract 3 from 5 to get 2, so 15 − 3 = 12!',
    narration: 'What is fifteen minus three?',
    speaker: 'sancho',
    explanation: '15 − 3 = 12'
  },
  {
    id: 'lvl6_q03',
    levelNumber: 6,
    questionType: 'addition_subtraction_20',
    text: 'What is 11 + 5?',
    correctAnswer: 16,
    options: [16, 15, 17],
    illustration: { type: 'formula', formulaDisplay: '11 + 5 = ?' },
    hint: '1 plus 5 is 6, so 11 plus 5 is 16!',
    narration: 'What is eleven plus five?',
    speaker: 'andy',
    explanation: '11 + 5 = 16'
  },
  {
    id: 'lvl6_q04',
    levelNumber: 6,
    questionType: 'addition_subtraction_20',
    text: 'What is 17 − 5?',
    correctAnswer: 12,
    options: [12, 13, 11],
    illustration: { type: 'formula', formulaDisplay: '17 − 5 = ?' },
    hint: '7 − 5 = 2, so 17 − 5 = 12!',
    narration: 'What is seventeen minus five?',
    speaker: 'sancho',
    explanation: '17 − 5 = 12'
  },
  {
    id: 'lvl6_q05',
    levelNumber: 6,
    questionType: 'addition_subtraction_20',
    text: 'What is 12 + 6?',
    correctAnswer: 18,
    options: [18, 17, 19],
    illustration: { type: 'formula', formulaDisplay: '12 + 6 = ?' },
    hint: '2 + 6 = 8, so 12 + 6 = 18!',
    narration: 'What is twelve plus six?',
    speaker: 'andy',
    explanation: '12 + 6 = 18'
  },
  {
    id: 'lvl6_q06',
    levelNumber: 6,
    questionType: 'addition_subtraction_20',
    text: 'What is 18 − 4?',
    correctAnswer: 14,
    options: [14, 15, 13],
    illustration: { type: 'formula', formulaDisplay: '18 − 4 = ?' },
    hint: '8 − 4 = 4, so 18 − 4 = 14!',
    narration: 'What is eighteen minus four?',
    speaker: 'sancho',
    explanation: '18 − 4 = 14'
  },
  {
    id: 'lvl6_q07',
    levelNumber: 6,
    questionType: 'addition_subtraction_20',
    text: 'What is 9 + 8?',
    correctAnswer: 17,
    options: [17, 16, 18],
    illustration: { type: 'formula', formulaDisplay: '9 + 8 = ?' },
    hint: 'Take 1 from 8 to make 10 with 9, then 10 + 7 = 17!',
    narration: 'What is nine plus eight?',
    speaker: 'andy',
    explanation: '9 + 8 = 17'
  },
  {
    id: 'lvl6_q08',
    levelNumber: 6,
    questionType: 'addition_subtraction_20',
    text: 'What is 16 − 7?',
    correctAnswer: 9,
    options: [9, 8, 10],
    illustration: { type: 'formula', formulaDisplay: '16 − 7 = ?' },
    hint: '16 − 6 = 10, and 10 − 1 = 9!',
    narration: 'What is sixteen minus seven?',
    speaker: 'sancho',
    explanation: '16 − 7 = 9'
  },
  {
    id: 'lvl6_q09',
    levelNumber: 6,
    questionType: 'addition_subtraction_20',
    text: 'What is 13 + 7?',
    correctAnswer: 20,
    options: [20, 19, 18],
    illustration: { type: 'formula', formulaDisplay: '13 + 7 = ?' },
    hint: '3 + 7 = 10, plus 10 = 20!',
    narration: 'What is thirteen plus seven?',
    speaker: 'andy',
    explanation: '13 + 7 = 20'
  },
  {
    id: 'lvl6_q10',
    levelNumber: 6,
    questionType: 'addition_subtraction_20',
    text: 'What is 20 − 6?',
    correctAnswer: 14,
    options: [14, 15, 13],
    illustration: { type: 'formula', formulaDisplay: '20 − 6 = ?' },
    hint: '10 − 6 = 4, so 20 − 6 = 14!',
    narration: 'What is twenty minus six?',
    speaker: 'sancho',
    explanation: '20 − 6 = 14'
  }
];

export const LEVEL_7_QUESTIONS: MathQuestion[] = [
  {
    id: 'lvl7_q01',
    levelNumber: 7,
    questionType: 'pattern_sequence',
    text: 'What number comes next in the pattern? 2, 4, 6, ?',
    correctAnswer: 8,
    options: [8, 7, 9],
    illustration: {
      type: 'pattern',
      patternElements: ['2', '4', '6', '?']
    },
    hint: 'We are counting by twos: add 2 to 6!',
    narration: 'What number comes next? Two, four, six, and then?',
    speaker: 'andy',
    explanation: 'Count by 2s: 2, 4, 6, 8!'
  },
  {
    id: 'lvl7_q02',
    levelNumber: 7,
    questionType: 'pattern_sequence',
    text: 'What color stone comes next? 🔴, 🔵, 🔴, 🔵, ?',
    correctAnswer: '🔴',
    options: ['🔴', '🔵', '🟡'],
    illustration: {
      type: 'pattern',
      patternElements: ['🔴', '🔵', '🔴', '🔵', '?']
    },
    hint: 'It alternates: red, blue, red, blue... next is red!',
    narration: 'Red, blue, red, blue... which stone comes next?',
    speaker: 'sancho',
    explanation: 'The pattern repeats: red, blue, red!'
  },
  {
    id: 'lvl7_q03',
    levelNumber: 7,
    questionType: 'pattern_sequence',
    text: 'What shape comes next? 🔺, 🟦, 🔺, 🟦, ?',
    correctAnswer: '🔺',
    options: ['🔺', '🟦', '⭐'],
    illustration: {
      type: 'pattern',
      patternElements: ['🔺', '🟦', '🔺', '🟦', '?']
    },
    hint: 'Triangle, square, triangle, square... next is triangle!',
    narration: 'Triangle, square, triangle, square... what shape is next?',
    speaker: 'andy',
    explanation: 'The triangle completes the sequence!'
  },
  {
    id: 'lvl7_q04',
    levelNumber: 7,
    questionType: 'pattern_sequence',
    text: 'Counting by tens: 10, 20, 30, ?',
    correctAnswer: 40,
    options: [40, 35, 50],
    illustration: {
      type: 'pattern',
      patternElements: ['10', '20', '30', '?']
    },
    hint: 'Add 10 to 30: 10, 20, 30, 40!',
    narration: 'Ten, twenty, thirty... what number is next?',
    speaker: 'sancho',
    explanation: '10, 20, 30, 40!'
  },
  {
    id: 'lvl7_q05',
    levelNumber: 7,
    questionType: 'pattern_sequence',
    text: 'Odd numbers sequence: 1, 3, 5, ?',
    correctAnswer: 7,
    options: [7, 6, 8],
    illustration: {
      type: 'pattern',
      patternElements: ['1', '3', '5', '?']
    },
    hint: 'Skip one number each time: 1, skip 2, 3, skip 4, 5, skip 6, 7!',
    narration: 'One, three, five... what comes next?',
    speaker: 'andy',
    explanation: 'The next odd number is 7!'
  },
  {
    id: 'lvl7_q06',
    levelNumber: 7,
    questionType: 'pattern_sequence',
    text: 'Fruit pattern: 🍎, 🍌, 🍎, 🍌, ?',
    correctAnswer: '🍎',
    options: ['🍎', '🍌', '🍇'],
    illustration: {
      type: 'pattern',
      patternElements: ['🍎', '🍌', '🍎', '🍌', '?']
    },
    hint: 'Apple, banana, apple, banana... next is apple!',
    narration: 'Apple, banana, apple, banana... what fruit comes next?',
    speaker: 'sancho',
    explanation: 'Apple comes next!'
  },
  {
    id: 'lvl7_q07',
    levelNumber: 7,
    questionType: 'pattern_sequence',
    text: 'Counting by fives: 5, 10, 15, ?',
    correctAnswer: 20,
    options: [20, 18, 25],
    illustration: {
      type: 'pattern',
      patternElements: ['5', '10', '15', '?']
    },
    hint: 'Add 5 to 15: 15 + 5 = 20!',
    narration: 'Five, ten, fifteen... what is next?',
    speaker: 'andy',
    explanation: '5, 10, 15, 20!'
  },
  {
    id: 'lvl7_q08',
    levelNumber: 7,
    questionType: 'pattern_sequence',
    text: 'Shape pattern: ⭐, ⭕, ⭐, ⭕, ?',
    correctAnswer: '⭐',
    options: ['⭐', '⭕', '🟩'],
    illustration: {
      type: 'pattern',
      patternElements: ['⭐', '⭕', '⭐', '⭕', '?']
    },
    hint: 'Star, circle, star, circle... next is star!',
    narration: 'Star, circle, star, circle... what shape is next?',
    speaker: 'sancho',
    explanation: 'Star is next in the pattern!'
  },
  {
    id: 'lvl7_q09',
    levelNumber: 7,
    questionType: 'pattern_sequence',
    text: 'Countdown sequence: 9, 8, 7, ?',
    correctAnswer: 6,
    options: [6, 5, 4],
    illustration: {
      type: 'pattern',
      patternElements: ['9', '8', '7', '?']
    },
    hint: 'Counting down: what comes before 7? 6!',
    narration: 'Nine, eight, seven... what number is next?',
    speaker: 'andy',
    explanation: '9, 8, 7, 6!'
  },
  {
    id: 'lvl7_q10',
    levelNumber: 7,
    questionType: 'pattern_sequence',
    text: 'Count by threes: 3, 6, 9, ?',
    correctAnswer: 12,
    options: [12, 11, 10],
    illustration: {
      type: 'pattern',
      patternElements: ['3', '6', '9', '?']
    },
    hint: 'Add 3 to 9: 9 + 3 = 12!',
    narration: 'Three, six, nine... what number comes next?',
    speaker: 'sancho',
    explanation: '3, 6, 9, 12!'
  }
];

export const LEVEL_8_QUESTIONS: MathQuestion[] = [
  {
    id: 'lvl8_q01',
    levelNumber: 8,
    questionType: 'multi_step',
    text: 'First add (2 + 2), then add 1 more: (2 + 2) + 1 = ?',
    correctAnswer: 5,
    options: [5, 4, 6],
    illustration: {
      type: 'formula',
      formulaDisplay: '(2 + 2) + 1 = ?\nStep 1: 2 + 2 = 4\nStep 2: 4 + 1 = ?'
    },
    hint: 'Step 1: 2 + 2 = 4. Step 2: 4 + 1 = 5!',
    narration: 'First add two plus two, then add one more.',
    speaker: 'andy',
    explanation: '2 + 2 = 4, and 4 + 1 = 5!'
  },
  {
    id: 'lvl8_q02',
    levelNumber: 8,
    questionType: 'multi_step',
    text: 'First subtract (5 − 2), then add 3: (5 − 2) + 3 = ?',
    correctAnswer: 6,
    options: [6, 5, 7],
    illustration: {
      type: 'formula',
      formulaDisplay: '(5 − 2) + 3 = ?\nStep 1: 5 − 2 = 3\nStep 2: 3 + 3 = ?'
    },
    hint: 'Step 1: 5 − 2 = 3. Step 2: 3 + 3 = 6!',
    narration: 'First take two from five, then add three.',
    speaker: 'sancho',
    explanation: '5 − 2 = 3, and 3 + 3 = 6!'
  },
  {
    id: 'lvl8_q03',
    levelNumber: 8,
    questionType: 'multi_step',
    text: 'First add (3 + 3), then subtract 2: (3 + 3) − 2 = ?',
    correctAnswer: 4,
    options: [4, 5, 3],
    illustration: {
      type: 'formula',
      formulaDisplay: '(3 + 3) − 2 = ?\nStep 1: 3 + 3 = 6\nStep 2: 6 − 2 = ?'
    },
    hint: 'Step 1: 3 + 3 = 6. Step 2: 6 − 2 = 4!',
    narration: 'First add three plus three, then subtract two.',
    speaker: 'andy',
    explanation: '3 + 3 = 6, and 6 − 2 = 4!'
  },
  {
    id: 'lvl8_q04',
    levelNumber: 8,
    questionType: 'multi_step',
    text: 'First add (4 + 2), then add 3 more: (4 + 2) + 3 = ?',
    correctAnswer: 9,
    options: [9, 8, 10],
    illustration: {
      type: 'formula',
      formulaDisplay: '(4 + 2) + 3 = ?\nStep 1: 4 + 2 = 6\nStep 2: 6 + 3 = ?'
    },
    hint: 'Step 1: 4 + 2 = 6. Step 2: 6 + 3 = 9!',
    narration: 'First add four plus two, then add three.',
    speaker: 'sancho',
    explanation: '4 + 2 = 6, and 6 + 3 = 9!'
  },
  {
    id: 'lvl8_q05',
    levelNumber: 8,
    questionType: 'multi_step',
    text: 'First subtract (8 − 3), then subtract 2 more: (8 − 3) − 2 = ?',
    correctAnswer: 3,
    options: [3, 4, 2],
    illustration: {
      type: 'formula',
      formulaDisplay: '(8 − 3) − 2 = ?\nStep 1: 8 − 3 = 5\nStep 2: 5 − 2 = ?'
    },
    hint: 'Step 1: 8 − 3 = 5. Step 2: 5 − 2 = 3!',
    narration: 'First subtract eight minus three, then subtract two.',
    speaker: 'andy',
    explanation: '8 − 3 = 5, and 5 − 2 = 3!'
  },
  {
    id: 'lvl8_q06',
    levelNumber: 8,
    questionType: 'multi_step',
    text: 'First add (6 + 3), then subtract 4: (6 + 3) − 4 = ?',
    correctAnswer: 5,
    options: [5, 6, 4],
    illustration: {
      type: 'formula',
      formulaDisplay: '(6 + 3) − 4 = ?\nStep 1: 6 + 3 = 9\nStep 2: 9 − 4 = ?'
    },
    hint: 'Step 1: 6 + 3 = 9. Step 2: 9 − 4 = 5!',
    narration: 'First add six plus three, then subtract four.',
    speaker: 'sancho',
    explanation: '6 + 3 = 9, and 9 − 4 = 5!'
  },
  {
    id: 'lvl8_q07',
    levelNumber: 8,
    questionType: 'multi_step',
    text: 'First subtract (7 − 4), then add 5: (7 − 4) + 5 = ?',
    correctAnswer: 8,
    options: [8, 7, 9],
    illustration: {
      type: 'formula',
      formulaDisplay: '(7 − 4) + 5 = ?\nStep 1: 7 − 4 = 3\nStep 2: 3 + 5 = ?'
    },
    hint: 'Step 1: 7 − 4 = 3. Step 2: 3 + 5 = 8!',
    narration: 'First subtract seven minus four, then add five.',
    speaker: 'andy',
    explanation: '7 − 4 = 3, and 3 + 5 = 8!'
  },
  {
    id: 'lvl8_q08',
    levelNumber: 8,
    questionType: 'multi_step',
    text: 'First add (5 + 4), then subtract 3: (5 + 4) − 3 = ?',
    correctAnswer: 6,
    options: [6, 7, 5],
    illustration: {
      type: 'formula',
      formulaDisplay: '(5 + 4) − 3 = ?\nStep 1: 5 + 4 = 9\nStep 2: 9 − 3 = ?'
    },
    hint: 'Step 1: 5 + 4 = 9. Step 2: 9 − 3 = 6!',
    narration: 'First add five plus four, then subtract three.',
    speaker: 'sancho',
    explanation: '5 + 4 = 9, and 9 − 3 = 6!'
  },
  {
    id: 'lvl8_q09',
    levelNumber: 8,
    questionType: 'multi_step',
    text: 'First subtract (10 − 5), then add 4: (10 − 5) + 4 = ?',
    correctAnswer: 9,
    options: [9, 8, 10],
    illustration: {
      type: 'formula',
      formulaDisplay: '(10 − 5) + 4 = ?\nStep 1: 10 − 5 = 5\nStep 2: 5 + 4 = ?'
    },
    hint: 'Step 1: 10 − 5 = 5. Step 2: 5 + 4 = 9!',
    narration: 'First subtract ten minus five, then add four.',
    speaker: 'andy',
    explanation: '10 − 5 = 5, and 5 + 4 = 9!'
  },
  {
    id: 'lvl8_q10',
    levelNumber: 8,
    questionType: 'multi_step',
    text: 'First subtract (6 − 2), then add 6: (6 − 2) + 6 = ?',
    correctAnswer: 10,
    options: [10, 9, 8],
    illustration: {
      type: 'formula',
      formulaDisplay: '(6 − 2) + 6 = ?\nStep 1: 6 − 2 = 4\nStep 2: 4 + 6 = ?'
    },
    hint: 'Step 1: 6 − 2 = 4. Step 2: 4 + 6 = 10!',
    narration: 'First subtract six minus two, then add six.',
    speaker: 'sancho',
    explanation: '6 − 2 = 4, and 4 + 6 = 10!'
  }
];

export const LEVEL_9_QUESTIONS: MathQuestion[] = [
  {
    id: 'lvl9_q01',
    levelNumber: 9,
    questionType: 'grouping_multiplication',
    text: '2 baskets with 3 apples in each basket: 3 + 3 = ?',
    correctAnswer: 6,
    options: [6, 5, 7],
    illustration: {
      type: 'grouping',
      groups: [
        { label: 'Basket 1', count: 3, itemEmoji: '🍎' },
        { label: 'Basket 2', count: 3, itemEmoji: '🍎' }
      ],
      formulaDisplay: '2 groups of 3 = 3 + 3 = ?'
    },
    hint: 'Add 3 plus 3 to find the total: 6 apples!',
    narration: 'Two baskets with three apples in each. Three plus three equals how many?',
    speaker: 'andy',
    explanation: '2 groups of 3: 3 + 3 = 6 apples!'
  },
  {
    id: 'lvl9_q02',
    levelNumber: 9,
    questionType: 'grouping_multiplication',
    text: '3 nests with 2 baby birds in each: 2 + 2 + 2 = ?',
    correctAnswer: 6,
    options: [6, 5, 8],
    illustration: {
      type: 'grouping',
      groups: [
        { label: 'Nest 1', count: 2, itemEmoji: '🐣' },
        { label: 'Nest 2', count: 2, itemEmoji: '🐣' },
        { label: 'Nest 3', count: 2, itemEmoji: '🐣' }
      ],
      formulaDisplay: '3 groups of 2 = 2 + 2 + 2 = ?'
    },
    hint: 'Count by twos: 2, 4, 6 birds!',
    narration: 'Three nests with two baby birds each. Two plus two plus two equals what?',
    speaker: 'sancho',
    explanation: '3 groups of 2: 2 + 2 + 2 = 6 birds!'
  },
  {
    id: 'lvl9_q03',
    levelNumber: 9,
    questionType: 'grouping_multiplication',
    text: '4 pairs of shoes: 2 + 2 + 2 + 2 = ?',
    correctAnswer: 8,
    options: [8, 6, 10],
    illustration: {
      type: 'grouping',
      groups: [
        { label: 'Pair 1', count: 2, itemEmoji: '👟' },
        { label: 'Pair 2', count: 2, itemEmoji: '👟' },
        { label: 'Pair 3', count: 2, itemEmoji: '👟' },
        { label: 'Pair 4', count: 2, itemEmoji: '👟' }
      ],
      formulaDisplay: '4 pairs of 2 = 2 + 2 + 2 + 2 = ?'
    },
    hint: 'Count by twos four times: 2, 4, 6, 8 shoes!',
    narration: 'Four pairs of shoes. Two plus two plus two plus two equals how many?',
    speaker: 'andy',
    explanation: '4 groups of 2: 2 + 2 + 2 + 2 = 8 shoes!'
  },
  {
    id: 'lvl9_q04',
    levelNumber: 9,
    questionType: 'grouping_multiplication',
    text: '2 jars with 4 sweet candies in each: 4 + 4 = ?',
    correctAnswer: 8,
    options: [8, 7, 9],
    illustration: {
      type: 'grouping',
      groups: [
        { label: 'Jar 1', count: 4, itemEmoji: '🍬' },
        { label: 'Jar 2', count: 4, itemEmoji: '🍬' }
      ],
      formulaDisplay: '2 jars of 4 = 4 + 4 = ?'
    },
    hint: 'Double 4 is 8 candies!',
    narration: 'Two jars with four candies each. Four plus four equals how many?',
    speaker: 'sancho',
    explanation: '2 groups of 4: 4 + 4 = 8 candies!'
  },
  {
    id: 'lvl9_q05',
    levelNumber: 9,
    questionType: 'grouping_multiplication',
    text: '3 bunches with 3 flowers in each: 3 + 3 + 3 = ?',
    correctAnswer: 9,
    options: [9, 8, 10],
    illustration: {
      type: 'grouping',
      groups: [
        { label: 'Bunch 1', count: 3, itemEmoji: '🌸' },
        { label: 'Bunch 2', count: 3, itemEmoji: '🌸' },
        { label: 'Bunch 3', count: 3, itemEmoji: '🌸' }
      ],
      formulaDisplay: '3 bunches of 3 = 3 + 3 + 3 = ?'
    },
    hint: 'Count by threes: 3, 6, 9 flowers!',
    narration: 'Three bunches with three flowers each. Three plus three plus three equals what?',
    speaker: 'andy',
    explanation: '3 groups of 3: 3 + 3 + 3 = 9 flowers!'
  },
  {
    id: 'lvl9_q06',
    levelNumber: 9,
    questionType: 'grouping_multiplication',
    text: '2 packs with 5 pencils in each: 5 + 5 = ?',
    correctAnswer: 10,
    options: [10, 9, 11],
    illustration: {
      type: 'grouping',
      groups: [
        { label: 'Pack 1', count: 5, itemEmoji: '✏️' },
        { label: 'Pack 2', count: 5, itemEmoji: '✏️' }
      ],
      formulaDisplay: '2 packs of 5 = 5 + 5 = ?'
    },
    hint: 'Two groups of 5 make 10 pencils!',
    narration: 'Two packs with five pencils each. Five plus five equals how many?',
    speaker: 'sancho',
    explanation: '2 groups of 5: 5 + 5 = 10 pencils!'
  },
  {
    id: 'lvl9_q07',
    levelNumber: 9,
    questionType: 'grouping_multiplication',
    text: '4 plates with 3 cookies in each: 3 + 3 + 3 + 3 = ?',
    correctAnswer: 12,
    options: [12, 10, 15],
    illustration: {
      type: 'grouping',
      groups: [
        { label: 'Plate 1', count: 3, itemEmoji: '🍪' },
        { label: 'Plate 2', count: 3, itemEmoji: '🍪' },
        { label: 'Plate 3', count: 3, itemEmoji: '🍪' },
        { label: 'Plate 4', count: 3, itemEmoji: '🍪' }
      ],
      formulaDisplay: '4 plates of 3 = 3 + 3 + 3 + 3 = ?'
    },
    hint: 'Count by threes: 3, 6, 9, 12 cookies!',
    narration: 'Four plates with three cookies each. How many cookies in all?',
    speaker: 'andy',
    explanation: '4 groups of 3: 3 + 3 + 3 + 3 = 12 cookies!'
  },
  {
    id: 'lvl9_q08',
    levelNumber: 9,
    questionType: 'grouping_multiplication',
    text: '3 rows with 4 trees in each: 4 + 4 + 4 = ?',
    correctAnswer: 12,
    options: [12, 11, 14],
    illustration: {
      type: 'grouping',
      groups: [
        { label: 'Row 1', count: 4, itemEmoji: '🌲' },
        { label: 'Row 2', count: 4, itemEmoji: '🌲' },
        { label: 'Row 3', count: 4, itemEmoji: '🌲' }
      ],
      formulaDisplay: '3 rows of 4 = 4 + 4 + 4 = ?'
    },
    hint: '4 + 4 is 8, and 8 + 4 is 12 trees!',
    narration: 'Three rows with four trees in each row. How many trees altogether?',
    speaker: 'sancho',
    explanation: '3 groups of 4: 4 + 4 + 4 = 12 trees!'
  },
  {
    id: 'lvl9_q09',
    levelNumber: 9,
    questionType: 'grouping_multiplication',
    text: '5 pairs of cozy socks: 2 + 2 + 2 + 2 + 2 = ?',
    correctAnswer: 10,
    options: [10, 8, 12],
    illustration: {
      type: 'grouping',
      groups: [
        { label: 'Pair 1', count: 2, itemEmoji: '🧦' },
        { label: 'Pair 2', count: 2, itemEmoji: '🧦' },
        { label: 'Pair 3', count: 2, itemEmoji: '🧦' },
        { label: 'Pair 4', count: 2, itemEmoji: '🧦' },
        { label: 'Pair 5', count: 2, itemEmoji: '🧦' }
      ],
      formulaDisplay: '5 pairs of 2 = 2 + 2 + 2 + 2 + 2 = ?'
    },
    hint: 'Count by twos 5 times: 2, 4, 6, 8, 10 socks!',
    narration: 'Five pairs of socks. How many socks in total?',
    speaker: 'andy',
    explanation: '5 groups of 2: 2 + 2 + 2 + 2 + 2 = 10 socks!'
  },
  {
    id: 'lvl9_q10',
    levelNumber: 9,
    questionType: 'grouping_multiplication',
    text: '3 boxes with 5 bouncy balls in each: 5 + 5 + 5 = ?',
    correctAnswer: 15,
    options: [15, 12, 16],
    illustration: {
      type: 'grouping',
      groups: [
        { label: 'Box 1', count: 5, itemEmoji: '⚽' },
        { label: 'Box 2', count: 5, itemEmoji: '⚽' },
        { label: 'Box 3', count: 5, itemEmoji: '⚽' }
      ],
      formulaDisplay: '3 boxes of 5 = 5 + 5 + 5 = ?'
    },
    hint: 'Count by fives: 5, 10, 15 balls!',
    narration: 'Three boxes with five bouncy balls in each. How many balls in total?',
    speaker: 'sancho',
    explanation: '3 groups of 5: 5 + 5 + 5 = 15 balls!'
  }
];

export const LEVEL_10_QUESTIONS: MathQuestion[] = [
  {
    id: 'lvl10_q01',
    levelNumber: 10,
    questionType: 'word_problem',
    text: 'Andy baked 5 strawberry cookies. Sancho ate 2 cookies. How many cookies does Andy have left?',
    correctAnswer: 3,
    options: [3, 2, 4],
    illustration: {
      type: 'story',
      storyScene: { character: 'andy', setting: 'Kitchen Table', heroItem: '🍪' },
      items: [
        { emoji: '🍪', label: '5 cookies', count: 5 },
        { emoji: '😋', label: '2 eaten', count: 2 }
      ],
      formulaDisplay: '5 cookies − 2 eaten = ?'
    },
    hint: 'Start with 5 and take away 2: 5 − 2 = 3!',
    narration: 'Andy baked five strawberry cookies. Sancho ate two cookies. How many cookies does Andy have left?',
    speaker: 'andy',
    explanation: '5 − 2 = 3 cookies left for Andy!'
  },
  {
    id: 'lvl10_q02',
    levelNumber: 10,
    questionType: 'word_problem',
    text: 'Sancho collected 4 shiny blue pebbles. Osi brought him 3 more pebbles. How many pebbles does Sancho have now?',
    correctAnswer: 7,
    options: [7, 6, 8],
    illustration: {
      type: 'story',
      storyScene: { character: 'sancho', setting: 'Riverbank', heroItem: '💎' },
      items: [
        { emoji: '💎', label: '4 pebbles', count: 4 },
        { emoji: '🐶', label: '3 from Osi', count: 3 }
      ],
      formulaDisplay: '4 pebbles + 3 pebbles = ?'
    },
    hint: 'Add 4 plus 3 to find all the pebbles!',
    narration: 'Sancho collected four shiny pebbles. Osi brought him three more. How many pebbles does Sancho have now?',
    speaker: 'sancho',
    explanation: '4 + 3 = 7 pebbles in all!'
  },
  {
    id: 'lvl10_q03',
    levelNumber: 10,
    questionType: 'word_problem',
    text: 'Osi had 6 squeaky bone toys in his basket. He hid 2 in the sunny garden. How many squeaky bones remain in his basket?',
    correctAnswer: 4,
    options: [4, 3, 5],
    illustration: {
      type: 'story',
      storyScene: { character: 'osi', setting: 'Sunny Garden', heroItem: '🦴' },
      items: [
        { emoji: '🦴', label: '6 bones', count: 6 },
        { emoji: '🌿', label: '2 hidden', count: 2 }
      ],
      formulaDisplay: '6 bones − 2 hidden = ?'
    },
    hint: 'Take 2 away from 6: 6 − 2 = 4!',
    narration: 'Osi had six squeaky bone toys. He hid two in the garden. How many squeaky bones remain in his basket?',
    speaker: 'andy',
    explanation: '6 − 2 = 4 bones remaining in the basket!'
  },
  {
    id: 'lvl10_q04',
    levelNumber: 10,
    questionType: 'word_problem',
    text: 'Andy had 3 colored pencils. Sancho gave her 4 pencils, and then Andy found 1 more on the desk. How many pencils does Andy have in total?',
    correctAnswer: 8,
    options: [8, 7, 9],
    illustration: {
      type: 'story',
      storyScene: { character: 'andy', setting: 'Art Station', heroItem: '✏️' },
      items: [
        { emoji: '✏️', label: '3 start', count: 3 },
        { emoji: '✏️', label: '4 from Sancho', count: 4 },
        { emoji: '✏️', label: '1 found', count: 1 }
      ],
      formulaDisplay: '3 + 4 + 1 = ?'
    },
    hint: 'First 3 + 4 = 7, then add 1 more = 8 pencils!',
    narration: 'Andy had three pencils. Sancho gave her four, and she found one more. How many pencils in total?',
    speaker: 'sancho',
    explanation: '3 + 4 = 7, and 7 + 1 = 8 pencils!'
  },
  {
    id: 'lvl10_q05',
    levelNumber: 10,
    questionType: 'word_problem',
    text: 'Sancho had 9 star stickers. He gave 3 to Andy and 2 to Osi. How many star stickers does Sancho have left?',
    correctAnswer: 4,
    options: [4, 5, 3],
    illustration: {
      type: 'story',
      storyScene: { character: 'sancho', setting: 'Study Desk', heroItem: '⭐' },
      items: [
        { emoji: '⭐', label: '9 start', count: 9 },
        { emoji: '👧🏽', label: '3 to Andy', count: 3 },
        { emoji: '🐶', label: '2 to Osi', count: 2 }
      ],
      formulaDisplay: '9 − 3 − 2 = ?'
    },
    hint: 'First 9 − 3 = 6. Then 6 − 2 = 4 stickers!',
    narration: 'Sancho had nine star stickers. He gave three to Andy and two to Osi. How many does he have left?',
    speaker: 'andy',
    explanation: '9 − 3 = 6, then 6 − 2 = 4 stickers remaining!'
  },
  {
    id: 'lvl10_q06',
    levelNumber: 10,
    questionType: 'word_problem',
    text: 'Andy saw 4 green frogs on a lily pad. 3 more frogs hopped on. Then 1 frog jumped into the water. How many frogs are on the lily pad now?',
    correctAnswer: 6,
    options: [6, 5, 7],
    illustration: {
      type: 'story',
      storyScene: { character: 'team', setting: 'Lilypad Pond', heroItem: '🐸' },
      items: [
        { emoji: '🐸', label: '4 start', count: 4 },
        { emoji: '🐸', label: '3 hopped on', count: 3 },
        { emoji: '💦', label: '1 jumped off', count: 1 }
      ],
      formulaDisplay: '4 + 3 − 1 = ?'
    },
    hint: 'First 4 + 3 = 7 frogs. Then 7 − 1 = 6 frogs!',
    narration: 'Four frogs were on a lily pad. Three hopped on, then one jumped into the water. How many are left?',
    speaker: 'sancho',
    explanation: '4 + 3 = 7, and 7 − 1 = 6 frogs!'
  },
  {
    id: 'lvl10_q07',
    levelNumber: 10,
    questionType: 'word_problem',
    text: 'Sancho and Andy prepared 10 apple slices for a picnic. Osi happily ate 3 slices, and Sancho ate 2 slices. How many slices are left for Andy?',
    correctAnswer: 5,
    options: [5, 4, 6],
    illustration: {
      type: 'story',
      storyScene: { character: 'team', setting: 'Picnic Blanket', heroItem: '🍎' },
      items: [
        { emoji: '🍎', label: '10 slices', count: 10 },
        { emoji: '🐶', label: '3 eaten by Osi', count: 3 },
        { emoji: '👦🏾', label: '2 eaten by Sancho', count: 2 }
      ],
      formulaDisplay: '10 − 3 − 2 = ?'
    },
    hint: '10 − 3 = 7, and 7 − 2 = 5 slices left!',
    narration: 'They had ten apple slices. Osi ate three slices and Sancho ate two. How many slices are left?',
    speaker: 'andy',
    explanation: '10 − 3 = 7, and 7 − 2 = 5 slices!'
  },
  {
    id: 'lvl10_q08',
    levelNumber: 10,
    questionType: 'word_problem',
    text: 'Andy has 2 gift boxes. Each box has 4 shiny crystals inside. How many crystals does Andy have in both boxes?',
    correctAnswer: 8,
    options: [8, 6, 10],
    illustration: {
      type: 'story',
      storyScene: { character: 'andy', setting: 'Crystal Castle', heroItem: '🎁' },
      items: [
        { emoji: '🎁', label: 'Box 1: 4 gems', count: 4 },
        { emoji: '🎁', label: 'Box 2: 4 gems', count: 4 }
      ],
      formulaDisplay: '4 + 4 = ?'
    },
    hint: 'Add 4 and 4 together: 4 + 4 = 8 crystals!',
    narration: 'Andy has two boxes. Each box has four crystals. How many crystals does she have altogether?',
    speaker: 'sancho',
    explanation: '2 boxes of 4: 4 + 4 = 8 crystals in all!'
  },
  {
    id: 'lvl10_q09',
    levelNumber: 10,
    questionType: 'word_problem',
    text: 'Sancho had 12 books in his backpack. He lent 4 books to Andy and 3 books to the village library. How many books remain in Sancho’s backpack?',
    correctAnswer: 5,
    options: [5, 6, 4],
    illustration: {
      type: 'story',
      storyScene: { character: 'sancho', setting: 'Library Steps', heroItem: '📚' },
      items: [
        { emoji: '📚', label: '12 books', count: 12 },
        { emoji: '👧🏽', label: '4 to Andy', count: 4 },
        { emoji: '🏛️', label: '3 to library', count: 3 }
      ],
      formulaDisplay: '12 − 4 − 3 = ?'
    },
    hint: 'First 12 − 4 = 8 books. Then 8 − 3 = 5 books!',
    narration: 'Sancho had twelve books. He lent four to Andy and three to the library. How many books remain in his backpack?',
    speaker: 'andy',
    explanation: '12 − 4 = 8, and 8 − 3 = 5 books remaining!'
  },
  {
    id: 'lvl10_q10',
    levelNumber: 10,
    questionType: 'word_problem',
    text: 'The adventure team needs 10 keys for the Math Master Island chest. Andy found 4 keys, Sancho found 3 keys, and Osi dug up 3 keys. How many keys did they collect altogether?',
    correctAnswer: 10,
    options: [10, 9, 8],
    illustration: {
      type: 'story',
      storyScene: { character: 'team', setting: 'Math Master Island', heroItem: '🗝️' },
      items: [
        { emoji: '👧🏽', label: 'Andy: 4 keys', count: 4 },
        { emoji: '👦🏾', label: 'Sancho: 3 keys', count: 3 },
        { emoji: '🐶', label: 'Osi: 3 keys', count: 3 }
      ],
      formulaDisplay: '4 + 3 + 3 = ?'
    },
    hint: 'First 4 + 3 = 7. Then 7 + 3 = 10 keys! The chest opens!',
    narration: 'Andy found four keys, Sancho found three keys, and Osi dug up three keys. How many keys in all?',
    speaker: 'andy',
    explanation: '4 + 3 + 3 = 10 keys! The Grand Treasure Chest is unlocked!'
  }
];

export const LEVEL_BANKS: LevelQuestionBank[] = [
  {
    levelNumber: 1,
    levelTitle: 'First Addition',
    topic: 'Addition with totals no greater than 5',
    description: 'Basic one-to-one addition with totals up to 5.',
    questions: LEVEL_1_QUESTIONS
  },
  {
    levelNumber: 2,
    levelTitle: 'Counting and Addition',
    topic: 'Count objects and add quantities up to 10',
    description: 'Count apples, frogs, stars, and daisies with totals within 10.',
    questions: LEVEL_2_QUESTIONS
  },
  {
    levelNumber: 3,
    levelTitle: 'Basic Subtraction',
    topic: 'Take objects away with nonnegative answers',
    description: 'Demonstrations of taking objects away with answers 0 or higher.',
    questions: LEVEL_3_QUESTIONS
  },
  {
    levelNumber: 4,
    levelTitle: 'Mixed Operations',
    topic: 'Mix basic addition and subtraction within 10',
    description: 'Alternating addition and subtraction facts up to 10.',
    questions: LEVEL_4_QUESTIONS
  },
  {
    levelNumber: 5,
    levelTitle: 'Missing Numbers',
    topic: 'Find the unknown in addition and subtraction',
    description: 'Equations with missing addends or subtrahends (e.g. 3 + ? = 5).',
    questions: LEVEL_5_QUESTIONS
  },
  {
    levelNumber: 6,
    levelTitle: 'Addition and Subtraction to 20',
    topic: 'Visual aids and operations within 20',
    description: 'Sums and differences up to 20 with number breakdown.',
    questions: LEVEL_6_QUESTIONS
  },
  {
    levelNumber: 7,
    levelTitle: 'Patterns and Sequences',
    topic: 'Complete numerical, color, shape, and object patterns',
    description: 'AB, ABC, skip counting, and repeating sequences.',
    questions: LEVEL_7_QUESTIONS
  },
  {
    levelNumber: 8,
    levelTitle: 'Multi-Step Math',
    topic: 'Two simple operations in an unambiguous sequence',
    description: 'Step-by-step sequential operations (e.g., (2 + 2) + 1).',
    questions: LEVEL_8_QUESTIONS
  },
  {
    levelNumber: 9,
    levelTitle: 'Grouping and Early Multiplication',
    topic: 'Equal groups and repeated addition',
    description: 'Equal sets and repeated addition before formal multiplication symbols.',
    questions: LEVEL_9_QUESTIONS
  },
  {
    levelNumber: 10,
    levelTitle: 'Math Word Problems',
    topic: 'Illustrated stories with Andy, Sancho, and Osi',
    description: 'Context-rich illustrated story problems with one unambiguous answer.',
    questions: LEVEL_10_QUESTIONS
  }
];

/**
 * Retrieve questions for any level number (1 through 10)
 */
export function getQuestionsForLevel(levelNumber: number): MathQuestion[] {
  const bank = LEVEL_BANKS.find((b) => b.levelNumber === levelNumber);
  return bank ? bank.questions : [];
}

/**
 * Find any question by unique ID
 */
export function getQuestionById(id: string): MathQuestion | undefined {
  for (const bank of LEVEL_BANKS) {
    const found = bank.questions.find((q) => q.id === id);
    if (found) return found;
  }
  return undefined;
}

/**
 * Validate an answer deterministically without any AI call
 */
export function validateAnswer(
  questionId: string,
  userAnswer: string | number
): {
  isCorrect: boolean;
  correctAnswer: string | number;
  explanation?: string;
  hint: string;
} {
  const question = getQuestionById(questionId);
  if (!question) {
    return {
      isCorrect: false,
      correctAnswer: '',
      hint: 'Question not found.'
    };
  }

  const isCorrect = String(userAnswer).trim() === String(question.correctAnswer).trim();
  return {
    isCorrect,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    hint: question.hint
  };
}

/**
 * Programmatic Validation Function for the entire question bank.
 * Verifies all requirements:
 * 1. Exactly 10 levels (1 to 10).
 * 2. Exactly 10 questions per level.
 * 3. All question IDs are globally unique.
 * 4. Exactly 3 distinct options per question.
 * 5. Exactly 1 option matches correctAnswer.
 * 6. Correct answer is present in options.
 * 7. Non-negative results.
 * 8. Word problems contain valid text and one unambiguous answer.
 */
export function validateQuestionBank(): QuestionBankValidationResult {
  const errors: string[] = [];
  const levelCounts: Record<number, number> = {};
  const seenIds = new Set<string>();

  let totalQuestions = 0;

  for (let lvl = 1; lvl <= 10; lvl++) {
    const bank = LEVEL_BANKS.find((b) => b.levelNumber === lvl);
    if (!bank) {
      errors.push(`Level ${lvl} bank is missing.`);
      levelCounts[lvl] = 0;
      continue;
    }

    levelCounts[lvl] = bank.questions.length;
    if (bank.questions.length !== 10) {
      errors.push(`Level ${lvl} has ${bank.questions.length} questions, expected exactly 10.`);
    }

    bank.questions.forEach((q, idx) => {
      totalQuestions++;

      // Unique ID check
      if (seenIds.has(q.id)) {
        errors.push(`Duplicate question ID found: ${q.id} at Level ${lvl} index ${idx}`);
      }
      seenIds.add(q.id);

      // Level number check
      if (q.levelNumber !== lvl) {
        errors.push(`Question ${q.id} has levelNumber ${q.levelNumber}, expected ${lvl}`);
      }

      // Exactly 3 options check
      if (!Array.isArray(q.options) || q.options.length !== 3) {
        errors.push(`Question ${q.id} must have exactly 3 options. Found: ${q.options?.length}`);
      }

      // Distinct options check (no duplicates)
      const stringifiedOptions = (q.options || []).map((o) => String(o).trim());
      const uniqueOptions = new Set(stringifiedOptions);
      if (uniqueOptions.size !== 3) {
        errors.push(`Question ${q.id} contains duplicate options: ${JSON.stringify(q.options)}`);
      }

      // Correct answer in options
      const targetStr = String(q.correctAnswer).trim();
      const matches = stringifiedOptions.filter((opt) => opt === targetStr);
      if (matches.length !== 1) {
        errors.push(
          `Question ${q.id} must have exactly one matching correct answer in options. Matches: ${matches.length} for answer: ${q.correctAnswer}`
        );
      }

      // Nonnegative check where numeric
      if (typeof q.correctAnswer === 'number' && q.correctAnswer < 0) {
        errors.push(`Question ${q.id} has invalid negative correct answer: ${q.correctAnswer}`);
      }

      // Text and hint presence
      if (!q.text || q.text.trim().length === 0) {
        errors.push(`Question ${q.id} is missing text.`);
      }
      if (!q.hint || q.hint.trim().length === 0) {
        errors.push(`Question ${q.id} is missing a gentle hint.`);
      }
      if (!q.narration || q.narration.trim().length === 0) {
        errors.push(`Question ${q.id} is missing narration.`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    totalQuestions,
    levelCounts,
    errors
  };
}
