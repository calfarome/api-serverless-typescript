import { Container, decorate, injectable } from "inversify";
import { buildProviderModule } from "inversify-binding-decorators";
import { Controller } from "tsoa";

import { ProductsRepository } from "./repository/ProductRepository";
import { ProductsRepositoryDynamoDB } from "./repository/ProductsRepositoryDynamoDB"; 

const iocContainer = new Container();

decorate(injectable(), Controller);

iocContainer.load(buildProviderModule());

iocContainer.bind<ProductsRepository>("ProductsRepository").toConstantValue(new ProductsRepositoryDynamoDB());

export { iocContainer };