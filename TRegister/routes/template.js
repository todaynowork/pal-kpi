var express = require('express');
var passport = require('../passport');
var router = express.Router();

router.get('/:id', passport.ensureAuthenticated,function(req, res) {
//    if (isLogin(req,res)) {
    	//console.log(req.user);
    	res.render('main', { title: 'Welcome to Course Enroll', title2: 'Enroll Course',user:{id:req.user.mail[0]}, course: req.params.id});
//    }
});

router.get('/list/:courseId', passport.ensureAuthenticated,function(req, res) {
//  if (isLogin(req,res)) {
  	//console.log(req.user);
  	res.render('list', { title: 'List attendees for '+ req.params.courseId , title2: 'List attendees for '+ req.params.courseId,user:{id:req.user.mail[0]}, course: req.params.courseId});
//  }
});

module.exports = router;