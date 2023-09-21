import { NewProduct } from "../model/NewProduct";
import { Product } from "../model/Product";

export interface ProductsRepository {
    create(newProduct: NewProduct): Promise<Product>;
}