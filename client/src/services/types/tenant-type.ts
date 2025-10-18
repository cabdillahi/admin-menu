export interface Tenant {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  website: string;
  logo: string;
  subdomain: string;
  address?: string;
  city: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface TenantInput {
  name: string;
  email?: string;
  subdomain: string;
  phone?: string;
  city: string;
  currency: string;
  address?: string;
  website?: string;
  logo?: string;
}

export interface TenantUpdate {
  id: string;
  name: string;
  subdomain?: string;
  city: string;
  currency: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  logo?: string;
}
