const express = require("express");
const router = express.Router();
const sessionModel = require("../dao/models/user.model.js")
const authenticatedMiddleware = require("../middleware/authenticated.js");
const { createHash, isValidPassword } = require('../utils/utils.js');

const isAuthenticated = authenticatedMiddleware.isAuthenticated;
const isNotAuthenticated = authenticatedMiddleware.isNotAuthenticated;


router.get("/register", isNotAuthenticated, (req, res) => {
  res.render("register"); // Renderiza la vista de registro
});

router.get("/login", isNotAuthenticated, (req, res) => {
  res.render("login"); // Renderiza la vista de registro
});

router.get("/profile", isAuthenticated, (req, res) => {
  res.render("profile", { user: req.session.user }); // Renderiza la vista de registro
  console.log("2//", req.session.user)
});

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, password, isAdmin } = req.body;

  try {
    // Verificar si el correo electrónico ya está registrado
    const existingUser = await sessionModel.findOne({ email: email });
    if (existingUser) {
      // Si el correo electrónico ya está registrado, enviar una alerta
      return res.status(400).send("El correo electrónico ya está registrado.");
    }

    // Si el correo electrónico no está registrado, crear un nuevo usuario
    const newUser = new sessionModel({
      first_name,
      last_name,
      email,
      password: createHash(password),
      isAdmin
    });
    await newUser.save();
    res.redirect("login");
  } catch (error) {
    // Manejar errores
    res.status(500).send("Error al registrar usuario: " + error.message);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Espera la respuesta de la búsqueda en la base de datos
    const user = await sessionModel.findOne({ email});
    if (!user) return res.status(404).send("Usuario no encontrado. O contraseña incorrecta");
    if (!isValidPassword(user, password)) return res.status(403).send({ status: "error", error: "Contraseña incorrecta" })
    delete user.password;
    req.session.user = {
      id: user._id,
      last_name: user.last_name,
      first_name: user.first_name,
      email: user.email,
      username: user.first_name, // Almacena el nombre de usuario en la sesión
    };

    // Verificar si el usuario es un administrador
    if (user.isAdmin) {
      // Si es un administrador, redirigir a la página de productos en tiempo real para administradores
      return res.redirect("/realtimeproducts");
    } else {
      // Si no es un administrador, redirigir a la página de productos regulares
      return res.redirect("/products?welcome=1");
    }
  } catch (error) {
    res.status(500).send("Error al iniciar sesión", error);
  }
});

/*

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      // Espera la respuesta de la búsqueda en la base de datos
      const user = await sessionModel.findOne({ email });
      if (!user) return res.status(404).send("Usuario no encontrado.");
      req.session.user = {
        id: user._id,
        last_name: user.last_name,
        first_name: user.first_name,
        email: user.email,
        username: user.first_name, // Almacena el nombre de usuario en la sesión
      };
      console.log("1//",req.session.user)
      //res.redirect("/products");
      res.redirect("/products?welcome=1");
    } catch (error) {
      res.status(500).send("Error al iniciar sesión", error);
    }
  });
  */

router.post("/logout", async (req, res) => {

  req.session.destroy((err) => {

    if (err) return res.status(500).send("Error al cerrar sescion", error);
    res.redirect("login");


  })





})

module.exports = router;