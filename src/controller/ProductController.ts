import { v4 } from 'uuid'
import { Body, Controller, Delete, Get, Path, Post, Put, Response, Route, Security, SuccessResponse, Tags } from "tsoa";
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { NewProduct } from '../model/NewProduct';
import { Product } from '../model/Product';
import { ProductsRepositoryDynamoDB } from '../repository/ProductsRepositoryDynamoDB';
import { ProductsRepository } from '../repository/ProductRepository';
import { provideSingleton } from '../util/provideSingleton';
import { inject } from "inversify";


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
