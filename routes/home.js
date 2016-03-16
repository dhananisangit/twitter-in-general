var ejs = require('ejs');
var mysql = require('./mysql');
var crypto = require('crypto');

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

function addUsername(req, res){
	res.render('userNamePage');
}
function signuppage(req, res){
    console.log("HI");
	var userInfo = {
	fullName : req.param("fullName"),
	emailID : req.param("emailID"),
	password : req.param("password"),
	};
	console.log(req.param("fullName")+" Chup thai ja");
	var json_responses;
	req.session.signupInfo = userInfo;
	console.log("Chutiya spotted at home.signuppage");
	var allemail = "select email_ID from login_details where email_ID='" + req.param("emailID") + "'";
    var cipher = crypto.createCipher('aes-256-ctr', 'd6F3Efeqwerty')
    var hash = cipher.update(req.param("password"),'utf8','hex')
    hash += cipher.final('hex');
    
    mysql.fetchData(function (err, results) {

        console.log(results);
        if (results.length > 0){
            console.log("email exists");
            json_responses = {"statusCode": 401};
            res.send(json_responses);
            res.end;

        }
        else {
        	console.log(req.param("fullName"));
        	var query1 = "insert into login_details (user_name,password,full_name, email_ID) " +
			"values('"+req.param("fullName")+"','"+hash+"','"+req.param("fullName")+"', " +
					"'"+req.param("emailID")+"')";
        	
        	mysql.fetchData(function(err, result){
        		if(err){
        			throw err;
        			}
        	}, query1);
        	
        	var user_details = "insert into user_details (user_name,full_name, email_ID) " +
        	"values('"+req.param("fullName")+"','"+req.param("fullName")+"', " +
        					"'"+req.param("emailID")+"')";
        	
        	
        	mysql.fetchData(function(err, result){
        		if (result.affectedRows > 0) {
                    console.log("valid Login");
                    json_responses = {"statusCode": 200};
                    res.send(json_responses);
                }
                else {
                    json_responses = {"statusCode": 401};
                    res.send(json_responses);
                }
        	}, user_details);
        }
    }, allemail);
}


exports.signin=signin;
exports.signup=signup;
exports.signuppage=signuppage;
exports.addUsername = addUsername;