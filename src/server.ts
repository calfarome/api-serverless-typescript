
import config from "config";
import { app } from "./app";
import { createProductsTableIfDoesNotEXist } from "./helpers/productsTable";
import { createProductsTableIfDoesNotExist } from "./util/createProductsTableIfDoesNotExist";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

// Obtengo puerto
const port = config.get("server.port");

// creamos tablas Dynamo al iniciar
setImmediate(async()=>{
await createProductsTableIfDoesNotExist(new DynamoDBClient(config.get("dynamodb")));
});

// Escucho
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
