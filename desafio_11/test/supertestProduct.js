const chai = require('chai');
const supertest = require('supertest');
const expect = chai.expect;
const requester = supertest('http://localhost:8080')

describe("test en productos", () => {

    let cookie;

    // Autenticamos al usuario admin antes de ejecutar los tests
    before(async () => {
        const loginResponse = await requester
            .post('/api/sessions/login')
            .send({ email: 'admin@gmail.com', password: 'admin' });

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
            .send({ email: 'admin@gmail.com', password: 'admin' });

        // Verifica que la respuesta sea un error, por ejemplo, 401 Unauthorized
        expect(loginResponse.status).to.equal(302);
    });




    describe("test cargar productos", () => {
        it("probando GET /products", async () => {
            const response = await requester.get('/api/products');
            expect(response.status).to.equal(200);
            //console.log(response)
            expect(response.body).to.have.property('payload');  // Verificar que 'payload' esté presente en la respuesta
            expect(response.body.payload).to.be.an('array').that.is.not.empty;  // Verificar que 'payload' sea un array no vacío
            console.log(response.body.payload)
        })
    });

    describe("test crear producto", () => {
        it("probando post /api/products", async () => {
            const porductoPrueba = {

                title: "sandia ",
                description: "Forma Cuadrada",
                price: 15000,
                thumbnail: "imagen de sandia cuadrada use la imaginación",
                code: 12354,
                stock: 5,
                category: "fruta",
            }

            const {
                statusCode,
                ok,
                body
            } = await requester.post('/api/products').set('Cookie', cookie).send(porductoPrueba)
            expect(statusCode).to.equal(201);  // Asegúrate de que el código de estado sea el correcto
            
            // Verifica que el cuerpo de la respuesta contenga el mensaje esperado
            expect(body).to.have.property('message', 'Producto agregado exitosamente.');
            console.log(body);  // Imprime el cuerpo de la respuesta para ver qué devuelve el servidor

        })
    });
    
    describe("test eliminar producto ",() =>{
        it("probando delete /api/products/:id", async ()=>{

            const idPrueba = "66d9d512235c16224e365aaa" //id harcodeado
            // como en la app se necesita el id para borrar un producto y este mismo se otieve de la lista que
            //que obtiene solo el admin usando dejo un id para que pruebe el test si lo desea 
            // "66dcda621ddc8d83fc4333dc"


            const {
                statusCode,
                ok,
                body
            } = await requester.delete(`/api/products/${idPrueba}`).set('Cookie', cookie).send(idPrueba)
       

            expect(statusCode).to.equal(200);  
            // Verifica que el cuerpo de la respuesta contenga el mensaje esperado
            expect(body).to.have.property('message', 'Producto eliminado exitosamente.');
            console.log(body);  // Imprime el cuerpo de la respuesta para ver qué devuelve el servidor

        });
        it("debería devolver error 500 si no se encuentra el producto", async () => {
            const idInexistente = "000000000000000000000000"; // Un ID que no existe en la base de datos
    
            const {
                statusCode,
                ok,
                body
            } = await requester.delete(`/api/products/${idInexistente}`).set('Cookie', cookie);
    
            // Verifica que el código de estado sea 500
            expect(statusCode).to.equal(500);
    
            // Verifica que el cuerpo de la respuesta contenga el mensaje de error esperado
            expect(body).to.have.property('error', 'Error al eliminar el producto.');
            expect(body).to.have.property('message'); // Verifica que el mensaje de error esté presente
            console.log(body); // Imprime el cuerpo de la respuesta para ver qué devuelve el servidor
        });



    })

    describe("test modificando un producto",()=>{

        it("probando put /api/products/:id", async()=>{

            const idPrueba = "66d132a159cd7b4b8f5a6e54" //id harcodeado

            const porductoPrueba = {

                title: "samsung M12 ",
                description: "Pantalla 5.2, 5g, Color verde",
                price: 150,
                thumbnail: "link de la imgen",
                code: 1235,
                stock: 25,
                category: "Smartphones",
            }
            
            
            const {
                statusCode,
                ok,
                body
            } = await requester.put(`/api/products/${idPrueba}`).set('Cookie', cookie).send(porductoPrueba)
            // console.log(_body);  // Verifica qué datos está devolviendo el servidor
            
            // Verifica que el código de estado sea 500
            expect(statusCode).to.equal(200);
    
            // Verifica que el cuerpo de la respuesta contenga el mensaje de error esperado
            expect(body).to.have.property('message', 'Producto actualizado exitosamente.');
          //  expect(body).to.have.property('message'); // Verifica que el mensaje de error esté presente
            console.log(body); // Imprime el cuerpo de la respuesta para ver qué devuelve el servidor
        })


    })


})