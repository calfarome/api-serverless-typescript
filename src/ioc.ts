import { Container, decorate, injectable } from "inversify";
import { buildProviderModule } from "inversify-binding-decorators";
import { Controller } from "tsoa";

import { StarshipsRepository } from "./api/starships/repository/StarshipRepository";
import { StarshipsRepositoryDynamoDB } from "./api/starships/repository/StarshipsRepositoryDynamoDB"; 

const iocContainer = new Container();

decorate(injectable(), Controller);

iocContainer.load(buildProviderModule());

// Vinculas repositoris
iocContainer.bind<StarshipsRepository>("StarshipsRepository").toConstantValue(new StarshipsRepositoryDynamoDB());

export { iocContainer };