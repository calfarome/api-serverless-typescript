import express, { json, urlencoded, Request as ExRequest, Response as ExResponse, NextFunction, Application } from "express";
import { RegisterRoutes } from "../dist/routes";
import {errorHandler} from '../src/errorHandler'

// exporto la aplicacion
export const app: Application = express();

// middleware
app.use( urlencoded({extended: true,}),);
app.use(json());

// Registro rutas generados por tsoa
RegisterRoutes(app);

// Registrar rutas aqui
app.get("/product",(req,res)=>{
  res.send('Serverless TypeScript proyect is running');
})

// Error Handling en tsoa
app.use(errorHandler);

