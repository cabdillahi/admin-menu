export interface Category {
  id: number;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  tenantId: string;
  createAt: string;
  updateAt: string;
}

export interface GetAllCategoriesResponse {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: Category[];
}

export interface CategoryInput {
  name: string;
  description?: string;
  imageUrl?: string;
}
