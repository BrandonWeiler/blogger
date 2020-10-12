var request = require('request');
var apiOptions = {
	server : "http://3.88.29.46" 
  }; 


/* GET bloglist page. */
module.exports.blogList = function(req, res) {
	var requestOptions, path;
    path = '/api/blog';
    requestOptions = { 
        url : apiOptions.server + path,
        method : "GET",
        json : {},
        qs : {} 
        };
    request(
        requestOptions,
        function(err, response, body) {
            renderListPage(req, res, body);
        }
    );
};
/* Render the blog list page */
var renderListPage = function(req, res, responseBody){
    res.render('bloglist', {
        title: 'Blog List',
        pageHeader: {
            title: 'Blog List'
        },
        blogs: responseBody
    });
}; 

/* GET a Single Blog Entry */
module.exports.singleEntry = function(req, res) {
    var requestOptions, path;
    path = "/api/blog/" + req.params.blogid;
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {}
    }; 
    request(
        requestOptions,
        function(err, response, body) {
                renderEditPage(req, res, body);
	}
    );
};                   

/* Render blogadd  */
module.exports.blogAdd = function(req, res) {
  res.render('blogadd', { title: 'Blog Add' });
};     
/* Blog Add Post */
module.exports.addBlog = function(req, res){
    var requestOptions, path, postdata;
    path = '/api/blog';

    postdata = {
        blogTitle: req.body.blogTitle,
        blogText: req.body.blogText,
        dateStamp: Date.now()
    }; 

    requestOptions = {
      url : apiOptions.server + path,
      method : "POST",
      json : postdata
    };
    
    request(
      requestOptions,
      function(err, response, body) {
         if (response.statusCode === 201) {
              res.redirect('/bloglist');
         } else {
              _showError(req, res, response.statusCode);
         } 
      }
    ); 
};                    

/* Blog Edit */
module.exports.edit = function(req, res) {
    var requestOptions, path;
    path = "/api/blog/" + req.params.blogid;
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {}
    }; 
    request(
        requestOptions,
        function(err, response, body) {
                renderEditPage(req, res, body);
        }
    );
};


/* Render the blog edit page */
var renderEditPage = function(req, res, responseBody){
    res.render('blogedit', {
        title: 'Blog Edit',
        pageHeader: {
            title: 'Blog Edit'
        },
        book: responseBody
    });
};


/* Book Edit Post */
module.exports.editBlog = function(req, res){
    var requestOptions, path, postdata;
    var id = req.params.blogid;
    path = '/api/blog/' + id;

    postdata = {
        blogTitle: req.body.blogTitle,
        blogText: req.body.blogText,
        dateStamp: Date.now()
    };

    requestOptions = {
        url : apiOptions.server + path,
        method : "PUT",
        json : postdata
    };

    request(
	requestOptions,
        function(err, response, body) {
            if (response.statusCode === 201) {
                res.redirect('/bloglist');
            } else {
                _showError(req, res, response.statusCode);
            }
        }
    );
};

/* Blog Delete */
module.exports.del = function(req, res) {
    var requestOptions, path;
    path = "/api/blog/" + req.params.blogid;
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {}
    };
    request(
	requestOptions,
        function(err, response, body) {
            renderDeletePage(req, res, body);
        }
    );
};

/* Render the blog delete page */
var renderDeletePage = function(req, res, responseBody){
        res.render('blogdelete', {
        title: 'Blog Delete',
        pageHeader: {
                title: 'Blog Delete'
        },
        blog: responseBody
    });
};

/* Blog Delete Post */
module.exports.deleteBlog = function(req, res){
    var requestOptions, path, postdata;
    var id = req.params.blogid;
    path = '/api/blog/' + id;

    requestOptions = {
	url : apiOptions.server + path,
        method : "DELETE",
        json : {}
    };

    request(
        requestOptions,
        function(err, response, body) {
            if (response.statusCode === 204) {
                res.redirect('/bloglist');
            } else {
                _showError(req, res, response.statusCode);
            }
        }
    );
};                    
                    
