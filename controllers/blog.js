/* GET bloglist page. */
module.exports.blogList = function(req, res) {
  res.render('bloglist', { title: 'Blog List' });
};

/* GET blogadd page. */
module.exports.blogAdd = function(req, res) {
  res.render('blogadd', { title: 'Blog Add' });
};     
