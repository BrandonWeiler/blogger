var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
    blogTitle: String,
    blogText: String,
    dateStamp: {
        type: Date,
        "default": Date.now
    }
});                
                
