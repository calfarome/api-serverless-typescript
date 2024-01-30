

import { ProductsRepositoryDynamoDB } from "../../src/repository/ProductsRepositoryDynamoDB";
import { NewProduct } from "../model/NewProduct";
import { Product } from "../model/Product";
import { createProduct } from "../helpers/createProduct";
import { AttributeValue, GetItemCommand, PutItemCommand, DynamoDBClient, CreateTableCommand, DeleteItemCommand, DeleteTableCommand } from "@aws-sdk/client-dynamodb";
import config from "config";
import { createProductsTable, deleteProductsTable, client } from "../helpers/productsTable";
import { v4 } from 'uuid'


const getRepository = () => new ProductsRepositoryDynamoDB();

describe("ProductsRepositoryDynamoDb", () => {

     // Creamos tabla
     beforeAll(async()=>{
        await createProductsTable();       
    });     

    // Al final eliminamos tablas
    afterAll(async () => {
        await deleteProductsTable();
    });
    
  describe("create", () => {
    it("stores a NewProduct in the database and returns Product with newly generated id and actual createdAt date", async () => {
      const newProduct: NewProduct = createProduct({
        id: undefined,
        createdAt: undefined
      });
      const expectedProduct: Product = {
        ...newProduct,
        id: expect.anything(),
        createdAt: expect.anything(),
      };

      const actual = await getRepository().create(newProduct);

        const output = await client.send(new GetItemCommand({
            TableName: config.get("dbTables.products.name"),
            Key: {
                ProductID: { S: actual.id }
            },
        }));

      

      expect(actual).toEqual(expectedProduct);
      expect(typeof actual.id).toBe("string");
      expect(actual.createdAt).toBeInstanceOf(Date);
      expect(new Date().getTime() - actual.createdAt.getTime()).toBeLessThan(1000);

      expect(output.Item).not.toBeUndefined();
      const item = output.Item as Record<string, AttributeValue>;
      expect(item["ProductID"].S).toEqual(actual.id);
      expect(item["Name"].S).toEqual(expectedProduct.name);
      expect(item["Description"].S).toEqual(expectedProduct.description);
      expect(item["Price"].N).toEqual(String(expectedProduct.price));
      expect(item["CreatedAt"].N).toEqual(String(actual.createdAt.getTime()));
    });
  });

  describe("fetchById",()=>{
    it('returns undefined if product with given id does not exist', async()=> {
        const id = v4();
        const actual = await getRepository().fetchById(id);        
        expect(actual).toBeUndefined();

    });

    it('returns a product if product with given id exist in database', async()=> {

        const expectedProduct = createProduct();

        await client.send(
            new PutItemCommand({
                TableName: config.get("dbTables.products.name"),
                Item: {
                    ProductID: { S: expectedProduct.id },
                    Name: { S: expectedProduct.name },
                    Description: { S: expectedProduct.description },
                    Price: { N: String(expectedProduct.price) },
                    CreatedAt: { N: expectedProduct.createdAt.getTime().toString() },
                }
            })
        );
      
        const actualProduct = await getRepository().fetchById(expectedProduct.id);        
        expect(actualProduct).toEqual(expectedProduct);

    });


  })
  
});
