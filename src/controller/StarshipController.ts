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

        // Variable para recibir data The Star Wars API
        let starshipsData:any

        try {
            const res = await fetch('https://swapi.py4e.com/api/starships/9/');
            starshipsData = await res.json();
            console.log(starshipsData);
        } catch (err) {
            console.log(err);
        }

        // Mapeo datos para atributos español  
        reqBody.starship.MGLT = String(starshipsData.MGLT);
        reqBody.starship.capacidad_carga = String(starshipsData.cargo_capacity);
        reqBody.starship.consumibles = String(starshipsData.consumables);
        reqBody.starship.costo_en_creditos= String(starshipsData.cost_in_credits);
        reqBody.starship.fecha_creacion= String(starshipsData.created);
        reqBody.starship.tripulacion= String(starshipsData.crew);
        reqBody.starship.fecha_modificacion= String(starshipsData.edited);
        reqBody.starship.calificacion_hiperimpulsor= String(starshipsData.hyperdrive_rating);
        reqBody.starship.longitud= String(starshipsData.length);
        reqBody.starship.fabricante= String(starshipsData.manufacturer);
        reqBody.starship.velocidad_maxima_atmosfera= String(starshipsData.max_atmosphering_speed);
        reqBody.starship.modelo= String(starshipsData.model);
        reqBody.starship.nombre= String(starshipsData.name);
        reqBody.starship.pasajeros= String(starshipsData.passengers);
        reqBody.starship.peliculas= String(starshipsData.films[0]);
        reqBody.starship.pilotos= String(starshipsData.pilots[0]);
        reqBody.starship.clase_nave_estelar= String(starshipsData.starship_class);
        reqBody.starship.url= String(starshipsData.url);

        // Mando crear base datos
        const starship = await this.starshipsRepository.create(reqBody.starship)

        // Retornamos
        return { starship };
    }
}
