var express = require('express');
var app = express();

var username_global;

//var bodyparser = require('body-parser');
//app.use(bodyparser.json());

//app.use(require('connect').bodyParser());

var database = require("./db_config.js");



app.get('/index.html', function (req, res) {
    res.sendFile( __dirname + "/" + "index.html" );
 })


 app.get('/register', function (req, res) {
    database.driver.connect(database.url, function(err, db) {
     if (err) throw err;
     var flag=0;
     var dbo = db.db(database.db_name);
     var myobj = { username: req.query.username, password: req.query.password };
     var username = {username: myobj.username};
     dbo.collection(database.user_table).find(username).toArray(function(err, result) {
      if (err) throw err;
      if(result.length==1){
        flag=1;
        res.send("Username occupied");  
      }
    }); 
    if(flag==0){
     dbo.collection(database.user_table).insertOne(myobj, function(err, result) {
       if (err) throw err;
       console.log(myobj.username+"   "+myobj.password+"  "+"inserted");
       db.close();
       res.send("Successfully registerd!!");
     });
    }
    // res.send("");
   });
 })


 app.get('/login', function (req, res) {
  database.driver.connect(database.url, function(err, db) {
   if (err) throw err;
   var dbo = db.db(database.db_name);
   var myobj = { username: req.query.username, password: req.query.password };
   var username = {username: myobj.username};
   dbo.collection(database.user_table).find(username).toArray(function(err, result) {
    if (err) throw err;
    if(result.length==1 && result[0].password==myobj.password){
      username_global = username;
      res.sendFile( __dirname + "/" + "home.html" );
    }
    else{
      res.send("Username or password is incorrect!!");
    }
    console.log(result);
    db.close();
   }); 
   
 });
})
 
app.get('/posting', function (req, res) {
    database.driver.connect(database.url, function(err, db) {
    if (err) throw err;
    var flag=0;
    var dbo = db.db(database.db_name);
    var myobj = { username: username_global, content : req.query.content };  
    dbo.collection(database.content_table).insertOne(myobj, function(err, result) {
      if (err) throw err;
      console.log(myobj.username+"   "+myobj.content+"  "+"inserted");
      db.close();
      res.send("Successfully posted!!");
    });
  });
})

app.get('/viewpost', function (req, res) {
  database.driver.connect(database.url, function(err, db) {
   if (err) throw err;
   var dbo = db.db(database.db_name);
   //var myobj = { username: req.query.username, password: req.query.password };
   //var username = {username: myobj.username};
   dbo.collection(database.content_table).find({}).toArray(function(err, result) {
    if (err) throw err;
    res.send(JSON.stringify(result));
    console.log(result);
    db.close();
   }); 
   
 });
})
 

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Blog listening at http://%s:%s", host, port)
 })