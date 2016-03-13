var ejs = require('ejs');
var mysql = require('./mysql');

function profile(req, res){
	console.log("Chutiya spotted at profile.profile");
	console.log(req.session.username+":: at req.session.username");	
	var loadTweets = "select * from tweet_details where retweet_user='"+req.session.username+"'or user_name='"+req.session.username+"' ORDER BY ID DESC ";
	mysql.fetchData(function(err, result){
		if(err){
			throw err;
			}
		else{
			var date=[];
			for(var i=0;i<result.length;i++){
			var	time= result[i].timeofTweet.toString();
			var splitResult = time.split("2016");
			date[i] = splitResult[0];
			}
			var names = [];
			for(var i=0;i<result.length;i++){
				var time = result[i].user_name;
				if(time!=req.session.username){
					names[i]="You Retweeted @"+result[i].user_name;
				}
				else{
					names[i] ="@" +result[i].user_name;
				}
				console.log(names[i]);
			}
			
			ejs.renderFile('./views/updateProfile.ejs',{tweets: result, tweet_time:date, name:names}, function(err, result) {
				if (!err) {
					res.end(result);
					}                    
				else {               
					res.end('An error occurred');              
					console.log(err);           
					}
			});
		}
	}, loadTweets);
}


function updateProfile(req, res){
	console.log("Chutiya spotted at profile.updateProfile");
	
	if(req.session.username!=null){
		console.log("login info :: "+req.session.username);
	
		if(req.param("dob")&&req.param("user_name")&&req.param("BIO")&&req.param("location")&&req.param("profile_pic")){
			var updateProfile = "UPDATE twitterDB.user_details SET dob='"+req.param("dob")+
			"', user_name='"+req.param("user_name")+"', bio='"+req.param("BIO")+"', location='"+req.param("location")+"', " +
			"profile_pic='"+req.param("profile_pic")+"'  WHERE user_name='"+req.session.username+"'";
		}
		
		var updateLoginTable = "UPDATE twitterDB.login_details SET user_name='"+req.param("user_name")+"' " +
				"WHERE user_name='"+req.session.username+"'";
		
	}
	else
		{
		console.log("sign up info :: "+req.session.signupInfo.emailID);
		var updateProfile = "UPDATE twitterDB.user_details SET dob='"+req.param("dob")+
		"', user_name='"+req.param("user_name")+"', bio='"+req.param("BIO")+"', location='"+req.param("location")+"', " +
		"profile_pic='"+req.param("profile_pic")+"'  WHERE email_ID='"+req.session.signupInfo.emailID+"'";
		
		
		var updateLoginTable = "UPDATE twitterDB.login_details SET user_name='"+req.param("user_name")+"' " +
				"WHERE email_ID='"+req.session.signupInfo.emailID+"'";
		}
	
	
	mysql.storeData(function(err, result){
		if(err){
			throw err;
			}
		}
	, updateLoginTable);
	
	mysql.storeData(function(err, result){
		if(err){
			throw err;
			}
		else{
			ejs.renderFile('./views/updateProfile.ejs',{data:"Profile Updated"}, function(err, result) {
				if (!err) {
					res.end(result);
					}                    
				else {               
					res.end('An error occurred');              
					console.log(err);           
					}
			});
			
		}
	}, updateProfile);
}
exports.profile=profile;
exports.updateProfile=updateProfile;


