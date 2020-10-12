var express = require('express');
var router = express.Router();
var ctrlBlog = require('../controllers/blog');

router.get('/blog', ctrlBlog.blogList);
router.get('/blog:blogid', ctrlBlog.blogReadOne);
router.put('/blog', ctrlBlog.blogUpdateOne);
router.post('/blog', ctrlBlog.blogCreate);
router.delete('/blog', ctrlBlog.blogDeleteOne);

module.exports = router;