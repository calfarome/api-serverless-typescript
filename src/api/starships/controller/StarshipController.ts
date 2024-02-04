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

        // Mando crear base datos
        const starship = await this.starshipsService.createStarship(reqBody.starship)

        // Retornamos
        return { starship };
    }
}
