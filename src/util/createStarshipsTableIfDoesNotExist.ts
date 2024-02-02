import config from "config";
import {
  CreateTableCommand,
  DescribeTableCommand,
  DynamoDBClient,
  ResourceNotFoundException,
} from "@aws-sdk/client-dynamodb";

export const createStarshipsTableIfDoesNotExist = async (client: DynamoDBClient) => {
  try {
    await client.send(
      new DescribeTableCommand({
        TableName:config.get("dbTables.starships.name"),
      }),
    );
  } catch (e) {
    if (!(e instanceof ResourceNotFoundException)) {
      throw e;
    }

    await client.send(
      new CreateTableCommand({
        TableName:config.get("dbTables.starships.name"),
        AttributeDefinitions: [
          {
            AttributeName: "StarshipID",
            AttributeType: "S",
          },
        ],
        KeySchema: [
          {
            AttributeName: "StarshipID",
            KeyType: "HASH",
          },
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      }),
    );
  }
};
