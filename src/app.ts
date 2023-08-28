import express, { json, urlencoded, Request as ExRequest, Response as ExResponse, NextFunction, Application } from "express";
import { RegisterRoutes } from "../dist/routes";
import {errorHandler} from '../src/errorHandler'
import swaggerUi from "swagger-ui-express";

// exporto la aplicacion
export const app: Application = express();

// middleware
app.use( urlencoded({extended: true,}),);
app.use(json());

// Documentación
app.use("/docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
  return res.send(swaggerUi.generateHTML(await import("../dist/swagger.json")));
});

// Registro rutas generados por tsoa
RegisterRoutes(app);

// Registrar rutas aqui
app.get("/product",(req,res)=>{
  res.send('Serverless TypeScript proyect is running');
})

// Error Handling en tsoa
app.use(errorHandler);

