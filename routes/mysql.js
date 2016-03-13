var ejs= require('ejs');//importing module ejs
var mysql = require('mysql');//importing module

function getConnection(){
	var connection = mysql.createConnection({
		host : 'localhost',
		user : 'root',
		password : 'sangit',
		database : 'twitterDB',
		port : 3306
	});
	return connection;
}

function fetchData(callback, sqlQuery){
	//console.log("\nSqlquery:: "+ sqlQuery );
	var connection = getConnection();
	connection.query(sqlQuery, function(err, rows, fields){
		if(err){
			console.log("ERROR: " + err.message);
		}
		else{
		//	console.log("DB Results:"+rows);   
			callback(err, rows);
		}
	});
	//console.log("Connection closed");
	connection.end();
}

function storeData(callback, sqlQuery){
	//console.log("it is "+ sqlQuery+" : "+userInfo.userID);
	
	var connection = getConnection();
	connection.query(sqlQuery, function(err, rows, fields){
		if(err){
			console.log("ERROR:"+ err.message);
		}
		else{
		//	console.log("DB Results:"+rows);
			callback(err, rows);
		}
	});
	connection.end();
}

exports.fetchData = fetchData;
exports.storeData=storeData;