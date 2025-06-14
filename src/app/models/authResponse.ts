export interface authResponse {
  token: string;
  user: {
    _id: string;
    username: string;
    email: string;
    password: string;
    role: string;
  };
}
