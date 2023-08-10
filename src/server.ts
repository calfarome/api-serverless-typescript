
import config from "config";
import { app } from "./app";

// Obtengo puerto
const port = config.get("server.port");

// Escucho
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
