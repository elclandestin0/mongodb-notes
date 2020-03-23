# mongodb-notes
Notes on using the mongodb shell. These notes assume that you have already set-up the mongoDB shell in either Windows, Linux or Mac OS. 

## Starting a database
 `> show dbs` shows all the databases. There are usually sample databases that come out of the box.
 `> use <database-name>` either uses an existing database or creates a new one.

## Basic CRUD operations
 - `db.<collection-name>.insertOne({document-to-insert})` this command inserts a document into a collection, whether it exists or not. If the collection exists, then it simply inserts it into the existing collection. If it doesn't, then it creates the collection and inserts the document.
 - `db.<collection-name>.find()` This command returns all the documents in a collection. It is a cursor object and you can append multiple different functions to it. 
  -`pretty()` Formats the entire collection in a readable way.
  -`toArray()` Formats the entire collection as an array.

# Schema Validation
Check `validation.js` for in-depth information regarding basic schema validation.