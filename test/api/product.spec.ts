import { request } from "../helpers/app";
import { v4 } from 'uuid'

// Probar test
describe('Products', () => {
    describe('POST/product', () => {
        it('should repond with a 201 status code', async () => {

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

            const response = await request.post('/product').send(reqBody);            
            expect(response.body).toEqual(expextedResBody);
            expect(typeof response.body.product.id).toEqual('string');
            expect(new Date().getTime()-new Date(response.body.product.createdAt).getTime()).toBeLessThan(1000);
            expect(response.statusCode).toBe(201);
        })
    })
})
