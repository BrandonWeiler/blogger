var express = require('express');
var router = express.Router();
var ctrlHome = require('../controllers/home');
var ctrlBlog = require('../controllers/blog');

/* Setup routes to pages */
router.get('/', ctrlHome.home);
router.get('/bloglist', ctrlBlog.blogList);
router.get('/blogadd', ctrlBlog.blogAdd);
router.post('/blogadd/:blogid', ctrlBlog.addBlog);
router.get('/blogedit/:blogid', ctrlBlog.singleEntry);
router.post('/blogedit/:blogid', ctrlBlog.blogEdit);
router.get('/blogdelete/:blogid', ctrlBlog.del);
router.post('/blogdelete/:blogid', ctrlBlog.deleteBlog);

module.exports = router;       
