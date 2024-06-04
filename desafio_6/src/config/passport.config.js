const passport = require("passport")
const local = require("passport-local")
const sessionModel = require("../dao/models/user.model.js")
const { createHash, isValidPassword } = require('../utils/utils.js');

const localStrategy = local.Strategy
const initializePassport = () => {

    passport.use('register', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            console.log("2// passport",username,password)
            // 2//  te@mail.com te
            const { last_name, first_name, email,isAdmin  } = req.body;
            console.log("1// passport", req.query)
            // 1// passport {}
            try {
                let user = await sessionModel.findOne({ email: username });
                if (user) return done(null, false);
                const newUser = new sessionModel({
                    first_name,
                    last_name,
                    email,
                    password: createHash(password),
                    isAdmin
                });
                let result = await newUser.save();

                return done(null, result);

            } catch (error) {
                return done("error al obtener al usuario", error);
            }
        })
    )
// isAdmin === 'true'
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await sessionModel.findById(id)
        done(null, user)
    })

    passport.use("login", new localStrategy({ usernameField: "email" }, async (username, password, done) => {
        try {
            const user = await sessionModel.findOne({ email: username })
            if (!user) {
                console.log("el usuario no existe")
                return done(null, user)
            }
            if (!isValidPassword(user, password)) return done(null, false)
            return done(null, user)
        } catch (error) {
            return done(error)

        }
    }))

}

module.exports = { initializePassport };