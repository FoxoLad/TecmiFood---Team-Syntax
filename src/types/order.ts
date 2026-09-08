// src/types/order.ts
import { Product } from '../types/product';

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered';

export interface OrderItem {
    product: Product;
    quantity: number;
}

export interface Order {
    id: string;
    customerName: string;
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    createdAt: string;
}
