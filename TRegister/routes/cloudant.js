/**
*  Node.js adapter for Cloudant using the Nano client library
*/

var config={};

var cfenv = require('cfenv');

var appEnv = cfenv.getAppEnv();
console.log("app env");
console.log(appEnv);
console.log("process env");
console.log(process.env.VCAP_SERVICES);

if (process.env.VCAP_SERVICES) {
   var env = JSON.parse(process.env.VCAP_SERVICES);
   config = env['cloudantNoSQLDB'][0].credentials;
   config.database = "pal_kpi";
} else {
   config = {
      "username" : "<userid>",
      "password" : "<password>",
      "database" : "pal_kpi",
      "url" : "https://4bc6db0a-8dc3-4f50-8e8c-7607fbf40d91-bluemix:ef85790db425266ea015de5d8cfa87b4aefc432c3ca63aac7c3f73084e960a2b@4bc6db0a-8dc3-4f50-8e8c-7607fbf40d91-bluemix.cloudant.com"
      };
}

var url = config.url + '/' + config.database;
console.log('Connecting to: ' + url);
var db = require('nano')(url);


exports.findAll = function(req, res) {
	db.list({include_docs: true, descending: true}, function (err, body, headers) {
	  if (err) {
		  console.log('error!!!' + err);
  	  		return;
  		}
  	 
      console.log('you have retrieved all the Wines.')
      console.log(body);
      res.send(body);
	});
};

exports.deleteBy_Id = function(req, res) {
    var id = req.params.id;
    console.log('Deleting wine: ' + id);
    db.get(id, { revs_info: true }, function(err, body) {
		if (!err){
			db.destroy(id,body._rev , function(err, body) {
				if (err){
					res.send("Error in deleting");
				}else{
					res.send(body);
				}
			});
		} else {
			res.send(err);
		}
	});
};

exports.update = function(req, res) {
    var id = req.params.id;
    var wine = req.body;
    console.log('Updating wine: ' + id);
    console.log(JSON.stringify(wine));
	db.get(id, function (error, existing) { 
		if(!error){ 
			wine._rev = existing._rev;
			db.insert(wine, id, function(err, body, headers){
			if (err) {
				console.log('error!!!');
					res.send(err);
			}
			  console.log('you have inserted data.')
			  console.log(body);
			  res.send(body);
			});
		}else{
			res.send(error);
		}

	});
};

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving wine: ' + id);
    db.get(id, { revs_info: true }, function(err, body) {
    if (!err)
    	console.log(body);
     	console.log('you have retrieved ' + id);
		res.send(body);
    });

};


exports.add = function(req, res) {
    var jsondata = req.body;
    console.log('Adding json: ' + JSON.stringify(jsondata));
	db.insert( jsondata, function (err, body, headers) {
	  if (err) {
  	  		res.send(err);
  	  }
      console.log('you have inserted the data.')
      console.log(body);
		res.send(body);

	});
};

exports.findCourse = function(req, res) {
	
	console.log(">>findCourse");
	var id = req.params.courseId;
	console.log("id="+id);
	db.view('courseDesign', 'enroll',{ keys: [id] }, function(err, body) {
		if (!err) {
			body.rows.forEach(function(doc) {
			      console.log(doc.value);
			});
			console.log("<<findCourse with value");
			res.send(body);
		}else {
			console.log("<<findCourse with error");
			res.send(err);
		}
	});
};
// 
//exports.search = function(req, res) {
//	var data = req.params.query;
//	
//	db.search('winesearch', 'twsUserSubscrib', { q: data}, function(err, body) {
//		if (!err) {
//			//body.rows.forEach(function(doc) {
//			//	console.log(doc);
//  			//});
//  			console.log(body);
//			res.send(body);
//		}else{
//			res.send(err);
//		}
//	});
//
//};
//
//exports.searchUser = function(req, res) {
//	var data = req.params.query;
//	
//	db.search('winesearch', 'twsUserSubscrib', { q: data}, function(err, body) {
//		if (!err) {
//			//body.rows.forEach(function(doc) {
//			//	console.log(doc);
//  			//});
//  			console.log(body);
//			res.send(body);
//		}else{
//			res.send(err);
//		}
//	});
//
//};
//
//
//exports.addWine = function(req, res) {
//    var wine = req.body;
//    console.log('Adding wine: ' + JSON.stringify(wine));
//	db.insert( wine, function (err, body, headers) {
//	  if (err) {
//  	  		res.send(err);
//  	  }
//      console.log('you have inserted the Wine.')
//      console.log(body);
//		res.send(body);
//
//	});
//};
// 
//exports.updateWine = function(req, res) {
//    var id = req.params.id;
//    var wine = req.body;
//    console.log('Updating wine: ' + id);
//    console.log(JSON.stringify(wine));
//	db.get(id, function (error, existing) { 
//		if(!error){ 
//			wine._rev = existing._rev;
//			db.insert(wine, id, function(err, body, headers){
//			if (err) {
//				console.log('error!!!');
//					res.send(err);
//			}
//			  console.log('you have inserted data.')
//			  console.log(body);
//			  res.send(body);
//			});
//		}else{
//			res.send(error);
//		}
//
//	});
//};
//    
// 
//exports.deleteWine = function(req, res) {
//    var id = req.params.id;
//    console.log('Deleting wine: ' + id);
//	db.search('winesearch', 'twsUserSubscrib', { q: id}, function(err, body) {
//		if (!err){
//			var rows = body.rows;
//			if(rows && rows.length> 0){
//				var index, len;
////				for (index = 0, len = rows.length; index < len; ++index) {
//					var rowid = rows[0].id;
//				    db.get(rowid, { revs_info: true }, function(err, body) {
//						if (!err){
//							db.destroy(rowid,body._rev , function(err, body) {
//								if (!err){
//									res.send(err);
//								}else{
//									res.send(body);
//								}
//							});
//						}
//					});
////				}
//			} else {
//				res.send({result: 'No result'});
//			}
//		} else {
//			res.send(err);
//		}
//	});
//};
//
//exports.deleteWineBy_Id = function(req, res) {
//    var id = req.params.id;
//    console.log('Deleting wine: ' + id);
//    db.get(id, { revs_info: true }, function(err, body) {
//		if (!err){
//			db.destroy(id,body._rev , function(err, body) {
//				if (err){
//					res.send("Error in deleting");
//				}else{
//					res.send(body);
//				}
//			});
//		} else {
//			res.send(err);
//		}
//	});
//};


 