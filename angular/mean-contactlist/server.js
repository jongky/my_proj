var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

/***************************************************************************/
/* 1. Common Parameters for MongoDB and Server Port :                         */
/***************************************************************************/
var MONGODB_URL="localhost";
var MONGODB_URL="mongodb://localhost:27017/";
var MONGODB_NAME="test"
var MONGODB_CONTACTS_COLLECTION = "contacts";
var MEAN_SEVER_PORT = 3333;

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

var log4js = require( "log4js" );
log4js.configure( "./config/log4js.json" );
var logger = log4js.getLogger( "test-file-appender" );

/***************************************************************************/
/* 2. Open MongoDB and start main Server Code                              */
/***************************************************************************/
// Create a database variable outside of the database connection callback 
// to reuse the connection pool in your app.
mydb = null;
var my_server_port;

// Connect to the database before starting the application server. 
logger.debug("[server: 1.0] MeanServer: Started ---->");

function connect_to_mongo(db_name) {
    var url = MONGODB_URL + MONGODB_NAME;
    logger.debug('[server: 1.1] MeanServer connecting to MongoDB: '  + url);
    MongoClient.connect(url, on_connect_bind(db_name, url));

}
function on_connect_bind(db_name, url) {
    function __on_connect(err, db) {
        if (err) {
            logger.debug("[server: 1.11] MeanServer: ERROR: failed to open " + url + ", err= " + err);
            setTimeout(connect_to_mongo, 30000, db_name); // retry after 30 sec
        }
        else {
            logger.debug("[server: 1.2] MeanServer DB conn to [%s] is OK, continuing init..", db_name);
            //if( db_name == 'contacts')
            mydb = db;
        }
    }
    return __on_connect;
}

connect_to_mongo('contacts');
setTimeout(all_ready, 2000);
function all_ready() {
    if( mydb == null) {
        logger.debug("[server: 2.11] [## Error] MeanServer: mydb is not yet ready !!! ");
        setTimeout(all_ready, 2000);
        return;
    }

    logger.debug("[server: 1.3] MongoDB.connected: DB= [%s]", MONGODB_NAME);
    my_server_port = MEAN_SEVER_PORT;
    // Initialize the app.
    logger.debug("[server: 1.4] MeanServer.listen : connecting on Port[%s] ---->", my_server_port);
    var server = app.listen(my_server_port, function () {
        // var port = server.address().port;
        logger.debug("[server: 1.6] MeanServer: App is running on Port[%s]", my_server_port);
    });
    logger.debug("[server: 1.5] MeanServer is ready: starting workers");
    init_express_stack();
}


// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    logger.debug("[server: 9.1] handleError : Begin ---->");
    logger.debug("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
    logger.debug("[server: 9.2] handleError : End <----");
}

/*********************************************************************
 * Main Route Entry Point : init_express_stack()
 * this is one huge function that initializes express stack and routes
 *    GET: finds all contacts
 *    POST: creates a new contact
 *******************************************************************/
function init_express_stack() {
logger.debug("[server: 3.0] init_express_stack: app.roure: Begin ---->");

// [3.1] CONTACTS API ROUTES BELOW
logger.debug("[server: 3.1] init_express_stack: [contacts] Object");
var api_contacts = require('./api_contacts.js');
app.route('/contacts')
.get(api_contacts.get_contacts)
.post(api_contacts.post_contacts);
app.get('/contacts/:id', api_contacts.get_contacts_id);
app.put('/contacts/:id', api_contacts.put_contacts);
app.delete('/contacts/:id', api_contacts.delete_contacts);

logger.debug("[server: 3.9] init_express_stack: End: <----");
}