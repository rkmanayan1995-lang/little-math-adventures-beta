/**
 * Parent Confirmation Step & Security Gate
 * Protects healthy screen-time limits and timer resets from accidental child modification.
 */

export interface ParentChallenge {
  id: string;
  factor1: number;
  factor2: number;
  expectedAnswer: number;
  questionText: string;
  hintText: string;
}

export class ParentSecurityGate {
  private static activeChallenge: ParentChallenge | null = null;

  /**
   * Generate a fresh adult multiplication challenge
   */
  public static generateChallenge(): ParentChallenge {
    // Adult-oriented multiplication (e.g., 6..9 x 6..9)
    const factor1 = Math.floor(Math.random() * 4) + 6; // 6, 7, 8, 9
    const factor2 = Math.floor(Math.random() * 4) + 6; // 6, 7, 8, 9
    const expectedAnswer = factor1 * factor2;

    const challenge: ParentChallenge = {
      id: `pc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      factor1,
      factor2,
      expectedAnswer,
      questionText: `What is ${factor1} × ${factor2}?`,
      hintText: 'For grown-ups: Solve this math problem to change screen-time settings.'
    };

    this.activeChallenge = challenge;
    return challenge;
  }

  /**
   * Verify parent answer
   */
  public static verifyAnswer(userAnswer: string | number, challenge?: ParentChallenge): boolean {
    const active = challenge || this.activeChallenge;
    if (!active) return false;

    const parsed = typeof userAnswer === 'number' ? userAnswer : parseInt(String(userAnswer).trim(), 10);
    if (isNaN(parsed)) return false;

    return parsed === active.expectedAnswer;
  }
}
