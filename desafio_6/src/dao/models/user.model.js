const mongoose = require('mongoose');
const sessionCollection = "users"

const sessionSchema = new mongoose.Schema({
    
 

        first_name: { type: String,  },
        last_name:{ type: String, },
        email:{ type: String, required: true },
        password:{ type: String, },
        isAdmin: { type: Boolean, default: false } 
     
        });
const sessionModel = mongoose.model(sessionCollection,sessionSchema)

module.exports = sessionModel;
