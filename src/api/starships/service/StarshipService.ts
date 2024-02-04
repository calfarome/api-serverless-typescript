import { inject } from "inversify";
import { provide } from "inversify-binding-decorators";
import { ApiError } from "../../../ApiError";
import { Starship} from "../model//Starship";
import { NewStarship } from "../model/NewStarship";
import { StarshipsRepository } from "../repository/StarshipRepository";

@provide(StarshipsService)
export class StarshipsService {
  constructor(@inject("StarshipsRepository") private starshipsRepository: StarshipsRepository) {}

  public async getStarship(id: string) {
    const starship = await this.starshipsRepository.fetchById(id);

    if (!starship) {
      throw new ApiError({
        message: "starship not found",
        statusCode: 404,
        type: "STARSHIP_NOT_FOUND",
      });
    }

    return starship;
  }

  public async createStarship(newArticle: NewStarship): Promise<Starship> {
    const startship = await this.starshipsRepository.create(newArticle);

    return startship;
  }
}
