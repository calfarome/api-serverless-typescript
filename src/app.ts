import express, { json, urlencoded, Request as ExRequest, Response as ExResponse, NextFunction, Application } from "express";

// exporto la aplicacion
export const app: Application = express();

// middleware
app.use( urlencoded({extended: true,}),);
app.use(json());

// Registrar rutas aqui
app.get("/product",(req,res)=>{
  res.send('Serverless TypeScript proyect is running');
})


