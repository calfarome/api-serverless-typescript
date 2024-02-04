import { v4 } from 'uuid'
import { Body, Controller, Delete, Get, Path, Post, Put, Response, Route, Security, SuccessResponse, Tags } from "tsoa";
import { NewStarship } from '../model/NewStarship';
import { Starship } from '../model/Starship';
import { StarshipsService} from "../service/StarshipService";
import { provideSingleton } from '../../../util/provideSingleton';
import { inject } from "inversify";


export type StarshipReqBody = {
    starship: NewStarship
}

export type StarshipResBody = {
    starship: Starship
}

@Route("starship")
@provideSingleton(StarshipController)
export class StarshipController extends Controller {

    constructor(@inject(StarshipsService) private starshipsService: StarshipsService) {
        super();
    };

    // GET METHOD
    @Get("{id}")
     public async getStarship(@Path("id") id: string): Promise<StarshipResBody> {
        const starship = await  this.starshipsService.getStarship(id);
        return {starship}
     }

    //POST METHOD
    @SuccessResponse("201", "Created")
    @Post()
    public async postStarship(@Body() reqBody: StarshipReqBody): Promise<StarshipResBody> {

        // Variable para recibir data The Star Wars API
        let starshipsData:any

        // Consultar
        try {
            const res = await fetch('https://swapi.py4e.com/api/starships/9/');
            starshipsData = await res.json();            
        } catch (err) {
            console.log(err);
        }

        // Mapear datos para atributos español  
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
        const starship = await this.starshipsService.createStarship(reqBody.starship)

        // Retornamos
        return { starship };
    }
}
