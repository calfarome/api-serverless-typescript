import { v4 } from 'uuid'
import { Body, Controller, Delete, Get, Path, Post, Put, Response, Route, Security, SuccessResponse, Tags } from "tsoa";

import { NewStarship } from '../model/NewStarship';
import { Starship } from '../model/Starship';
import { StarshipsRepository } from '../repository/StarshipRepository';
import { provideSingleton } from '../util/provideSingleton';
import { inject } from "inversify";
import { ApiError } from "../ApiError"


export type StarshipReqBody = {
    starship: NewStarship
}

export type StarshipResBody = {
    starship: Starship
}

@Route("starship")
@provideSingleton(StarshipController)
export class StarshipController extends Controller {

    constructor(@inject("StarshipsRepository") private starshipsRepository: StarshipsRepository) {
        super();
    };

    // GET METHOD
    @Get("{id}")
     public async getStarship(@Path("id") id: string): Promise<StarshipResBody> {

        const starship = await  this.starshipsRepository.fetchById(id);

        if(!starship) {
            throw new ApiError({
                statusCode:404,
                type:"STARSHIP_NOT_FOUND",
            })
        }

        return {starship}
     }

    //POST METHOD
    @SuccessResponse("201", "Created")
    @Post()
    public async postStarship(@Body() reqBody: StarshipReqBody): Promise<StarshipResBody> {

        // Mando crear
        const starship = await this.starshipsRepository.create(reqBody.starship)

        // Retornamos
        return { starship };
    }
}
