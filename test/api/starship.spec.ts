import { request } from "../helpers/app";
import { v4 } from 'uuid'
import { createStarshipsTableIfDoesNotExist, crearStarshipsTable, getStarshipsRepository} from "../helpers/starshipsTable";
import config from "config";
import { NewStarship } from "../../src/model/NewStarship";
import { createStarship } from "../helpers/createStarship";
import { Starship } from "../model/Starship";

// Probar test
describe('Starships', () => {

    const endpoint = "/starship"

    // Creamos tabla
    beforeAll(async()=>{
        await createStarshipsTableIfDoesNotExist();
        await crearStarshipsTable();   
    }); 
    
    describe('GET/starship/{id}', () => {
        it("Responds with 200 status code and Starship data if Starship with given id ixist", async()=>{

            const newStarship: NewStarship =  createStarship({id:undefined, createdAt:undefined});
            const expectedStarship = await getStarshipsRepository().create(newStarship);
            const expectedResponseBody = {
                starship:{...expectedStarship, createdAt:expectedStarship.createdAt.toISOString()}
            };

            const response = await request.get(`${endpoint}/${expectedStarship.id}`);

            expect(response.body).toEqual(expectedResponseBody);
            expect(response.statusCode).toEqual(200);

        });

        it.skip("responds with 404 status code and  not found message if the Starship with given id does not axist", async()=>{
            const response = await request.get(`${endpoint}/${v4()}`);

            expect(response.body.type).toEqual("STARSHIP_NOT_FOUND");
            expect(response.statusCode).toEqual(404);
        });

    });
    
    describe('POST/starship', () => {

        it("responds with 201 status code and newly created starship data if starship has been created successfully", async () => {

            try {
                const res = await fetch('https://swapi.py4e.com/api/starships/9/');
                const json = await res.json();
                console.log(json);
            } catch (err) {
                console.log(err);
            }

            const reqBody = {
                starship: {
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
                }
            }

            const expextedResBody = {
                starship: {
                    ...reqBody.starship,
                    id: expect.anything(),
                    createdAt: expect.anything(),
                }
            }

            const response = await request.post(endpoint).send(reqBody);
            const responseBodyStarship = response.body.starship

            const actualStarship = await getStarshipsRepository().fetchById(response.body.starship.id);

            expect(response.body).toEqual(expextedResBody);
            expect(typeof responseBodyStarship.id).toEqual('string');
            expect(new Date().getTime()-new Date(responseBodyStarship.createdAt).getTime()).toBeLessThan(5000);
            // status code correcto
            expect(response.statusCode).toBe(201);
            // datos sean iguales
            expect(actualStarship).toEqual({
                ...responseBodyStarship, 
                createdAt: new Date(responseBodyStarship.createdAt),
            });
        });
    });
})
