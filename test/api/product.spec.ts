import { request } from "../helpers/app";
import { v4 } from 'uuid'
import { AttributeValue, GetItemCommand, PutItemCommand, DynamoDBClient, CreateTableCommand, DeleteItemCommand, DeleteTableCommand } from "@aws-sdk/client-dynamodb";

// Probar test
describe('Products', () => {
    describe('POST/product', () => {

        // Conectamos a base de datos          
        const client = new DynamoDBClient({
            endpoint:"http://localhost:8000",
            region: "us-east-1",
        })

        beforeAll(async()=>{
            try {
                // Creamos la tabla
                let data =   await client.send(new CreateTableCommand({
                    TableName: "Product",
                    AttributeDefinitions: [{
                        AttributeName: "ProductID",
                        AttributeType: "S",
                    }],
                    KeySchema: [{
                        AttributeName: "ProductID",
                        KeyType: "HASH"
                    }],
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 5,
                        WriteCapacityUnits: 5
                    },
                }))               

                // process data.
              } catch (error) {
                console.log(error);
              } finally {
                // finally.
              }            
        });     

        afterAll(async () => {
            try {
                // Eliminamos las tabla
                await client.send(
                    new DeleteTableCommand({
                        TableName: "Product"
                    })
                );
                // process data.
            } catch (error) {
                // error handling.
                console.log(error);
            } finally {
                // finally.
            }


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
                TableName:'Product',
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
