import express, { json, urlencoded, Request as ExRequest, Response as ExResponse, NextFunction } from "express";

// exporto la aplicacion
export const app = express();

// middleware
app.use( urlencoded({extended: true,}),);
app.use(json());

// Registrar rutas aqui

//
app.use((req, res, next) => {
  res.status(404).send({ status: "not found" });
});
