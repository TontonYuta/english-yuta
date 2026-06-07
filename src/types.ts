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
  pronunciation?: string;
  meanings: string[];
  phrase_example?: string;
  phrase_translation?: string;
  sentence_example?: string;
  sentence_translation?: string;
}

export interface ErrorItem {
  id: string;
  question: string;
  wrong_answer: string;
  correct_answer: string;
  explanation: string;
  timestamp: string;
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
