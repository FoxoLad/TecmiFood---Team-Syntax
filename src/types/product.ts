export type Product = {
  NoOrder?: number;
  id: string;
  businessId: string;
  name: string;
  description: string;
  modifications?: string | { name: string; price: number }[];
  price: number;
  image: string;
  status?: string;
  category: string;
};
