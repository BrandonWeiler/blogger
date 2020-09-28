/* GET bloglist page. */
module.exports.blogList = function(req, res) {
    res.render('bloglist', { title: 'Blog List',
			     entries: [{
				 blogTitle: 'First Blog Entry',
				 blogText: 'This is the first blog post.',
				 dateStamp: '9/21/2020'
			             },
				     {
				 blogTitle: 'Second Blog Entry',
                                 blogText: 'This is the second blog post.',
				 dateStamp: '9/21/2020'
				     },
				     {
				 blogTitle: 'Third Blog Entry',
                                 blogText: 'This is the......wait for it....... THIRD blog post. I am making this one longer to test out and show the padding that i have on the endges of each post. Hopefully this entry is long enough to show it.',
				 dateStamp: '9/21/2020'
				     }]


			   });
};

/* GET blogadd page. */
module.exports.blogAdd = function(req, res) {
  res.render('blogadd', { title: 'Blog Add' });
};     

/* GET blogedit page. */
module.exports.blogEdit = function(req, res) {
  res.render('blogedit', { title: 'Blog Edit' });
};

/* GET blogdelete page. */
module.exports.blogDelete = function(req, res) {
  res.render('blogdelete', { title: 'Blog Delete' });
};
