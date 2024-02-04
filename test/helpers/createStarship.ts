import {Starship } from "../../src/api/starships/model/Starship";
import { v4 } from 'uuid'

export const createStarship = (starship:Partial<Starship> ={}) =>({
    id: v4(),
    MGLT:`MGLT-${v4()}`,
    capacidad_carga:`capacidad_carga-${v4()}`,
    consumibles: `consumibles-${v4()}`,
    costo_en_creditos:`costo_en_creditos-${v4()}`,
    fecha_creacion:`fecha_creacion-${v4()}`,
    tripulacion:`tripulacion-${v4()}`,
    fecha_modificacion:`fecha_modificacion-${v4()}`,
    calificacion_hiperimpulsor:`calificacion_hiperimpulsor-${v4()}`,
    longitud:`longitud-${v4()}`,
    fabricante:`fabricante-${v4()}`,
    velocidad_maxima_atmosfera:`velocidad_maxima_atmosfera-${v4()}`,
    modelo:`modelo-${v4()}`,
    nombre:`nombre-${v4()}`,
    pasajeros:`pasajeros-${v4()}`,
    peliculas: `peliculas-${v4()}`,
    pilotos: `pilotos-${v4()}`,
    clase_nave_estelar: `clase_nave_estelar-${v4()}`,
    url:`url-${v4()}`,
    
    createdAt: new Date(),
    ...starship
});
