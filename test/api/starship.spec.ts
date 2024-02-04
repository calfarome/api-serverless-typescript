import { request } from "../helpers/app";
import { v4 } from 'uuid'
import { createStarshipsTableIfDoesNotExist, crearStarshipsTable, getStarshipsRepository} from "../helpers/starshipsTable";
import { NewStarship } from "../../src/api/starships/model/NewStarship";
import { createStarship } from "../helpers/createStarship";

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

            // Variable
            let starshipsData:any

            // consultamos
            try {
                const res = await fetch('https://swapi.py4e.com/api/starships/9/');
                starshipsData = await res.json();
                console.log(starshipsData);
            } catch (err) {
                console.log(err);
            }

            // mapeamos atributos
            const reqBody = {
                starship: {
                    MGLT:String(starshipsData.MGLT),
                    capacidad_carga:String(starshipsData.cargo_capacity),
                    consumibles: String(starshipsData.consumables),
                    costo_en_creditos:String(starshipsData.cost_in_credits),
                    fecha_creacion:String(starshipsData.created),
                    tripulacion:String(starshipsData.crew),
                    fecha_modificacion:String(starshipsData.edited),
                    calificacion_hiperimpulsor:String(starshipsData.hyperdrive_rating),
                    longitud:String(starshipsData.length),
                    fabricante:String(starshipsData.manufacturer),
                    velocidad_maxima_atmosfera:String(starshipsData.max_atmosphering_speed),
                    modelo:String(starshipsData.model),
                    nombre:String(starshipsData.name),
                    pasajeros:String(starshipsData.passengers),
                    peliculas: String(starshipsData.films[0]),
                    pilotos: String(starshipsData.pilots[0]),
                    clase_nave_estelar: String(starshipsData.starship_class),
                    url:String(starshipsData.url),
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
