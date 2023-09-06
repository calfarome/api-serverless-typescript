import { v4 } from 'uuid'
import { Body, Controller, Delete, Get, Path, Post, Put, Response, Route, Security, SuccessResponse, Tags } from "tsoa";
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

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

        // Creamos datos
        const product = {
                ...reqBody.product,
                id: v4(),
                createdAt: new Date(),
            }

        // Inilizamos conección
        const client = new DynamoDBClient({
            endpoint:"http://localhost:8000",
            region: "us-east-1",
        });

        // Mandamos insertar datos
 
       

        try {
            await client.send(new PutItemCommand({
                TableName:"Product",
                Item:{
                    ProductID: {S:product.id},
                    Name: {S:product.name},
                    Description: {S:product.description},
                    Price: {N:String(product.price)},
                    CreatedAt: {N:product.createdAt.getTime().toString()},
                }
            }));
            // process data.
          } catch (error) {
            // error handling.
            console.error(error);
          } finally {
            // finally.
          }
        
        // Retornamos
        return Promise.resolve({
            product,
        });
    }
}
