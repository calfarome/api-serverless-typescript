import { request } from "../helpers/app";
import { v4 } from 'uuid'
import { createProductsTable, deleteProductsTable, getProductsRepository} from "../helpers/productsTable";
import config from "config";
import { NewProduct } from "../model/NewProduct";
import { createProduct } from "../helpers/createProduct";
import { Product } from "../model/Product";
import { ExportConflictException } from "@aws-sdk/client-dynamodb";

// Probar test
describe('Products', () => {

    const endpoint = "/product"

    // Creamos tabla
    beforeAll(async()=>{
        await createProductsTable();       
    });     

    // Al final eliminamos tablas
    afterAll(async () => {
        await deleteProductsTable();
    });

    describe('GET /product/{id}', () => {
        it("Responds with 200 status code and porduct data if product with given id ixist", async()=>{

            const newProduct: NewProduct =  createProduct({id:undefined, createdAt:undefined});
            const expectedProduct = await getProductsRepository().create(newProduct);
            const expectedResponseBody = {
                product:{...expectedProduct, createdAt:expectedProduct.createdAt.toISOString()}
            };

            const response = await request.get(`${endpoint}/${expectedProduct.id}`);

            expect(response.body).toEqual(expectedResponseBody);
            expect(response.statusCode).toEqual(200);

        });

        it("responds with 404 status code and  not found message if the product with given id does not axist", async()=>{
            const response = await request.get(`${endpoint}/${v4()}`);

            expect(response.body.type).toEqual("PRODUCT_NOT_FOUND");
            expect(response.statusCode).toEqual(404);
        });

    });
    
    describe('POST/product', () => {

        it("responds with 201 status code and newly created product data if product has been created successfully", async () => {

            try {
                const res = await fetch('https://swapi.py4e.com/api/starships/9/');
                const json = await res.json();
                console.log(json);
            } catch (err) {
                console.log(err);
            }

            const reqBody = {
                product: {
                    name: `product-name-${v4()}`,
                    description: `product-description-${v4()}`,
                    price: Math.random() * 50,
                }
            }

            const expextedResBody = {
                product: {
                    ...reqBody.product,
                    id: expect.anything(),
                    createdAt: expect.anything(),
                }
            }

            const response = await request.post(endpoint).send(reqBody);
            const responseBodyProduct = response.body.product

            const actualProduct = await getProductsRepository().fetchById(response.body.product.id);

            expect(response.body).toEqual(expextedResBody);
            expect(typeof responseBodyProduct.id).toEqual('string');
            expect(new Date().getTime()-new Date(responseBodyProduct.createdAt).getTime()).toBeLessThan(5000);
            // status code correcto
            expect(response.statusCode).toBe(201);
            // datos sean iguales
            expect(actualProduct).toEqual({
                ...responseBodyProduct, 
                createdAt: new Date(responseBodyProduct.createdAt),
            });
        });
    });
})
