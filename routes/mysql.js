/*var mysql = require('mysql');//importing module
var pool = require('./pool');


function fetchData(callback, sqlQuery){
	
	console.log("\nSqlquery:: "+ sqlQuery );
	var connection = pool.getConnectionFromPool();
	
		connection.query(sqlQuery, function(err, rows, fields){
			if(err){
				console.log("ERROR: " + err.message);
			}
			else{
			//	console.log("DB Results:"+"hellllloooooo");   
				callback(err, rows);
			}
		});
		pool.releaseConnection(connection);
	
}
*/




/*
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
}*/
var mysql = require('mysql');

var pool      =    mysql.createPool({
    connectionLimit : 100, //important
    host : 'localhost',
	user : 'root',
	password : 'sangit',
	database : 'twitterDB',
	port : 3306
});

function fetchData(callback, sqlQuery){
	//console.log("\nSqlquery:: "+ sqlQuery );
	pool.getConnection(function(err, connection){
		connection.query(sqlQuery, function(err, rows, fields){
			if(err){
				console.log("ERROR: " + err.message);
			}
			else{
			//	console.log("DB Results:"+"hellllloooooo");   
				callback(err, rows);
			}
		});
		connection.release();
	});
	
}



exports.fetchData = fetchData;