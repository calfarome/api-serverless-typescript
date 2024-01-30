import { ProductsRepository } from "./ProductRepository";
import { NewProduct } from "../model/NewProduct";
import { Product } from "../model/Product";
import { DynamoDBClient,GetItemCommand,PutItemCommand} from "@aws-sdk/client-dynamodb";
import { v4 } from 'uuid';
import config from 'config';
import {unmarshall} from '@aws-sdk/util-dynamodb';

export class ProductsRepositoryDynamoDB implements ProductsRepository {

  public client: DynamoDBClient
  constructor() {
    // conectamos a base datos
    this.client = new DynamoDBClient(config.get("dynamodb"));
  };

  async create(newProduct: NewProduct): Promise<Product> {

    // Creamos datos
    const product = {
      ...newProduct,
      id: v4(),
      createdAt: new Date(),
    }


    try {
      await this.client.send(new PutItemCommand({
        TableName:config.get("dbTables.products.name"),
        Item: {
          ProductID: { S: product.id },
          Name: { S: product.name },
          Description: { S: product.description },
          Price: { N: String(product.price) },
          CreatedAt: { N: product.createdAt.getTime().toString() },
        }
      }));
      // process data.
    } catch (error) {
      // error handling.
      console.error(error);
    } finally {
      // finally.
    }

    return product;

  }

  async fetchById(id:string):Promise<Product | undefined> {
    const output = await this.client.send(
       new GetItemCommand({
        TableName:config.get("dbTables.products.name"),
        Key: {
          ProductID:{S:id}
        },
       }),
    );
  
    if(!output.Item) {
      return undefined;
    }

    // Retornamos convertido a objetos javascript
    const obj = unmarshall(output.Item);

    return {
      id: obj["ProductID"],
      name:obj["Name"],
      description:obj["Description"],
      price:obj["Price"],
      createdAt:new Date(obj["CreatedAt"])
    };

  }

}