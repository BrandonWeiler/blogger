var express = require('express');
var router = express.Router();
var ctrlBlog = require('../controllers/blog');
var ctrlAuth = require('../controllers/authentication');  // Lab 6
var jwt = require('express-jwt');
var auth = jwt({ 
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});

router.get('/blog', ctrlBlog.blogList);
router.get('/blog/:blogid', ctrlBlog.blogReadOne);
router.post('/blog/comment/:blogid', ctrlBlog.commentAdd);
router.get('/blog/comment/:blogid', ctrlBlog.commentGet);
router.put('/blog/:blogid', auth, ctrlBlog.blogUpdateOne);
router.post('/blog', auth, ctrlBlog.blogCreate);
router.delete('/blog/:blogid', auth, ctrlBlog.blogDeleteOne);
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;