var ejs = require('ejs');
var mysql = require('./mysql');
var homePage = require('./homePage');

exports.follow_user = function(req, res){
	console.log(req.session.username);
	//console.log(req.param("follow"));
	//console.log("OIOIO::"+ user_followed);
	var follow_query = "insert into follow (user_name, following_username)" +
	"values('"+req.session.username+"', '"+req.param("follow")+"')";
	
	//console.log(follow_query+":::::::::::::::::::::");
	mysql.fetchData(function(err, result){
		if(err){
			throw err;
			}			
		}
	, follow_query);	
	res.render('index1');
}

exports.temp = function(req, res){
	console.log("temp");
	res.render('index1');
}

exports.temp1 = function(req, res){
	console.log("temp0oo");
	res.render('index2');
}

exports.search = function(req, res){
	console.log("Search page it is");
	console.log(req.param("search"));
	var search_query = "select * from tweet_details where hashtag='"+req.param("search") +"'";
	console.log(search_query);
	
	mysql.fetchData(function(err, result){
		if(err){
			throw err;
			}
		else{
			var jsonString1 = JSON.stringify(result);
            var tweets = JSON.parse(jsonString1);
           // console.log(tweets[0].raw_text);
			res.send({search_tweets: tweets});
		}
		}
	, search_query);		
	
}