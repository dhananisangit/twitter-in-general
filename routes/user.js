var ejs = require('ejs');
var mysql = require('./mysql');
var homePage = require('./homePage');

exports.follow_user = function(req, res){
	console.log(req.session.username);
	console.log(req.param("follow"));
	//console.log("OIOIO");
	var follow_query = "insert into follow_details (user_name, following_username)" +
	"values('"+req.session.username+"', '"+req.param("follow")+"')";
	
	
	mysql.storeData(function(err, result){
		if(err){
			throw err;
			}			
		}
	, follow_query);	
	homePage.home(req, res);
}