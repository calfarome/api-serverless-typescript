
import config from 'config'
import { DynamoDBClient, CreateTableCommand, DeleteTableCommand, DescribeTableCommand, ResourceNotFoundException, ScanCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { iocContainer } from '../../src/ioc';
import { StarshipsRepository } from '../../src/api/starships/repository/StarshipRepository';
import { createStarshipsTableIfDoesNotExist as createStarshipTable } from "../../src/util/createStarshipsTableIfDoesNotExist";

// Conectamos a base de datos          
export const client = new DynamoDBClient(config.get("dynamodb"));

export const createStarshipsTableIfDoesNotExist = () => createStarshipTable(client);

export const crearStarshipsTable = async()=>{

     // Limpeamos  las tabla
     const output= await client.send(
        new ScanCommand({
            TableName: config.get("dbTables.starships.name"),
        })
    );

    await Promise.all((output.Items || []).map(async (item)=>{

        return client.send(
            new DeleteItemCommand({
                TableName: config.get("dbTables.starships.name"),
                Key: {
                    StarshipID: item["StarshipID"]
                }
            })
        )
    }));
}


// Obtener repositorios para emplear en testing
export const getStarshipsRepository =() => iocContainer.get<StarshipsRepository>("StarshipsRepository");
