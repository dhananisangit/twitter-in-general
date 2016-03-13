var ejs = require('ejs');
var mysql = require('./mysql');

function signin(req, res){
	
	if(req.session.loginInfo){
		console.log(req.session.loginInfo+" Chutiya spotted");
		req.session.loginInfo=null;
	}	
	if(req.session.loginInfo){
		console.log(req.session.loginInfo+" Chutiya still present");
	}
	else{
		console.log("Chutiya bhag gaya");
	}
	
	ejs.renderFile('./views/signin.ejs',function(err, result) {
		if (!err) { 
			res.end(result);
		}
		else{
			res.end('An error occurred');
			console.log(err);
		}
	});
}

function signup(req, res){
	res.render('signup');
}

function signuppage(req, res){
		
	var userInfo = {
	fullName : req.param("fullName"),
	emailID : req.param("emailID"),
	password : req.param("password"),
	};
	
	req.session.signupInfo = userInfo;
	console.log("Chutiya spotted at home.signuppage");
	
	var user_details = "insert into user_details (user_name,full_name, email_ID) " +
	"values('"+req.param("fullName")+"','"+req.param("fullName")+"', " +
					"'"+req.param("emailID")+"')";
	
	
	mysql.storeData(function(err, result){
		if(err){
			throw err;
			}
		}
	, user_details);
	
	
	var query1 = "insert into login_details (user_name,password,full_name, email_ID) " +
			"values('"+req.param("fullName")+"','"+req.param("password")+"','"+req.param("fullName")+"', " +
					"'"+req.param("emailID")+"')";
	
	console.log("hello from home.signuppage");
	mysql.storeData(function(err, result){
		if(err){
			throw err;
			}
		else{
			ejs.renderFile('./views/userNamePage.ejs', {data:result}, function(err, result) {
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


exports.signin=signin;
exports.signup=signup;
exports.signuppage=signuppage;