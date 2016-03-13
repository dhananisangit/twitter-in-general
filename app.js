var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , session = require('client-sessions');
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

app.get('/', routes.index);
app.get('/signin', home.signin);
app.post('/aftersignin',homePage.afterSignIn);
app.get('/signup', home.signup);
app.post('/signuppage', home.signuppage);
app.use('/logout', home.signin);
app.use('/updatePage',homePage.aftersignup);
app.use('/profile',profile.profile);
app.use('/insertTweet', homePage.newTweet);
app.use('/updateProfile', profile.updateProfile);
app.get('/homepage', homePage.redirectToHomepage);
app.get('/retweet', homePage.retweet);

app.get('/follow_user', user.follow_user);
app.use('/home', homePage.home)

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
