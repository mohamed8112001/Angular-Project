export interface examResponse {
  _id: string;
  title: string;
  description: string;
  duration: number;
  questions: {
    _id: string;
    question: string;
    options: {
      _id: string;
      text: string;
      isCorrect: boolean;
    }[];
  }[];
  createdBy: string;
  createdAt:string;
  updatedAt:string
}
