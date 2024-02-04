import { inject } from "inversify";
import { provide } from "inversify-binding-decorators";
import { ApiError } from "../../../ApiError";
import { Starship } from "../model//Starship";
import { NewStarship } from "../model/NewStarship";
import { StarshipsRepository } from "../repository/StarshipRepository";

@provide(StarshipsService)
export class StarshipsService {
  constructor(@inject("StarshipsRepository") private starshipsRepository: StarshipsRepository) { }

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

    // Variable para recibir data The Star Wars API
    let starshipsData: any

    // Consultar
    try {
      const res = await fetch('https://swapi.py4e.com/api/starships/9/');
      starshipsData = await res.json();
    } catch (err) {
      console.log(err);
    }

    // Mapear datos para atributos español  
    newArticle.MGLT = String(starshipsData.MGLT);
    newArticle.capacidad_carga = String(starshipsData.cargo_capacity);
    newArticle.consumibles = String(starshipsData.consumables);
    newArticle.costo_en_creditos = String(starshipsData.cost_in_credits);
    newArticle.fecha_creacion = String(starshipsData.created);
    newArticle.tripulacion = String(starshipsData.crew);
    newArticle.fecha_modificacion = String(starshipsData.edited);
    newArticle.calificacion_hiperimpulsor = String(starshipsData.hyperdrive_rating);
    newArticle.longitud = String(starshipsData.length);
    newArticle.fabricante = String(starshipsData.manufacturer);
    newArticle.velocidad_maxima_atmosfera = String(starshipsData.max_atmosphering_speed);
    newArticle.modelo = String(starshipsData.model);
    newArticle.nombre = String(starshipsData.name);
    newArticle.pasajeros = String(starshipsData.passengers);
    newArticle.peliculas = String(starshipsData.films[0]);
    newArticle.pilotos = String(starshipsData.pilots[0]);
    newArticle.clase_nave_estelar = String(starshipsData.starship_class);
    newArticle.url = String(starshipsData.url);

    const startship = await this.starshipsRepository.create(newArticle);

    return startship;
  }
}
