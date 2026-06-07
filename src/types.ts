export interface LessonMeta {
  id: string;
  chapter: string;
  title: string;
  level: string;
  description: string;
  content_file: string;
}

export interface Vocabulary {
  word: string;
  pronunciation: string;
  meaning: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
}

export interface LessonData {
  theory_html: string;
  vocabulary: Vocabulary[];
  quiz: QuizQuestion[];
}
