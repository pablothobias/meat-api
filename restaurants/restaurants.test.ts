import 'jest'
import * as request from 'supertest';

let address: string = (<any>global).address;
let auth: string = (<any>global).auth;

test('get /restaurants', () => {
    return request(address)
        .get('/restaurants')
        .set('Authorization', auth)
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body.items).toBeInstanceOf(Array);
        })
        .catch(fail)
});
