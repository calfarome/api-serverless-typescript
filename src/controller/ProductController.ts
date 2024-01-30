import { v4 } from 'uuid'
import { Body, Controller, Delete, Get, Path, Post, Put, Response, Route, Security, SuccessResponse, Tags } from "tsoa";

import { NewProduct } from '../model/NewProduct';
import { Product } from '../model/Product';
import { ProductsRepository } from '../repository/ProductRepository';
import { provideSingleton } from '../util/provideSingleton';
import { inject } from "inversify";
import { ApiError } from "../ApiError"


export type ProductReqBody = {
    product: NewProduct
}

export type ProductResBody = {
    product: Product
}

@Route("product")
@provideSingleton(ProductController)
export class ProductController extends Controller {

    constructor(@inject("ProductsRepository") private productsRepository: ProductsRepository) {
        super();
    };

    // GET METHOD
    @Get("{id}")
     public async getProduct(@Path("id") id: string): Promise<ProductResBody> {

        const product = await  this.productsRepository.fetchById(id);

        if(!product) {
            throw new ApiError({
                statusCode:404,
                type:"PRODUCT_NOT_FOUND",
            })
        }

        return {product}
     }

    //POST METHOD
    @SuccessResponse("201", "Created")
    @Post()
    public async postProduct(@Body() reqBody: ProductReqBody): Promise<ProductResBody> {

        // Mando crear
        const product = await this.productsRepository.create(reqBody.product)

        // Retornamos
        return { product };
    }
}
