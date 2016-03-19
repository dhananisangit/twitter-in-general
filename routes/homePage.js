var ejs = require('ejs');
var mysql = require('./mysql');
var homePage = require('./homePage');
var async = require("async");
var crypto = require('crypto');

function afterSignIn(req, res){
	
	var decipher = crypto.createDecipher('aes-256-ctr', 'd6F3Efeqwerty')
	var hash = decipher.update(req.param("password"),'utf8','hex')
	hash += decipher.final('hex');	 
    var getUser = "select * from login_details where user_name='" + req.param("username") + "' and password='" +hash+ "'";
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


function rediectToHomepage(req, res){
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	res.send('index1');
}

function redirectToHomepage(req,res)
{
	async.waterfall([       
         function first(callback){
        	 console.log("spotted at :: "+req.session.username);
        	 //Set these headers to notify the browser not to maintain any cache for the page being loaded
        	 res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        	 //res.render("homePage",{user:req.session.user_name});
        	 var users = "select following_username from follow where user_name='"+req.session.username+"'";
        	 console.log(users);
        	 mysql.fetchData(function(err, result){
        			if(err){
        				throw err;
        				}
        			else{
        				if(result.length>0){
        				console.log(result.length>0);
        				var users_name="";
        				for(var i=0;i<result.length;i++){      				
        					if(result[i].user_name!=req.session.username){     						
        						if(i!=result.length-1){users_name += "'"+result[i].following_username+"'"+", " ;}
        						else{users_name += "'"+result[i].following_username+"'";}
        					}	
        				}			
        				var sjd = users_name;
        				console.log("REQ:"+sjd);
        				}
        				else{
        					var sjd = "You have nothing on your feed. Follow users to view their tweets";
        					console.log(sjd);
        				}
        			}
        			callback(null,sjd);
        		}, users); 
         },
         
       function second(sjd, callback){
        	 
         if(sjd!="You have nothing on your feed. Follow users to view their tweets"){
        	
     		//var users = "select user_name from login_details";
     		//var allUsers = "SELECT * FROM users WHERE username NOT IN (SELECT followed FROM connections WHERE follows = '"+req.session.username+"') AND username != '"+req.session.username+"'";
     		var users = "SELECT user_name FROM login_details WHERE user_name NOT IN (SELECT following_username FROM follow WHERE user_name = '"+req.session.username+"') AND user_name != '"+req.session.username+"'"
     		console.log(users);
     		var users_name = [];
     		mysql.fetchData(function(err, result){
 				if(err){
 					throw err;
 					}
 				else{
 					/*var compare = sjd;
 					for(var i=0;i<compare.length;i++){
 						console.log(compare[i]+"::lplp");
 					}*/
 					for(var i=0;i<result.length;i++){
 						if(result[i].user_name!=req.session.username){
 							//console.log(sjd+"::"+result[i].user_name);
 							users_name[i] = result[i].user_name ;
 						}	
 					}			
 					req.session.followusers = users_name;
 				}
 			}, users);

     		console.log(req.session.followusers+"::yeh h exterior");
     		var loadtweets = "SELECT * FROM tweet_details WHERE user_name IN ("+sjd+", '"+req.session.username+"') ORDER BY ID DESC" ;
     		console.log(loadtweets);
     		
         	mysql.fetchData(function(err, result){
         		if(err){
         			throw err;
         			}
         		else{
         			var sjd1="";
         			console.log(result.length>0);
         			
         		if(result.length>0){
         			
         			console.log(req.session.followusers+":: joile");
         			var date=[];
         			for(var i=0;i<result.length;i++){
         			var	time= result[i].timeofTweet.toString();
         			var splitResult = time.split("2016");
         			date[i] = splitResult[0];
         			}
         			
         			ejs.renderFile('./views/homePage.ejs',{tweets: result, 
         				users:req.session.followusers, 
         				tweet_time:date,  
         				name1:req.session.username }, function(err, result) {
         				if (!err) {
         					res.end(result);
         					}                    
         				else {               
         					res.end('An error occurred');              
         					console.log(err);           
         					}
         			});
         		}
         			
         			else{
         				var sjd="The users you follow have no tweets. Try following some more users";
         				console.log(users_name+"::1st");
         				console.log(req.session.followusers+"::2nd")
         				ejs.renderFile('./views/homePage.ejs',{users:req.session.followusers, 
         					name1:req.session.username,
         					noTweet:sjd}, function(err, result) {
             				if (!err) {
             					res.end(result);
             					}                    
             				else {               
             					res.end('An error occurred');              
             					console.log(err);           
             					}
             			});
         			}
         			
         		}
         		callback(null, sjd1);
         	}, loadtweets);
         	
         }
        	 
        	 else{
        			var users = "select user_name from login_details";
             		var users_name = [];
             		mysql.fetchData(function(err, result){
         				if(err){
         					throw err;
         					}
         				else{
         					console.log("No tweets found as you aint following anyone bitch");
         					for(var i=0;i<result.length;i++){
         						if(result[i].user_name!=req.session.username){	
         							users_name[i] = result[i].user_name ;
         						}	
         					}			        
         					 ejs.renderFile('./views/homePage.ejs', {noTweet:sjd, users:users_name, name1:req.session.username}, function(err, result){
         	        			 if(!err){
         	        				 res.end(result);
         	        			 }
         	        			 else{
         	        				 res.end('An error occured');
         	        				 console.log(err);
         	        			 }
         	        		 });
         				}
         			}, users);
        	 }
         }
	                 
], function(err, result) { // the "complete" callback of `async.waterfall`
    if ( err ) { // there was an error with either `getTicker` or `writeTicker`
        console.warn('Error loading the tweets.',err);
        return;
    } else {
        console.log('Successfully completed operation.');
    }
});		
}


function aftersignup(req, res){
	req.session.username=req.param('username');
	var emailID = req.session.signupInfo.emailID;
	console.log("req.session.signupInfo.emailID at aftersignup::"+req.session.signupInfo.emailID);
	req.session.emailID = emailID;
	console.log("req.session.username::"+req.session.username);
	
	var username = req.param("username"); 
	var query = "UPDATE twitterDB.user_details SET user_name='"+req.param("username")+
	"' WHERE email_ID='"+emailID+"'";
	
	mysql.fetchData(function(err, result){
		if(err){
			throw err;
			}
		}
	, query);
	
	var query1 = "UPDATE twitterDB.login_details SET user_name='"+req.param("username")+
"' WHERE email_ID='"+emailID+"'";
	
	mysql.fetchData(function(err, result){
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
	
	mysql.fetchData(function(err, result){
		if(err){
			throw err;
			}			
		}
	, insertTweet);
	
	homePage.redirectToHomepage(req, res);
	/*var loadTweets = "SELECT * FROM tweet_details ORDER BY ID DESC";
	
	mysql.fetchData(function(err, result){
		if(err){
			throw err;
			}
		else{
			ejs.renderFile('./views/homePage.ejs',{tweets: result, name:req.session.username}, function(err, result) {
				if (!err) {
					res.end(result);
					}                    
				else {               
					res.end('An error occurred');              
					console.log(err);           
					}
			});
		}
	}, loadTweets);*/
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
			var date=[];
			console.log("Chutiya at::homePage.afterSignIn");
			console.log(req.session.followusers);
			for(var i=0;i<result.length;i++){
				var	time= result[i].timeofTweet.toString();
				var splitResult = time.split("2016");
				date[i] = splitResult[0];
				}
			ejs.renderFile('./views/homePage.ejs',{tweets: result,tweet_time:date, name:req.session.username, users:req.session.followusers}, function(err, result) {
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
	mysql.fetchData(function(err, result){
		if(err){
			throw err;
			}			
		}
	, retweet);
	
	homePage.redirectToHomepage(req, res);
}


exports.retweet = retweet;
exports.home = home;
exports.afterSignIn=afterSignIn;
exports.aftersignup=aftersignup;
exports.newTweet=newTweet;
exports.redirectToHomepage = redirectToHomepage;
//exports.loadtweets = loadtweets;