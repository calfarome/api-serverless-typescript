

import { StarshipsRepositoryDynamoDB, mapStarshipDynamoDBItemToStarship, mapStarshipToDynamoDBItem } from "../../src/repository/StarshipsRepositoryDynamoDB";
import { NewStarship } from "../../src/model/NewStarship";
import { Starship} from "../../src/model/Starship";
import { createStarship } from "../helpers/createStarship";
import { AttributeValue, GetItemCommand, PutItemCommand, DynamoDBClient, CreateTableCommand, DeleteItemCommand, DeleteTableCommand } from "@aws-sdk/client-dynamodb";
import config from "config";
import { createStarshipsTableIfDoesNotExist, crearStarshipsTable, client } from "../helpers/starshipsTable";
import { v4 } from 'uuid'


const getRepository = () => new StarshipsRepositoryDynamoDB();

describe("StarshipsRepositoryDynamoDB", () => {

     // Creamos tabla
     beforeAll(async()=>{
        await createStarshipsTableIfDoesNotExist();
        await crearStarshipsTable();    
    });
    
  describe("create", () => {
    it("stores a New Starship in the database and returns Starship with newly generated id and actual createdAt date", async () => {

      // creamos datos, con id y fecha undefined
      const newStarship: NewStarship = createStarship({
        id: undefined,
        createdAt: undefined
      });

      // agregamos id y fecha undefined
      const expectedStarship: Starship = {
        ...newStarship,
        id: expect.anything(),
        createdAt: expect.anything(),
      };

      // mandamos crear
      const actual = await getRepository().create(newStarship);

        const output = await client.send(new GetItemCommand({
            TableName: config.get("dbTables.starships.name"),
            Key: {
                StarshipID: { S: actual.id }
            },
        }));

      
      // comparamos datos
      expect(actual).toEqual(expectedStarship);
      expect(typeof actual.id).toBe("string");
      expect(actual.createdAt).toBeInstanceOf(Date);
      expect(new Date().getTime() - actual.createdAt.getTime()).toBeLessThan(1000);
      expect(output.Item).not.toBeUndefined();

      // Convertimos formato dynamodb a objeto Starship formato javascript
      const storedStarship = mapStarshipDynamoDBItemToStarship(output.Item as Record<string, AttributeValue>);

      //Comparamos
      expect(storedStarship).toEqual({
        ...storedStarship,
        id: actual.id,
        createdAt: actual.createdAt,
      });
    });
  });

  describe("fetchById",()=>{
    it('returns undefined if Starship with given id does not exist', async()=> {
        const id = v4();
        const actual = await getRepository().fetchById(id);        
        expect(actual).toBeUndefined();

    });

    it('returns a Starship if Starship with given id exist in database', async()=> {

        const expectedStarship = createStarship();

        await client.send(
            new PutItemCommand({
                TableName: config.get("dbTables.starships.name"),
                Item: mapStarshipToDynamoDBItem(expectedStarship),
            })
        );
      
        // Obtenemos datos
        const actualStarship = await getRepository().fetchById(expectedStarship.id);
        // Comparamos    
        expect(actualStarship).toEqual(expectedStarship);

    });
  })
  
});
