

import { ProductsRepositoryDynamoDB, mapProductDynamoDBItemToProduct, mapProductToDynamoDBItem } from "../../src/repository/ProductsRepositoryDynamoDB";
import { NewProduct } from "../model/NewProduct";
import { Product } from "../model/Product";
import { createProduct } from "../helpers/createProduct";
import { AttributeValue, GetItemCommand, PutItemCommand, DynamoDBClient, CreateTableCommand, DeleteItemCommand, DeleteTableCommand } from "@aws-sdk/client-dynamodb";
import config from "config";
import { createProductsTableIfDoesNotEXist, crearProductsTable, client } from "../helpers/productsTable";
import { v4 } from 'uuid'


const getRepository = () => new ProductsRepositoryDynamoDB();

describe("ProductsRepositoryDynamoDb", () => {

     // Creamos tabla
     beforeAll(async()=>{
        await createProductsTableIfDoesNotEXist();
        await crearProductsTable();    
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

      // Convertimos formato dynamodb a producto
      const storedProduct = mapProductDynamoDBItemToProduct(output.Item as Record<string, AttributeValue>);

      //Comparamos
      expect(storedProduct).toEqual({
        ...expectedProduct,
        id: actual.id,
        createdAt: actual.createdAt,
      });
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
                Item: mapProductToDynamoDBItem(expectedProduct),
            })
        );
      
        const actualProduct = await getRepository().fetchById(expectedProduct.id);        
        expect(actualProduct).toEqual(expectedProduct);

    });
  })
  
});
