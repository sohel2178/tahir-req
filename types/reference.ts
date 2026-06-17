export interface Reference {
  id: string;
  name: string;
  username: string;
  contact: string;
  address: string;
  createdBy: string;
  // password is never returned, but we allow it on forms
  password?: string;
}
