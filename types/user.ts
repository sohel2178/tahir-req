export type Role = "admin" | "manager" | "user";

export interface User {
  _id?: string; // use string for MongoDB ObjectId
  id: string;
  email: string;
  name: string;
  role: Role;
  contact?: string;
  organization_name?: string;
  address?: string;
  image?: string;
  token?: string; // FCM token
  managerId?: string; // if manager created this user
}
