var request = require('request')
, express = require('express')
,assert = require("assert")
,http = require("http");

describe('http tests', function(){

	it('should return valid login page!', function(done){
		http.get('http://localhost:3000/signin', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
	
	it('should show the correct home page!', function(done) {
		request.get(
			    'http://localhost:3000/homepage',
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });

	it('Not redirection to homepage if url is incorrect!', function(done){
		http.get('http://localhost:3000/redirectToHome', function(res) {
			assert.equal(404, res.statusCode);
			done();
		})
	});

	it('should signin!', function(done) {
		request.post(
			    'http://localhost:3000/afterSignIn',
			    { form: { user_name: 'kejruwal',password:'kejru' } },
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
	
	
	it('fetch tweets ', function(done) {
		request.post(
			    'http://localhost:3000/retweet',
			    { form: { user_name: 'sjditis',ID:'53' } },
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
});