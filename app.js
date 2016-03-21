var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , session = require('client-sessions');
var fs = require('fs');
var pool = require('./routes/pool');
var home = require('./routes/home');
var homePage = require('./routes/homePage');
var profile = require('./routes/profile');
var app = express();

app.use(session({   
	cookieName: 'session',    
	secret: 'cmpe273_test_string',    
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000,  
	}));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser());


// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

var data = fs.readFileSync('./public/config/pool.conf', 'utf-8');
if(data!=null && typeof data !='undefined'){
	var lines = data.split("\n");
	pool.createPool(lines[0], lines[1])
}
else{
	pool.createPool(100, 400)
}

app.get('/', routes.index);
app.get('/signin', home.signin);
app.post('/aftersignin',homePage.afterSignIn);
app.get('/signup', home.signup);
app.post('/signuppage', home.signuppage);
app.use('/logout', home.signin);
app.use('/addUsername', home.addUsername);
app.use('/updatePage',homePage.aftersignup);
app.use('/profile',profile.profile);
app.use('/insertTweet', homePage.newTweet);
app.use('/updateProfile', profile.updateProfile);
app.get('/homepage', homePage.redirectToHomepage);
app.get('/homepage1', homePage.redirectToHomepage1);
app.post('/retweet', homePage.retweet);
app.get('/index1', user.temp);
app.get('/index2', user.temp1);
app.get('/userprofile/', profile.userprofile);
app.post('/follow_user', user.follow_user);
//app.use('/home', homePage.home);
app.post('/search', user.search);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
