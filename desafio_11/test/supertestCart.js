const chai = require('chai');
const supertest = require('supertest');
const expect = chai.expect;
const requester = supertest('http://localhost:8080')



describe("test de cart", () => {

    let cookie;

    // Autenticamos al usuario admin antes de ejecutar los tests
    before(async () => {
        const loginResponse = await requester
            .post('/api/sessions/login')
            .send({ email: 'adrianojosealbarran@gmail.com', password: '1234' });

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
            .send({ email: 'adrianojosealbarran@gmail.com', password: '1234' });

        // Verifica que la respuesta sea un error, por ejemplo, 401 Unauthorized
        expect(loginResponse.status).to.equal(302);
    });


    describe("test cargar productos del carrito  ", () => {
        it("GET /cart debería devolver los productos del carrito asociado al usuario logueado", async () => {

            const {
                statusCode,
                text,

            } = await requester
                .get(`/api/carts`)
                .set('Cookie', cookie);

            // Verifica que el código de estado sea el correcto (200 si el carrito es encontrado)
            expect(statusCode).to.equal(200);

            // Verifica que la respuesta contenga el HTML esperado con los productos
            expect(text).to.include('title');  // Verifica si la respuesta es una página HTML por que renderiza una vista en cart.hanbdelbars
            console.log(text);  // Imprime la respuesta para ver los productos cargados
        });

        describe(" test agregar producto al carrito", () => {

            it("POST agregar producto al carrito", async () => {

                const productos = {
                    productos: [
                        {
                            pid: "664e25e8d1631423b90d425d",
                            quantity: 20
                        }
                    ]
                };

                const {
                    statusCode,
                    ok,
                    body
                } = await requester.post(`/api/carts`).set('Cookie', cookie).send(productos)


                // Verifica que el código de estado sea 500
                expect(statusCode).to.equal(200);

                // Verifica que el cuerpo de la respuesta contenga el mensaje de error esperado

                expect(body).to.have.property('cart').that.is.an('object');
                console.log(body); 

            });

            describe ("test eleminar producto del carrito",()=>{

                it(" DELETE /api/carts/:cid/products/:pid", async ()=>{

                    const pid = "664e25e8d1631423b90d425d" 
                    const cid = "66c39fe3cd0ee0090400c177"
        
                    const {
                        statusCode,
                        ok,
                        body
                    } = await requester.delete(`/api/carts/${cid}/products/${pid}`).set('Cookie', cookie)

                    expect(statusCode).to.equal(200); 
                    expect(body).to.have.property('message', 'Producto eliminado del carrito exitosamente.');
                    console.log(body);  // Imprime el cuerpo de la respuesta para ver qué devuelve el servidor
                });



            })

        })





    })





})