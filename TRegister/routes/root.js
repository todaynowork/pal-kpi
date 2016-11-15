var express = require('express');
var passport = require('../passport');
var router = express.Router();


router.post('/login', passport.authenticate('ldapauth', 
		{
			failureRedirect: '/login',
			failureFlash: true
		}), 
		function(req, res) {
    
	var redirectUrl = '/ng-main#';
    // If we have previously stored a redirectUrl, use that, 
    // otherwise, use the default.
    if (req.session.redirectUrl) {
      redirectUrl = req.session.redirectUrl;
      req.session.redirectUrl = null;
    }
    res.redirect(redirectUrl);
	//res.render('index', { title: 'Hey', message: 'Hello there!'});
});


router.get('/login', function(req, res) {
	res.render('login', {message:req.flash("error")});
});

router.get('/main', passport.ensureAuthenticated,function(req, res) {
//    if (isLogin(req,res)) {
    	//console.log(req.user);
    	res.render('main', { title: 'Hi', message: 'Hello '+ req.user.callupName + 'there!'});
//    }
});


router.get('/ng-main', passport.ensureAuthenticated,function(req, res) {
//  if (isLogin(req,res)) {
  	//console.log(req.user);
  	res.render('ng-view', { title: 'List courses for ' , title2: 'List courses for ',user:{id:req.user.mail[0]}, course: req.params.courseId});
//  }
});

//function isLogin(req,res){
//	if(req.user){
//		return true;
//	}else{
//		res.redirect('/login');
//		return false;
//	}
//}

//
//
//// serve the files out of ./public as our main files
//app.use(express.static(__dirname + '/public'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: false}));
//app.use(passport.initialize());
////app.use(passport.session());
//
//app.post('/login', passport.authenticate('ldapauth', {
//    successRedirect: '/loginsucc',
//    failureRedirect: '/loginerror',
//    session: false
//}), function (req, res, next) {
//	res.send({status: 'ok'});
//});

//router.get('/loginerror', function (req, res, next) {
//        res.send({error:req.flash("error")});
////        res.send({error:"login error"});
//});

//router.get('/loginsucc', function (req, res, next) {
//        res.send({error:"login success"});
//});

router.get('/logout', function (req, res, next) {
    if (req.user) {
        req.logout();
        res.redirect('/');
    } else
        res.redirect('/');
});

module.exports = router;