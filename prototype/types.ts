export interface User {
  name: string;
}

export interface QuestionnaireAnswers {
  [key: string]: string;
}

export interface Associations {
  [key: string]: string;
}

export interface ProfileData {
  portrait: string;
  associations: Associations;
  chatHistory?: ChatMessage[];
}

export interface Friend {
  id: string;
  name: string;
  profile: ProfileData;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}
