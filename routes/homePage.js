var ejs = require('ejs');
var mysql = require('./mysql');
var homePage = require('./homePage');
//var async = require("async");


function afterSignIn(req, res){

	 var getUser = "select * from login_details where user_name='" + req.param("username") + "' and password='" + req.param("password") + "'";
	    req.session.username = req.param("username");
	    console.log("req.session.username at homePage.afterSignIn::"+req.session.username);
	    var json_responses;
	    var user_name=req.param("username");
	    var password=req.param("password");

	    mysql.fetchData(function (err, results) {
		if(user_name!== ''  && password!== '')
		{
	            if (results.length > 0) {
	                console.log("valid Login");
	                json_responses = {"statusCode": 200};
	                res.send(json_responses);
	            }
	            else {
	                json_responses = {"statusCode": 401};
	                res.send(json_responses);
	            }
	        }
	        else
	        {
	    json_responses = {"statusCode" : 401};
	    res.send(json_responses);
	        }

	    }, getUser);
}

function redirectToHomepage(req,res)
{
    //Checks before redirecting whether the session is valid
    if(req.session.username)
    {
    	console.log("spotted at :: "+req.session.username);
        //Set these headers to notify the browser not to maintain any cache for the page being loaded
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        //res.render("homePage",{user:req.session.user_name});
        var users = "select user_name from login_details";
    	mysql.fetchData(function(err, result){
    		if(err){
    			throw err;
    			}
    		else{
    			var users_name = new Array(result.length);
    			for(var i=0;i<result.length;i++){
    				if(result[i].user_name!=req.session.loginInfo){
    					users_name[i] = result[i].user_name ;
    				}	
    			}			
    			req.session.followusers = users_name;
    		}
    	}, users);
    	
    	if(req.session.username){
    	var loadTweets = "select * from tweet_details ORDER BY ID DESC";
    	mysql.fetchData(function(err, result){
    		if(err){
    			throw err;
    			}
    		else{
    			console.log("Chutiya at::homePage.afterSignIn");
    			//console.log(req.session.followusers);
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
    			//	console.log(names[i]);
    			}
    			ejs.renderFile('./views/homePage.ejs',{tweets: result, 
    				users:req.session.followusers, 
    				tweet_time:date, 
    				name:names, 
    				name1:req.session.username}, function(err, result) {
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
    }
    else
    {
        res.redirect('/');
    }
}
	
/*	if(req.session.username)
    {
		var following_users="";
    	console.log("spotted at :: "+req.session.username);
        //Set these headers to notify the browser not to maintain any cache for the page being loaded
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        //res.render("homePage",{user:req.session.user_name});
        var users = "select distinct following_username from follow_details where user_name='"+req.session.username+"'";
    	mysql.fetchData(function(err, result){
    		if(err){
    			throw err;
    			}
    		else{
    			var following_users="";
    			var num = result.length;
    			for(var i=0;i<result.length;i++){
    		    	
    				if(i!=result.length-1){
    		    	following_users += '+result[i].following_username+, ';
    				}
    				else{
    					following_users +='+result[i].following_username+';
    				}
    	
    			}
    			console.log(following_users);
    			console.log("2");
    			req.session.fusers=following_users;
    		}   		
    	}, users);  
    }
	homePage.loadtweets(req, res);
}

function loadtweets(req, res){
	//var loadtweets = "select raw_text from tweet_details where user_name in ('"+req.session.fusers+"')";
	var loadtweets = "SELECT raw_text FROM tweet_details WHERE user_name IN ('"+req.session.fusers+"')" ;
	console.log("1");
	//console.log(following_users);
	console.log("OIOI"+loadtweets); 
	mysql.fetchData(function(err, result){
		if(err){
			throw err;
			}
		else{
			console.log(result.length>0);
			console.log("hahaa");
			ejs.renderFile('./views/homePage.ejs',{tweets: result}, function(err, result) {
				if (!err) {
					res.end(result);
					}                    
				else {               
					res.end('An error occurred');              
					console.log(err);           
					}
			});
		}
	}, loadtweets);
	
}*/

function aftersignup(req, res){
	req.session.username=req.param('username');
	var emailID = req.session.signupInfo.emailID;
	console.log("req.session.signupInfo.emailID at aftersignup::"+req.session.signupInfo.emailID);
	req.session.emailID = emailID;
	console.log("req.session.username::"+req.session.username);
	
	var username = req.param("username"); 
	var query = "UPDATE twitterDB.user_details SET user_name='"+req.param("username")+
	"' WHERE email_ID='"+emailID+"'";
	
	mysql.storeData(function(err, result){
		if(err){
			throw err;
			}
		}
	, query);
	
	var query1 = "UPDATE twitterDB.login_details SET user_name='"+req.param("username")+
"' WHERE email_ID='"+emailID+"'";
	
	mysql.storeData(function(err, result){
		if(err){
			throw err;
			}
		else{
			ejs.renderFile('./views/updateProfile.ejs',{data:""}, function(err, result) {
				if (!err) {
					res.end(result);
					}                    
				else {               
					res.end('An error occurred');              
					console.log(err);           
					}
			});			
		}
	}, query1);	
}

function newTweet(req, res){
	console.log(req.session.username);
	var tweet = req.param('tweet_box');
	
	if(tweet.match(/#\S+/g) && tweet.match(/@\S+/g)){
		var parsedHashtag = tweet.match(/#\S+/g).toString();
		var parsedUsername = tweet.match(/@\S+/g).toString();
		var insertTweet = "insert into tweet_details(user_name,raw_text, user_tagged, hashtag) values('"+req.session.username+"','"+req.param("tweet_box")+"', '"+parsedUsername+"', '"+parsedHashtag+"')";
	}
	else if(tweet.match(/#\S+/g)){ 
		var parsedHashtag = tweet.match(/#\S+/g).toString();
		var insertTweet = "insert into tweet_details(user_name,raw_text, hashtag) values('"+req.session.username+"','"+req.param("tweet_box")+"', '"+parsedHashtag+"')";
	}
	else if(tweet.match(/@\S+/g)){
		var parsedUsername = tweet.match(/@\S+/g).toString();
		var insertTweet = "insert into tweet_details(user_name,raw_text, user_tagged) values('"+req.session.username+"','"+req.param("tweet_box")+"', '"+parsedUsername+"')";
	}
	else{
		var insertTweet = "insert into tweet_details(user_name,raw_text) values('"+req.session.username+"','"+req.param("tweet_box")+"')";
	}
	
	mysql.storeData(function(err, result){
		if(err){
			throw err;
			}			
		}
	, insertTweet);
	
	var loadTweets = "SELECT * FROM tweet_details ORDER BY ID DESC";
	mysql.fetchData(function(err, result){
		if(err){
			throw err;
			}
		else{
			ejs.renderFile('./views/homePage.ejs',{tweets: result}, function(err, result) {
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

function home(req, res){
	console.log(req.session.username);
	var users = "select user_name from login_details";
	mysql.fetchData(function(err, result){
		if(err){
			throw err;
			}
		else{
			var users_name = new Array(result.length);
			for(var i=0;i<result.length;i++){
				if(result[i].user_name!=req.session.username){
					
					users_name[i] = result[i].user_name ;
				}	
			}			
			req.session.followusers = users_name;
		}
	}, users);
	
	if(req.session.username){
	var loadTweets = "select * from tweet_details ORDER BY ID DESC";
	mysql.fetchData(function(err, result){
		if(err){
			throw err;
			}
		else{
			console.log("Chutiya at::homePage.afterSignIn");
			console.log(req.session.followusers);
			ejs.renderFile('./views/homePage.ejs',{tweets: result, name:req.session.username, users:req.session.followusers}, function(err, result) {
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
	else{
		res.render('homePage');
	}
}


function retweet(req, res){
	console.log(req.session.username);
	console.log(req.param("retweet"));
	var retweet = "update tweet_details set retweet_count=retweet_count+1, retweet_user='"+req.session.username+"' where id='"+req.param("retweet")+"'";
	mysql.storeData(function(err, result){
		if(err){
			throw err;
			}			
		}
	, retweet);
	
	var loadTweets = "select * from tweet_details ORDER BY ID DESC";
	mysql.fetchData(function(err, result){
		if(err){
			throw err;
			}
		else{
			console.log("Chutiya at::homePage.afterSignIn");
			console.log(req.session.followusers);
			ejs.renderFile('./views/homePage.ejs',{tweets: result, name:req.session.username, users:req.session.followusers}, function(err, result) {
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


exports.retweet = retweet;
exports.home = home;
exports.afterSignIn=afterSignIn;
exports.aftersignup=aftersignup;
exports.newTweet=newTweet;
exports.redirectToHomepage = redirectToHomepage;
//exports.loadtweets = loadtweets;