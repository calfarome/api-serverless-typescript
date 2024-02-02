import { StarshipsRepository } from "./StarshipRepository";
import { NewStarship } from "../model/NewStarship";
import { Starship } from "../model/Starship";
import { AttributeValue, DynamoDBClient,GetItemCommand,PutItemCommand} from "@aws-sdk/client-dynamodb";
import { v4 } from 'uuid';
import config from 'config';
import {unmarshall} from '@aws-sdk/util-dynamodb';

// Convertimos objetos de javascript a formato dynamodb
export const mapStarshipToDynamoDBItem= (starship:Starship):Record<string,AttributeValue> =>{

  return {
        StarshipID: { S: starship.id },
        MGLT: { S: starship.MGLT },
        Capacidad_carga: { S: starship.capacidad_carga },
        Consumibles: { S: starship.consumibles },
        Costo_en_creditos: { S: starship.costo_en_creditos },
        Fecha_creacion: { S: starship.fecha_creacion},
        Tripulacion: { S: starship.tripulacion},
        Fecha_modificacion: { S: starship.fecha_modificacion},
        Calificacion_hiperimpulsor: { S: starship.calificacion_hiperimpulsor}, 
        Longitud: { S: starship.longitud},
        Fabricante: { S: starship.fabricante}, 
        Velocidad_maxima_atmosfera: { S: starship.velocidad_maxima_atmosfera},
        Modelo: { S: starship.modelo},
        Nombre: { S: starship.nombre},
        Pasajeros: { S: starship.pasajeros},
        Peliculas: { S: starship.peliculas},
        Pilotos: { S: starship.pilotos},
        Clase_nave_estelar: { S: starship.clase_nave_estelar},
        Url: { S: starship.url},
        CreatedAt: { N: starship.createdAt.getTime().toString() },
  }
}

export const mapStarshipDynamoDBItemToStarship = (item:Record<string,AttributeValue>):Starship =>{

   // Retornamos convertido a objetos javascript
   const obj = unmarshall(item);

   return {
     id: obj["StarshipID"],    
     MGLT:obj["MGLT"],
     capacidad_carga:obj["Capacidad_carga"],    
     consumibles:obj["Consumibles"],
     costo_en_creditos:obj["Costo_en_creditos"],
     fecha_creacion:obj["Fecha_creacion"],
     tripulacion:obj["Tripulacion"],
     fecha_modificacion:obj["Fecha_modificacion"],
     calificacion_hiperimpulsor:obj["Calificacion_hiperimpulsor"],
     longitud:obj["Longitud"],
     fabricante:obj["Fabricante"],
     velocidad_maxima_atmosfera:obj["Velocidad_maxima_atmosfera"],
     modelo:obj["Modelo"],
     nombre:obj["Nombre"],
     pasajeros:obj["Pasajeros"],
     peliculas:obj["Peliculas"],
     pilotos:obj["Pilotos"],
     clase_nave_estelar:obj["Clase_nave_estelar"],
     url:obj["Url"],
     createdAt:new Date(obj["CreatedAt"])
   };
}

export class StarshipsRepositoryDynamoDB implements StarshipsRepository {

  public client: DynamoDBClient
  constructor() {
    // conectamos a base datos
    this.client = new DynamoDBClient(config.get("dynamodb"));
  };


  async create(newStarship: NewStarship): Promise<Starship> {

    // Creamos datos
    const starship = {
      ...newStarship,
      id: v4(),
      createdAt: new Date(),
    }


    try {
      await this.client.send(new PutItemCommand({
        TableName:config.get("dbTables.starships.name"),
        Item: mapStarshipToDynamoDBItem(starship)
      }));
      // process data.
    } catch (error) {
      // error handling.
      console.error(error);
    } finally {
      // finally.
    }

    return starship;

  }

  async fetchById(id:string):Promise<Starship | undefined> {
    const output = await this.client.send(
       new GetItemCommand({
        TableName:config.get("dbTables.starships.name"),
        Key: {
          StarshipID:{S:id}
        },
       }),
    );
  
    if(!output.Item) {
      return undefined;
    }

    
    return mapStarshipDynamoDBItemToStarship(output.Item);
  }

}