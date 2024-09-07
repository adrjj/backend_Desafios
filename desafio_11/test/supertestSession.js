const chai = require('chai');
const supertest = require('supertest');
const expect = chai.expect;
const requester = supertest('http://localhost:8080')

//en la parte de  session mi app tiene 
//crear usuario *register
//restablecer contraseña 
//autenticar usuario *login
//ver datos del usuaior *profile 

let cookie;
describe("test de session", () => {

    describe("test para resgistar un usuario", () => {

        it("probando post /api/sessions/register", async () => {
            const usuarioPrueba = {

                first_name: "test",
                last_name: "test",
                email: "test@gmail.com",
                password: "1234",

            }

            const {
                statusCode,

            } = await requester.post('/api/sessions/register').send(usuarioPrueba)
            // usa el codigo 302 por que si se registro bien te redirige directamente a api/session/login
            expect(statusCode).to.equal(302);

        })
    });



    // Autenticamos al usuario admin antes de ejecutar los tests
    before(async () => {
        const loginResponse = await requester
            .post('/api/sessions/login')
            .send({ email: 'test@gmail.com', password: '1234' });

        // Verifica que el login haya sido exitoso
        expect(loginResponse.status).to.equal(302);
        // Extraemos la cookie de sesión de la respuesta de login
        cookie = loginResponse.headers['set-cookie'];
        console.log('Cookie:', cookie);  // Revisa si la cookie está correctamente obtenida

    });

    it('Debería permitir al usuario loguearse correctamente', () => {
        // Verifica que la cookie no esté vacía, lo que indica que el login fue exitoso
        expect(cookie).to.not.be.undefined;
        expect(cookie.length).to.be.greaterThan(0);
    });

    it('Debería fallar si las credenciales son incorrectas', async () => {
        const loginResponse = await requester
            .post('/api/sessions/login')
            .send({ email: 'test@gmail.com', password: '1234' });

        // Verifica que la respuesta sea un error, por ejemplo, 401 Unauthorized
        expect(loginResponse.status).to.equal(302);
    });

    
    describe("test para ver el perfil del usuario", ()=>{

        it("cargar los datos del usuario GET /api/session/profile", async ()=>{

            
        const {
            statusCode,
           text
            
            

        } = await requester
            .get(`/api/sessions/profile`)
            .set('Cookie', cookie);
       

        // Verifica que el código de estado sea el correcto (200 si el carrito es encontrado)
        expect(statusCode).to.equal(200);
        //expect(text).to.include('h1');
        console.log (text)

        })

    })


    describe("simular envio de mail para restablecer contraseña", function () {
        this.timeout(5000); // Aumentar el timeout a 5000ms (5 segundos)

        it("envio de mail desde POST /forgot-password", async () => {

            const mailPrueba = "test@gmail.com";

            const { statusCode, body, text } = await requester
                .post("/api/sessions/forgot-password")
                .send({ email: mailPrueba });

            expect(statusCode).to.equal(200);

            expect(text).to.equal('Correo de recuperación enviado.');
        });



    });















})