
import { create } from "zustand";
import initialProducts from "../../data/products.json";
import { Product } from "../types/product";

type ProductStore = {
    products: Product[];
    deleteProduct: (productId: string) => void;
    updateProductsStatus: (orderNumber: number, status: string) => void;
};

export const useProductStore = create<ProductStore>()((set) => ({
    products: initialProducts,
    deleteProduct: (productId: string) => {
        set((state) => ({
            products: state.products.filter((product) => product.id !== productId),
        }));
    },
    updateProductsStatus: (orderNumber: number, status: string) => {
        set((state) => ({
            products: state.products.map((product) =>
                product.NoOrder === orderNumber ? { ...product, status } : product,
            ),
        }));
    },
}));
