var CONTACTS_COLLECTION="contacts";
var ObjectID = require('mongodb').ObjectID;

function get_contacts(req,res)
{
  console.log("[DBG-11.1] api_routes.get_contacts : Begin -->");
  // res.writeHead(200, {"Content-Type": "application/json"});

  var col = my_db.collection(CONTACTS_COLLECTION);
  col.find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get contacts.");
    } else {
      console.log("[Test-JK-11.2] : get_contacts: docs"+ JSON.stringify(docs));
      res.status(200).json(docs);  
    }
    console.log("[DBG-11.9] api_routes.get_contacts : End <--");
  });
}

function get_contacts_id(req,res)
{
  console.log("[DBG-12.1] api_routes.get_contacts_id : Begin -->");
  // res.writeHead(200, {"Content-Type": "application/json"});

  my_db.collection(CONTACTS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get contact");
    } else {
      res.status(200).json(doc);
    }
  });
}

function put_contacts(req,res)
{
  console.log("[DBG-13.1] api_routes.put_contacts : Begin -->");
  // res.writeHead(200, {"Content-Type": "application/json"});

  var updateDoc = req.body;
  delete updateDoc._id;

  my_db.collection(CONTACTS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update contact");
    } else {
      res.status(204).end();
    }
  });
  console.log("[DBG-13.9] api_routes.put_contacts : End <--");
}

function post_contacts(req,res)
{
  console.log("[DBG-14.1] api_routes.post_contacts : Begin -->");
  // res.writeHead(200, {"Content-Type": "application/json"});

  var newContact = req.body;
  newContact.createDate = new Date();

  if (!(req.body.firstName || req.body.lastName)) {
    handleError(res, "Invalid user input", "Must provide a first or last name.", 400);
  }

  my_db.collection(CONTACTS_COLLECTION).insertOne(newContact, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new contact.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });

  console.log("[DBG-14.9] api_routes.post_contacts : End <--");
}

function delete_contacts(req,res)
{
  console.log("[DBG-15.1] api_routes.delete_contacts : Begin -->");
  // res.writeHead(200, {"Content-Type": "application/json"});

  my_db.collection(CONTACTS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete contact");
    } else {
      res.status(204).end();
    }
  });
  console.log("[DBG-15.9] api_routes.delete_contacts : End <--");
}

exports.get_contacts    = get_contacts;
exports.get_contacts_id = get_contacts_id;
exports.post_contacts   = post_contacts;
exports.put_contacts    = put_contacts;
exports.delete_contacts = delete_contacts;
