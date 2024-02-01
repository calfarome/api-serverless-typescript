
import config from 'config'
import { DynamoDBClient, CreateTableCommand, DeleteTableCommand, DescribeTableCommand, ResourceNotFoundException, ScanCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { iocContainer } from '../../src/ioc';
import { ProductsRepository } from '../repository/ProductRepository';
import { createProductsTableIfDoesNotExist as createProductTable } from "../../src/util/createProductsTableIfDoesNotExist";

// Conectamos a base de datos          
export const client = new DynamoDBClient(config.get("dynamodb"));

export const createProductsTableIfDoesNotExist = () => createProductTable(client);

export const createProductsTableIfDoesNotEXist =async()=>{


    try {
        await client.send(new DescribeTableCommand({
            TableName: config.get("dbTables.products.name"),
        }))
    } catch(e){
        if(!(e instanceof ResourceNotFoundException)){
            throw e;
        }

        await client.send(new CreateTableCommand({
            TableName: config.get("dbTables.products.name"),
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
        })); 
    }
}

export const crearProductsTable = async()=>{

     // Limpeamos  las tabla
     const output= await client.send(
        new ScanCommand({
            TableName: config.get("dbTables.products.name"),
        })
    );

    await Promise.all((output.Items || []).map(async (item)=>{

        return client.send(
            new DeleteItemCommand({
                TableName: config.get("dbTables.products.name"),
                Key: {
                    ProductID: item["ProductID"]
                }
            })
        )
    }));
}


// Obtener repositorios para emplear en testing
export const getProductsRepository =() => iocContainer.get<ProductsRepository>("ProductsRepository");
