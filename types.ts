
export type { GenerateContentParameters } from '@google/genai';

export type Role = 'user' | 'assistant';

export interface Message {
  id: string;
  role: Role;
  text: string;
  image?: string;
}
