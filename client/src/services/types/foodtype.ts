export interface FoodInput {
  name: string;
  price: number;
  category: string;
  status?: string;
}

export interface Food {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  categoryId: number;
  client: string;
  tenantId: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: number;
    name: string;
  };
  Tenant?: {
    id: string;
    name: string;
    currency:string
  };
}

export interface GetAllFoodsResponse {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: Food[];
}
