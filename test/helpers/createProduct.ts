import { Product } from "../model/Product";
import { v4 } from 'uuid'

export const createProduct = (product:Partial<Product>) =>({
    id: v4(),
    name: `product-name-${v4()}`,
    description: `product-description-${v4()}`,
    price: Math.random() * 50,
    createdAt: new Date(),
    ...product
});
