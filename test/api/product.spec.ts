import { request } from "../helpers/app";

// Probar test
describe('GET/products',()=>{
    test('should repond with a 200 status code',async()=>{
        const response = await request.get('/product').send();
        expect(response.statusCode).toBe(200);
    })
})