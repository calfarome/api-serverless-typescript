import { request } from "../helpers/app";
import { v4 } from 'uuid'
import { AttributeValue, GetItemCommand, PutItemCommand, DynamoDBClient, CreateTableCommand, DeleteItemCommand, DeleteTableCommand } from "@aws-sdk/client-dynamodb";
import { createProductsTable, deleteProductsTable, client } from "../helpers/productsTable";
import config from "config";

// Probar test
describe('Products', () => {
    describe('POST/product', () => {

        // Creamos tabla
        beforeAll(async()=>{
            await createProductsTable();       
        });     

        // Al final eliminamos tablas
        afterAll(async () => {
            await deleteProductsTable();
        });

        it('should repond with a 201 status code', async () => {

            const reqBody = {
                product: {
                    name: `product-name-${v4()}`,
                    description: `product-description-${v4()}`,
                    price: Math.random() * 50,
                }
            }

            const expextedResBody = {
                product: {
                    ...reqBody.product,
                    id: expect.anything(),
                    createdAt: expect.anything(),
                }
            }

            const response = await request.post('/product').send(reqBody);            
            expect(response.body).toEqual(expextedResBody);
            expect(typeof response.body.product.id).toEqual('string');
            expect(new Date().getTime()-new Date(response.body.product.createdAt).getTime()).toBeLessThan(1000);
            expect(response.statusCode).toBe(201);
        });

        it('Save producto data in database', async () => {
          

            const product = {
                name: `product-name-${v4()}`,
                description: `product-description-${v4()}`,
                price: Math.random() * 50,
            }

            const reqBody = {
                product,
            }

            const response = await request.post('/product').send(reqBody);
            const expectedProduct = response.body.product;           

            const output = await client.send(new GetItemCommand({
                TableName:config.get("dbTables.products.name"),
                Key: {
                    ProductID:{S:response.body.product.id}
                },
            }));

            expect(output.Item).not.toBeUndefined();
            const item = output.Item as Record<string, AttributeValue>;
            expect(item["ProductID"].S).toEqual(expectedProduct.id);
            expect(item["Name"].S).toEqual(expectedProduct.name);
            expect(item["Description"].S).toEqual(expectedProduct.description);
            expect(item["Price"].N).toEqual(String(expectedProduct.price));
            expect(item["CreatedAt"].N).toEqual(String(new Date(expectedProduct.createdAt).getTime()));            
        });      
    })
})
