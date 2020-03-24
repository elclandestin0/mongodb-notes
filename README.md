# mongodb-notes
Notes on using the mongodb shell. These notes assume that you have already set-up the mongoDB shell in either Windows, Linux or Mac OS. 

## Starting a database
* `show dbs` shows all the databases. There are usually sample databases that come out of the box.
* `use <database-name>` either uses an existing database or creates a new one.

## Basic CRUD operations
### Create
- `db.<collection-name>.insertOne({document-to-insert})` this command inserts a document into a collection, whether it exists or not. If the collection exists, then it simply inserts it into the existing collection. If it doesn't, then it creates the collection and inserts the document.
- `db.<collection-name>.insertMany([{document-one}, {document-two}, {and-so-on}])` this command inserts multiple documents into a collection. The multiple documents must be enclosed in an array, as shown in the above command.
 ### Read
- `db.<collection-name>.find({filter}, {options})` This command returns all the documents in a collection. It is a cursor object and you can append multiple different functions to it. `find()` takes in two parameters, `filter` and `options`. `filter` should be in document form, with a key and a value: `{name: "Memo"}`. 
   * `pretty()` Formats the entire collection in a readable way.
   * `toArray()` Formats the entire collection as an array.
- `db.<collection-name>.findOne({filter}, {options})` This command returns the first document in the collection if there is no filter specified, otherwise it finds the first document that equates to the `filter` parameter.
### Update 
- `db.<collection-name>.updateOne({filter}, {data}, {options})` This command updates one document, depending on the `filter` parameter. In the `data` parameter, it is important to add the `$set{key: "value"}` operator first, then to specify the document to update. If we don't add the `$set` operator, then it will update the entire document with the `{key: "value"}`.
- `db.<collection-name>.updateMany({filter}, {data}, {options})` Same as the above command, except it updates multiple documents with the same `filter`.

### Delete
- `db.<collection-name>.deleteOne({filter}, {options})` This command deletes on document if it equates to the `filter` parameter.
- `db.<collection-name>.deleteMany({filter}, {options})` Same as above, except it deletes multiple documents with the same filter. If we leave the `filter` parameter empty `({})`, then it deletes all documents in a respective collection

# Schema Validation
Check `validation.js` for in-depth information regarding basic schema validation.
