const COMPLETED_KEY = 'completed_lessons';

export function markComplete(lessonId: string) {
  const completed = getCompletionStatus();
  if (!completed.includes(lessonId)) {
    completed.push(lessonId);
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(completed));
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
