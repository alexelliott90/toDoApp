const mongoose = require('mongoose');

//schema for log in details
let loginSchema = mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model("Logins", loginSchema);