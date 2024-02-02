import { NewStarship } from "../model/NewStarship";
import { Starship} from "../model/Starship";

export interface StarshipsRepository {
    create(newStarship: NewStarship): Promise<Starship>;
    fetchById(id:string):Promise<Starship | undefined>;
}