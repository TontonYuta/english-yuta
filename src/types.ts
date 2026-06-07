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
  extra?: string;
  example?: string;
  example_translation?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation?: string;
}

export interface LessonData {
  theory_html: string;
  vocabulary: Vocabulary[];
  quiz: QuizQuestion[];
}
