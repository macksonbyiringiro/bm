
export type Role = 'user' | 'assistant';

export interface Message {
  id: string;
  role: Role;
  text: string;
}

// History for the Gemini API
export interface ChatHistory {
    role: "user" | "model";
    parts: { text: string }[];
}
