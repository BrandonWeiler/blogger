var mongoose = require('mongoose');
var Blog = mongoose.model('Blog');
var Comment = mongoose.model('Comment');

var sendJSONresponse = function(res, status, content){
	res.status(status);
	res.json(content);
};


/* GET a blog by the id */
module.exports.blogReadOne = function(req, res) {
	console.log('Finding location details', req.params);
	if (req.params && req.params.blogid) {
	  Blog
		.findById(req.params.blogid)
		.exec(function(err, blog) {
		  if (!blog) {
			sendJSONresponse(res, 404, {
			  "message": "blogid not found"
			});
			return;
		  } else if (err) {
			console.log(err);
			sendJSONresponse(res, 404, err);
			return;
		  }
		  console.log(blog);
		  sendJSONresponse(res, 200, blog);
		});
	} else {
	  console.log('No blogid specified');
	  sendJSONresponse(res, 404, {
		"message": "No blogid in request"
	  });
	}
  };

  /* GET a list of all blogs */
module.exports.blogList = function(req, res) {
	console.log('Getting list of blogs...');
	Blog
		.find()
		.exec(function(err, results) {
		  if (!results) {
			sendJSONresponse(res, 404, {
			  "message": "no blogs found"
			});
			return;
		  } else if (err) {
			console.log(err);
			sendJSONresponse(res, 404, err);
			return;
		  }
		  console.log(results);
		  sendJSONresponse(res, 200, buildBlogList(req, res, results));
		}); 
  };
  
  var buildBlogList = function(req, res, results) {
	var blogs = [];
	results.forEach(function(obj) {
	  blogs.push({
		blogTitle: obj.blogTitle,
		blogText: obj.blogText,
		userName: obj.userName,
		email: obj.email,
		dateStamp: obj.dateStamp,
		_id: obj._id
	  });
	});
	return blogs;
  };

/* POST a new blog */
module.exports.blogCreate = function(req, res) {
	console.log(req.body);
	Blog
	 .create({
		blogTitle: req.body.blogTitle,
		blogText: req.body.blogText,
		email: req.body.email,
		userName: req.body.userName
		
	   }, function(err, blog) {
		 if (err) {
			console.log(err);
			sendJSONresponse(res, 400, err);
		 } else {
			console.log(blog);
			sendJSONresponse(res, 201, blog);
		 }
	   }
	 );
  };   
  
/* Update one blog entry */
module.exports.blogUpdateOne = function(req, res) {
    console.log("Updating a blog entry with id of " + req.params.blogid);
    console.log(req.body);
    Blog
  	  .findOneAndUpdate(
	     { _id: req.params.blogid },
 	     { $set: {"blogTitle": req.body.blogTitle, "blogText": req.body.blogText}},
	     function(err, response) {
	         if (err) {
	  	         sendJSONresponse(res, 400, err);
	         } else {
		        sendJSONresponse(res, 201, response);
	        }
	    }
    );
};

/* Delete one blog entry */
module.exports.blogDeleteOne = function(req, res) {
    console.log("Deleting blog entry with id of " + req.params.blogid);
    console.log(req.body);
    Blog
        .findByIdAndRemove(req.params.blogid)
        .exec (
            function(err, response) {
                if (err) {
                            sendJSONresponse(res, 404, err);
                } else {
                            sendJSONresponse(res, 204, null);
                }
            }
        );
};

/* Add comment to ping */
module.exports.commentAdd = function(req, res) {
//	console.log("Adding comment to ping with id of " + req.params.blogid);
//	console.log(req.body);
//	const commentID = req.body.blogid;
//	const comment = req.body.commentText;
//	const cName = req.body.commentName;
//
//	const newComment = new Comment({
//		commentID,
//		comment,
//		cName,
//		commentDateStamp,
//	});
//
//	newComment.save()
//	.then(() => res.json('Comment added'))
//
	//.catch(err => res.status(400).json('Error: ' + err));
     console.log(req.body);
     Comment
	.create({
		commentID: req.body.commentID,
		commentText: req.body.commentText,
		commentName: req.body.commentName,
		commentDateStamp: req.body.commentDateStamp
	}, function(err, comment) {
		if (err) {
			console.log(err);
			sendJSONresponse(res, 400, err);
		} else {
		//	console.log(comment);
			sendJSONresponse(res, 201, comment);
		}
	}
	);

};

/* Get comments for a particular ping */
//module.exports.commentGet = function(req, res) {
//	Comment.find({commentID: req.params.blogid})
//	.then(() => res.json(res.data))
//    .catch(err => res.status(400).json('Error: ' + err));
//}

module.exports.commentGet = function(req, res){
	console.log('Getting list of comments');
	Comment
		.find()
		.exec(function(err, results){
			if(!results){
				sendJSONresponse(res, 404, {
					"message": "no comments found"
				});
				return;
			} else if (err){
				console.log(err);
				sendJSONresponse(res, 404, err);
				return;
			}
			console.log(results);
			sendJSONresponse(res, 200, buildCommentList(req, res, results));
		});
};
var buildCommentList = function(req, res, results){
	var comments = [];
	results.forEach(function(obj) {
		comments.push({
			commentID: obj.commentID,
			commentText: obj.commentText,
			commentName: obj.commentName,
			commentDateStamp: obj.commentDateStamp
			});
	});
	return comments;
};
