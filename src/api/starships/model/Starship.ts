export interface Starship {
    /**
     * @example "afa9157d-df1b-4900-8db0-fc45ea0583b2"
     */
    id: string;
    /**
     * @example "10"
     */
    MGLT: string;
    /**
     * @example "1000000000000"
     */
    capacidad_carga: string;
    /**
     * @example "3 years"
     */
    consumibles: string;
    /**
     * @example "1000000000000"
     */
    costo_en_creditos: string;
    /**
     * @example "2014-12-10T16:36:50.509000Z"
     */
    fecha_creacion: string;
    /**
     * @example "555,953"
     */
    tripulacion: string;
    /**
     * @example "2014-12-20T21:26:24.783000Z"
     */
    fecha_modificacion: string;
    /**
     * @example "6.0"
     */
    calificacion_hiperimpulsor: string;
    /**
     * @example "110000"
     */
    longitud: string;
    /**
     * @example "César company"
     */
    fabricante: string;
    /**
     * @example "4n/a"
     */
    velocidad_maxima_atmosfera: string;
    /**
     * @example "Orbital Battle "
     */
    modelo: string;
    /**
     * @example "Death Star"
     */
    nombre: string;
    /**
     * @example "545544,67"
     */
    pasajeros: string;
    /**
     * @example "https://swapi.py4e.com/api/films/1/"
     */
    peliculas: string;
    /**
     * @example "Pilot numer 1"
     */
    pilotos: string;        
    /**
     * @example "Class one"
     */
    clase_nave_estelar: string;
    /**
     * @example "https://swapi.py4e.com/api/starships/9/"
     */
    url: string;
    /**
     * @example "2024-02-02T05:28:00.933Z"
     */
    createdAt: Date;
}
