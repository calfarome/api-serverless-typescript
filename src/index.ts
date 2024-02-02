import serverlessExpress from "@codegenie/serverless-express";
import { app } from "./app";

// Paso mi aplicaion como servelesss
exports.handler = serverlessExpress({ app });
