import request from 'supertest';
import app from '../serveur.js';
import { sequelize } from '../config/db.config.js';


describe('TESTS API AUTHENTIFICATION', () => {

    // Test 1 : Cas d'erreur
    it('devrait retourner 401 si le mot de passe est faux', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'test@previzen.fr',
                password: 'wrongpassword'
            });
        expect(res.statusCode).toEqual(401);
    });

    // Test 2 : Cas de succès

    it('devrait retourner 200 et un cookie HTTP-Only si les identifiants sont corrects', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'theo.villeneuve30@gmail.com',
                password: 'Theov/30'
            });

        // 1. Vérification du statut HTTP
        expect(res.statusCode).toEqual(200);

        // 2. Vérification que le Cookie est présent
        const cookies = res.headers['set-cookie'][0];
        expect(cookies).toMatch(/auth_token/);
        expect(cookies).toMatch(/HttpOnly/);

        // 3. Vérification que le Token n'est PAS dans le corps (Sécurité)
        expect(res.body).not.toHaveProperty('token');
    });

    afterAll(async () => {
        await sequelize.close();
    });
});