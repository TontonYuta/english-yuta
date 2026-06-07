import { ErrorItem } from '../types';

const COMPLETED_KEY = 'completed_lessons';
const ERRORS_KEY = 'error_notebook';
const STREAK_KEY = 'daily_streak';

export function markComplete(lessonId: string) {
  const completed = getCompletionStatus();
  if (!completed.includes(lessonId)) {
    completed.push(lessonId);
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(completed));
  }
  updateStreak();
}

export function updateStreak() {
  try {
    const today = new Date().toLocaleDateString('en-CA');
    const data = localStorage.getItem(STREAK_KEY);
    const streakData = data ? JSON.parse(data) : { lastDate: null, streak: 0 };

    if (streakData.lastDate === today) return; // already did today

    // Yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString('en-CA');

    if (streakData.lastDate === yesterdayStr) {
      streakData.streak += 1;
    } else {
      streakData.streak = 1;
    }
    streakData.lastDate = today;
    localStorage.setItem(STREAK_KEY, JSON.stringify(streakData));
  } catch (e) {
    console.error(e);
  }
}

export function getStreak() {
  try {
    const data = localStorage.getItem(STREAK_KEY);
    return data ? JSON.parse(data) : { lastDate: null, streak: 0 };
  } catch {
    return { lastDate: null, streak: 0 };
  }
}

export function saveError(error: Omit<ErrorItem, "id" | "timestamp">) {
  try {
    const errors = getErrors();
    // avoid exact duplicate question
    const exists = errors.find((e: ErrorItem) => e.question === error.question);
    if (exists) return;
    
    const newError: ErrorItem = {
      ...error,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
    errors.push(newError);
    localStorage.setItem(ERRORS_KEY, JSON.stringify(errors));
  } catch (e) {
    console.error(e);
  }
}

export function getErrors(): ErrorItem[] {
  try {
    const data = localStorage.getItem(ERRORS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function removeError(id: string) {
  try {
    const errors = getErrors().filter((e: ErrorItem) => e.id !== id);
    localStorage.setItem(ERRORS_KEY, JSON.stringify(errors));
  } catch (e) {
    console.error(e);
  }
}

export function getCompletionStatus(): string[] {
  try {
    const data = localStorage.getItem(COMPLETED_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function isLessonComplete(lessonId: string): boolean {
  return getCompletionStatus().includes(lessonId);
}
