export interface Exam {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  duration: number;
  passingScore?: number;
  questions: Question[];
  isActive?: boolean;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Question {
  _id?: string;
  id?: string;
  question: string;
  text?: string; // For backward compatibility
  type?: string; // For backward compatibility
  points?: number; // For backward compatibility
  options: Option[];
}

export interface Option {
  _id?: string;
  id?: string;
  text: string;
  isCorrect: boolean;
}