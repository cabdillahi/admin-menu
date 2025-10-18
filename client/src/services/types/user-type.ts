export interface User {
  id: string;
  name: string;
  email: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  // Tenant relation for display purposes
  tenant?: {
    id: string;
    name: string;
  };
}

export interface UserInput {
  name: string;
  email: string;
  password: string;
  tenantId: string;
}

export interface UserUpdate {
  id: string;
  name?: string;
  email?: string;
  password?: string;
  tenantId?: string;
}

export interface UserResponseData {
  data: User[];
}
