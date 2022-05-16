export interface User extends NewUser {
  _id: string;
  createdAt: Date;
  updatedAt?: Date;
  token?: string;
}

export interface NewUser {
  email: string;
  password: string;
}
