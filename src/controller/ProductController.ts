import { v4 } from 'uuid'
import { Body, Controller, Delete, Get, Path, Post, Put, Response, Route, Security, SuccessResponse, Tags } from "tsoa";

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    createdAt: Date;
}

export interface NewProduct extends Omit<Product, "id" | "createdAt"> {}

export type ProductReqBody = {
    product: NewProduct
}

export type ProductResBody = {
    product: Product
}

@Route("product")
export class ProductController extends Controller {
    @SuccessResponse("201", "Created")
    @Post()
    public async postProduct(@Body() reqBody: ProductReqBody): Promise<ProductResBody>{
        return Promise.resolve({
            product: {
                ...reqBody.product,
                id: v4(),
                createdAt: new Date(),
            },
        });
    }
}
