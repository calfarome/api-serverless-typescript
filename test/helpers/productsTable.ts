
import config from 'config'
import { DynamoDBClient, CreateTableCommand, DeleteTableCommand } from "@aws-sdk/client-dynamodb";

// Conectamos a base de datos          
export const client = new DynamoDBClient(config.get("dynamodb"));

export const createProductsTable =async()=>{
    try {
        // Creamos la tabla
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
        }))               

        // process data.
      } catch (error) {
        console.log(error);
      } finally {
        // finally.
      } 
}

export const deleteProductsTable = async()=>{
    try {
        // Eliminamos las tabla
        await client.send(
            new DeleteTableCommand({
                TableName: config.get("dbTables.products.name"),
            })
        );
        // process data.
    } catch (error) {
        // error handling.
        console.log(error);
    } finally {
        // finally.
    }

}
