# mongodb-notes
Notes on using the mongodb shell. These notes assume that you have already set-up the mongoDB shell in either Windows, Linux or Mac OS. 

## Starting a database
* `show dbs` shows all the databases. There are usually sample databases that come out of the box.
* `use <database-name>` either uses an existing database or creates a new one.

## Basic CRUD operations
### Create
- `db.<collection-name>.insertOne({document-to-insert}, {filter})` this command inserts a document into a collection, whether it exists or not. If the collection exists, then it simply inserts it into the existing collection. If it doesn't, then it creates the collection and inserts the document.
- `db.<collection-name>.insertMany([{document-one}, {document-two}, {and-so-on}], {filter})` this command inserts multiple documents into a collection. The multiple documents must be enclosed in an array, as shown in the above command. NOTE: MongoDB does something called the ordered insert by default. It inserts documents from the first element until the last. If it processes an error in one of the documents, it cancels inserting the rest of the documents. However, it does not roll back the successful insertions of the other documents. To cancel this ordered insert, simply add the `{ ordered: false }` in the options parameter.
- `insert()` is not recommended to use anymore. 
- `mongoimport -d <database-name> -c <collection-name> --drop --jsonArray`
 ### Read
- `db.<collection-name>.find({filter}, {options})` This command traverses all the documents in a collection and returns what the evaluates to. It is a cursor object and you can append multiple different functions to it. `find()` takes in two parameters, `filter` and `options`. `filter` should be in document form, with a key and a value: `{name: "Memo"}`. 
   * `pretty()` Formats the entire collection in a readable way.
   * `toArray()` Formats the entire collection as an array.
- `db.<collection-name>.findOne({filter}, {options})` This command returns the first document in the collection if there is no filter specified, otherwise it finds the first document that equates to the `filter` parameter.
#### Query Operators
When finding a document in a collection, we can specify a `filter` parameter to also include additional query operators. An example is the following:
`db.<collection-name>.findOne({age:{$gt:20}})`, which translates to: "Give me a document in this sample collection where the age must be greater than 20". Here are some examples of operators: 
- `$gt` greater than
- `$gte` greater than or equal to
- `$lt` less than
- `$lte` less than or equal to
- `$ne` not equal to
- `$in` contains elements in an array
- `$nin` does not contain elements in an array

#### Logical Operators
Syntax is: `db.tvShows.find({ $or: [{"rating.average": {$lt : 5.0}}, {"rating.average": {$gt : 9.0}}]})` This means give me tv shows that are less than 5.0 or greater than 9.0

- `$or`: OR 
- `$nor`: NOT OR operator
- `$and`: AND operator
- `$not`: NOT operator

#### Element Operators
- `$exists`: Check if element with key : value exists.
- `$type`: Check if key equates to a type. 

#### Querying embdedded documents & arrays
##### Embedded documents
Let's say we are looking documents called `average` and it lives inside the the key called `rating`. Simply enough, to go inside layers of embedded documents, we can do the following: `db.tvShows.find({"rating.average": {$gte: 9.0}})`. It is important to use the quotation marks as it allows us to access the embedded documents directly by separating layers using `.`

##### Arrays
There are two ways to find element(s) in an array: 
- `db.tvShows.find({genres: "Drama"})`: This will show us document(s) with the genres array that contain both Drama and other elements. So if a TV Show's genre is both Drama and Action, then it will return as a document. 
- `db.tvShows.find({genres: ["Drama"]})`: This will show us document(s) that only contains the element `Drama` in the `genres`.

### Update 
- `db.<collection-name>.updateOne({filter}, {data}, {options})` This command updates one document, depending on the `filter` parameter. In the `data` parameter, it is important to add the `$set{key: "value"}` operator first, then to specify the document to update. If we don't add the `$set` operator, then it will update the entire document with the `{key: "value"}`.
- `db.<collection-name>.updateMany({filter}, {data}, {options})` Same as the above command, except it updates multiple documents with the same `filter`.

### Delete
- `db.<collection-name>.deleteOne({filter}, {options})` This command deletes on document if it equates to the `filter` parameter.
- `db.<collection-name>.deleteMany({filter}, {options})` Same as above, except it deletes multiple documents with the same filter. If we leave the `filter` parameter empty `({})`, then it deletes all documents in a respective collection.

# Schema Validation
Check `validation.js` for in-depth information regarding basic schema validation.
