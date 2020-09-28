var express = require('express');
var router = express.Router();
var ctrlHome = require('../controllers/home');
var ctrlBlog = require('../controllers/blog');

/* Setup routes to pages */
router.get('/', ctrlHome.home);
router.get('/bloglist', ctrlBlog.blogList);
router.get('/blogadd', ctrlBlog.blogAdd);
router.get('/blogdelete', ctrlBlog.blogDelete);
router.get('/blogedit', ctrlBlog.blogEdit);

module.exports = router;       
