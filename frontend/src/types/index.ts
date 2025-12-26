export interface User {
  _id: string;
  username: string;
  email: string;
  profilePic?: string;
}

export interface LoginData {
  email?: string;
  password?: string;
}

export interface SignupData extends LoginData {
  username?: string;
}
