const express = require("express");
const router = express.Router();
const sessionModel = require("../models/user.model.js")
const authenticatedMiddleware = require("../middleware/authenticated.js");
const { createHash, isValidPassword } = require('../utils/utils.js');
const passport = require("passport");

const CustomError= require("../services/custom.Error")
const EErrors = require("../services/enum.js")
const generateUserErrorInfo =require("../services/info.js")

const isAuthenticated = authenticatedMiddleware.isAuthenticated;
const isNotAuthenticated = authenticatedMiddleware.isNotAuthenticated;



router.get("/github",passport.authenticate("github",{scope:"user.email"}),async(req,res)=>{})

router.get("/githubCallback",passport.authenticate("github",{failureRedirect:"/login"}),async(req,res)=>{
  req.session.user=req.user
  res.redirect("/products?welcome=1")
})

router.get("/register", isNotAuthenticated, (req, res) => {
  res.render("register"); // Renderiza la vista de registro
});

router.get("/login", isNotAuthenticated, (req, res) => {
  res.render("login"); // Renderiza la vista de registro
});

router.get("/profile", isAuthenticated, (req, res) => {
  res.render("profile", { user: req.session.user }); // Renderiza la vista de registro
  console.log("2// session.router", req.session.user)
});



router.post("/register", passport.authenticate("register", { failureRedirect: "failRegister" }), async (req, res) => {
  //res.send({status:"sucess",message:"usuario regsitrado"})
  res.redirect("login")

});
/*router.get("/failRegister", async (req, res) => {
  console.log("estrategia fallida")
  res.send({ status: "error", message: "Fallo en el registro" });

})*/

router.get("/failRegister", (req, res) => {
  // El mensaje de error se pasa en la query de la URL
  const errorMessage = req.query.message || "Fallo en el registro";
  console.log("Estrategia fallida:", errorMessage);
  res.send({ status: "error", message: errorMessage });
});



router.post("/login", passport.authenticate("login", { failureRedirect: "faillogin" }), async (req, res,next) => {
 // if (!req.user) return res.status(400).send({ status: "error", error: "datos incompletos" })
 if (!req.user) {
  CustomError.createError({
    name: "LoginError",
    cause: generateUserErrorInfo (req.body),
    message: "Datos incompletos",
    code: EErrors.INVALID_TYPES_ERROR
  });
} 
 
    try {
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,   
      role:req.user.role,
      
    }
    console.log(req.session.user)
  
     // Verificar si el usuario es un administrador
     if (req.user.role === "admin") {
      // Si es un administrador, redirigir a la página de productos en tiempo real para administradores
      return res.redirect("/realtimeproducts");
    } else {
      // Si no es un administrador, redirigir a la página de productos regulares
      return res.redirect("/products?welcome=1");
    }
  } catch (error) {
    next(error); // Asegúrate de pasar el error al middleware de manejo de errores
  }
})

router.get("/faillogin", async (req, res) => {
  console.log("login fallido")
  
  res.send({ status: "error", message: "Login fallido" });

})

router.post("/logout", async (req, res) => {

  req.session.destroy((err) => {

    if (err) return res.status(500).send("Error al cerrar session", error);
    res.redirect("login");


  })





})

module.exports = router;