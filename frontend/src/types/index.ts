export interface User {
  _id: string;
  username: string;
  email: string;
  profileImage?: string;
  isActive: boolean;
}

export interface Message {
  _id: string;
  senderId: string;
  isSender: boolean;
  text: string;
  image?: string;
}

export interface NewMessage {
  text: string;
  image?: File | null;
}

export interface LoginData {
  email?: string;
  password?: string;
}

export interface SignupData extends LoginData {
  username?: string;
}
