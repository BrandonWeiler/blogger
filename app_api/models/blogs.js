var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
    blogTitle: String,
    blogText: String,
    dateStamp: {
        type: Date,
        "default": Date.now
    },
    email: String,
    userName: String
});                
                
mongoose.model('Blog', blogSchema);