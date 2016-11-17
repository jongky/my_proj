var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

/***************************************************************************/
/* 1. Common Parameters for MongoDB and Server Port :                         */
/***************************************************************************/
var MONGODB_URL="localhost";
var MONGODB_DBS="mongodb://localhost:27017/test";
var MONGODB_DBS_NAME="test"
var MONGODB_CONTACTS_COLLECTION = "contacts";
var APP_SEVER_PORT = 3333;

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());


/***************************************************************************/
/* 2. Open MongoDB and start main Server Code                              */
/***************************************************************************/
// Create a database variable outside of the database connection callback 
// to reuse the connection pool in your app.
var my_db;
var my_server_port;

// Connect to the database before starting the application server. 
console.log("[server: 1.0] MongoDB.connecting : Begin ---->");
mongodb.MongoClient.connect(MONGODB_DBS, function(err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  // my_db = 'test';
  my_db = database;

  my_server_port = APP_SEVER_PORT;
  console.log("[server: 2.2] MongoDB.connected : DB= [%s]", MONGODB_DBS_NAME);

  // Initialize the app.
  console.log("[server: 2.3] APP.listen : connecting on Port[%s] ---->", my_server_port);
  var server = app.listen(my_server_port, function () {
    var port = server.address().port;
    console.log("[server: 2.4] APP.listen : App is running on Port[%s]", my_server_port);
  });
});


// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("[server: 9.1] handleError : Begin ---->");
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
  console.log("[server: 9.2] handleError : End <----");
}


/*******************************************************************
 * Main Route Entry Point :   
 * "/contacts"
 *    GET: finds all contacts
 *    POST: creates a new contact
 *******************************************************************/
console.log("[server: 1.1] app route : Begin ---->");

// CONTACTS API ROUTES BELOW

console.log("[server: 1.2] app route : contacts Object");
var api_contacts = require('./api_contacts.js');
app.route('/contacts')
.get(api_contacts.get_contacts)
.post(api_contacts.post_contacts);
app.get('/contacts/:id', api_contacts.get_contacts_id);
app.put('/contacts/:id', api_contacts.put_contacts);
app.delete('/contacts/:id', api_contacts.delete_contacts);

console.log("[server: 1.9] app route : End: <----");

exports.my_db    = my_db;
