
import config from "config";
import { app } from "./app";
import { createStarshipsTableIfDoesNotExist } from "./util/createStarshipsTableIfDoesNotExist";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

// Obtengo puerto
const port = config.get("server.port");

// creamos tablas Dynamodb al iniciar
setImmediate(async()=>{
await createStarshipsTableIfDoesNotExist(new DynamoDBClient(config.get("dynamodb")));
});

// Escucho
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
