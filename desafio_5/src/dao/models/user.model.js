const mongoose = require('mongoose');
const sessionCollection = "users"

const sessionSchema = new mongoose.Schema({
    
 

        first_name: { type: String, required: true },
        last_name:{ type: String, required: true },
        email:{ type: String, required: true },
        password:{ type: String, required: true },
        isAdmin: { type: Boolean, default: false } 
     
        });
const sessionModel = mongoose.model(sessionCollection,sessionSchema)

module.exports = sessionModel;
