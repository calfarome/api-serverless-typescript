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

  public async createStarship(newStarship: NewStarship): Promise<Starship> {

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
    newStarship.MGLT = String(starshipsData.MGLT);
    newStarship.capacidad_carga = String(starshipsData.cargo_capacity);
    newStarship.consumibles = String(starshipsData.consumables);
    newStarship.costo_en_creditos = String(starshipsData.cost_in_credits);
    newStarship.fecha_creacion = String(starshipsData.created);
    newStarship.tripulacion = String(starshipsData.crew);
    newStarship.fecha_modificacion = String(starshipsData.edited);
    newStarship.calificacion_hiperimpulsor = String(starshipsData.hyperdrive_rating);
    newStarship.longitud = String(starshipsData.length);
    newStarship.fabricante = String(starshipsData.manufacturer);
    newStarship.velocidad_maxima_atmosfera = String(starshipsData.max_atmosphering_speed);
    newStarship.modelo = String(starshipsData.model);
    newStarship.nombre = String(starshipsData.name);
    newStarship.pasajeros = String(starshipsData.passengers);
    newStarship.peliculas = String(starshipsData.films[0]);
    newStarship.pilotos = String(starshipsData.pilots[0]);
    newStarship.clase_nave_estelar = String(starshipsData.starship_class);
    newStarship.url = String(starshipsData.url);

    const startship = await this.starshipsRepository.create(newStarship);

    return startship;
  }
}
