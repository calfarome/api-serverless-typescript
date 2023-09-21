import { Product } from "./Product";

export interface NewProduct extends Omit<Product, "id" | "createdAt"> {}