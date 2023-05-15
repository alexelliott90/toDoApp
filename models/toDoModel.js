const mongoose = require('mongoose');

//schema for new 'todo' item to add to the list
let toDoSchema = mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    id:{
        type:Number,
        required:true
    },    
    title:{
        type:String,
        required:true
    },
    completed:{
        type:Boolean,
        required:true
    }
});

module.exports = mongoose.model("toDoItems", toDoSchema);