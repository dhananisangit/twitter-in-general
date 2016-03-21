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


function redirectToHomepage(req, res){
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	res.render('index1');
}

function redirectToHomepage1(req,res)
{
	var fullName = "select full_name from user_details where user_name='"+req.session.username+"'";
	mysql.fetchData(function(err, result){
		if(err){
			throw err;
			}
		else{
			req.session.fullName = result[0].full_name;
			console.log(req.session.fullName);
		}
	}, fullName);	
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
     
     		var users = "SELECT user_name, full_name FROM login_details WHERE user_name NOT IN (SELECT following_username FROM follow WHERE user_name = '"+req.session.username+"') AND user_name != '"+req.session.username+"' limit 3";
     		console.log(users);
     		var users_name = [];
     		console.log("Tweet count is 1");
     		var following = "select COUNT(*) as num1 from follow where following_username='"+req.session.username+"'";
				mysql.fetchData(function(err, result){
					if(err){
						throw err;
					}
					else{
						if(result.length>0){
							console.log("Tweet countrrrrrrrrrrrrrrrrrrrrrrrrr is "+result[0].num1);
							req.session.following=result[0].num1;
						}
						else{
							req.session.following='0';
						}
					}
				}, following);
				
				var followers = "select COUNT(*) as num1 from follow where user_name='"+req.session.username+"'";
				mysql.fetchData(function(err, result){
					if(err){
						throw err;
					}
					else{
						if(result.length>0){
							req.session.followers=result[0].num1;
							console.log("HEYEYEYEYEYEUDHABHA"+result[0].num1);
						}
						else{
							req.session.followers='0';
						}
					}
				}, followers);
				
				
				var tweet_count = "select COUNT(*) as num1 from tweet_details where user_name='"+req.session.username+"' or retweet_user='"+req.session.username+"'";
				console.log("num1:::"+tweet_count);
				mysql.fetchData(function(err, result){
					if(err){
						throw err;
					}
					else{
						if(result.length>0){
							
							req.session.count=result[0].num1;
							console.log("LOPPPPPPPPPPP"+result[0].num1);
						}
						else{
							req.session.count='0'
						}
					}
				}, tweet_count);
				
     		mysql.fetchData(function(err, result){
 				if(err){
 					throw err;
 					}
 				else{					
 					/*for(var i=0;i<result.length;i++){
 						if(result[i].user_name!=req.session.username){
 							users_name[i] = result[i].user_name ;
 						}	
 					}	*/		
 					req.session.followusers = result;
 					console.log(req.session.followusers+"::yeh h exterior part1");
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
         			console.log(result.length>0+"::AA sachu che ");
         			
         		if(result.length>0){
         			
         			console.log(req.session.followusers+":: joile");
         			var date=[];
         			for(var i=0;i<result.length;i++){
         			var	time= result[i].timeofTweet.toString();
         			var splitResult = time.split("2016");
         			date[i] = splitResult[0];
         			}
         			//console.log()
         			
         			res.send({tweets: result, 
         				users:req.session.followusers, 
         				tweet_time:date,
         				following:req.session.following,
         				followers:req.session.followers,
         				count:req.session.count,
         				name1:req.session.username,
         				fullName:req.session.fullName});
         		}
         			
         			else{
         				var sjd="The users you follow have no tweets. Try following some more users";
         				console.log(users_name+"::1st");
         				console.log(req.session.followusers+"::2nd");
         				res.send({users:req.session.followusers, 
         					name1:req.session.username,
         					tweets:sjd,
         					fullName:req.session.fullName});
         			}
         			
         		}
         		callback(null, sjd1);
         	}, loadtweets);
         	
         }
        	 
        	 else{
        			var users = "select * from tweet_details where user_name='"+req.session.username+"'";
             		var users_name = [];
             		mysql.fetchData(function(err, result){
         				if(err){
         					throw err;
         					}
         				else{
         					req.session.following='0';
             				req.session.followers='0';
             				req.session.count='0';
         				//	console.log("No tweets found as you aint following anyone bitch");
         					/*for(var i=0;i<result.length;i++){
         						if(result[i].user_name!=req.session.username){	
         							users_name[i] = result[i].user_name ;
         						}	
         					}	*/	
             				if(result.length>0){
             					
        
         					 res.send({
         						 tweets:result, 
         						 users:users_name, 
         						 name1:req.session.username,
         						 following:req.session.following,
                 				 followers:req.session.followers,
                 				 count:req.session.count,
                 				 fullName:req.session.fullName
                 				});
             				}
             				else{
             					 res.send({
             						 tweets:sjd, 
             						 users:users_name, 
             						 name1:req.session.username,
             						 following:req.session.following,
                     				 followers:req.session.followers,
                     				 count:req.session.count,
                     				 fullName:req.session.fullName
                     				});
             				}
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
	req.session.fullName=req.param('fullName');
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
			res.render('index1');			
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
	
	console.log(insertTweet);
	mysql.fetchData(function(err, result){
		if(err){
			throw err;
			}			
		}
	, insertTweet);
	
	res.render('index1');
}

function retweet(req, res){
	console.log(req.session.username);
	//console.log();
	
	//console.log(req.param("tweetID")+"Kauno chutiya h be????????????????????????????");
	var retweet = "update tweet_details set retweet_count=retweet_count+1, retweet_user='"+req.session.username+"' where id='"+req.param("tweetID")+"'";
	console.log(retweet);
	mysql.fetchData(function(err, result){
		if(err){
			throw err;
			}			
		}
	, retweet);
	
	res.render('index1');
	
}


exports.retweet = retweet;
exports.afterSignIn=afterSignIn;
exports.aftersignup=aftersignup;
exports.newTweet=newTweet;
exports.redirectToHomepage = redirectToHomepage;
exports.redirectToHomepage1 = redirectToHomepage1;
