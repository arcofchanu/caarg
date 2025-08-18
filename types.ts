
export interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}
