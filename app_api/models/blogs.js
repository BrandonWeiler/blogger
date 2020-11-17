var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
    blogTitle: String,
    blogText: String,
    email: String,
    userName: String,
    dateStamp: {
        type: Date,
        "default": Date.now
    },
});                
                
mongoose.model('Blog', blogSchema);