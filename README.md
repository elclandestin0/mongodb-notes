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
- `db.<collection-name>.find({filter}, {options})` This command traverses all the documents in a collection and returns what the evaluates to. It is a cursor object and you can append multiple different functions to it. `find()` takes in two parameters, `filter` and `options`. `filter` should be in document form, with a key and a value: `{name: "Memo"}`. We can specify which fields we want in the returned documents in the `options` parameter. An example would be: `{ age: 1, hobbies: 1, birthday: 1}`. The name of the field with a value of `1` means that it will be included. A value of `0` means that won't be included. 
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

#### Query Operator
- `$elemMatch`
- `$all`: matches elements in an array, regardless of the order.

#### Querying embdedded documents & arrays
##### Embedded documents
Let's say we are looking documents called `average` and it lives inside the the key called `rating`. Simply enough, to go inside layers of embedded documents, we can do the following: `db.tvShows.find({"rating.average": {$gte: 9.0}})`. It is important to use the quotation marks as it allows us to access the embedded documents directly by separating layers using `.`

##### Arrays
There are two ways to find element(s) in an array: 
- `db.tvShows.find({genres: "Drama"})`: This will show us document(s) with the genres array that contain both Drama and other elements. So if a TV Show's genre is both Drama and Action, then it will return as a document. 
- `db.tvShows.find({genres: ["Drama"]})`: This will show us document(s) that only contains the element `Drama` in the `genres`.

#### Cursors
A cursor is a database object that traverses through the respective data in batches and sends them back on demand. The idea is to not give the user 1000s of documents/cells when the user inputs the `find()` command.

##### Cursor Functions
No order is specified! MongoDB performs all the chained cursor functions in the right order.
- `sort()`: takes in a key(s) for the field to sort, and a value of which way to sort. `1` is ascending while `-1` is for descending. 
- `skip()`: takes in a number variable which then tells the collection to skip that number of documents first before displaying documents.
- `limit()`: number of documents to show.

### Update 
- `db.<collection-name>.updateOne({filter}, {data}, {options})` This command updates one document, depending on the `filter` parameter. In the `data` parameter, it is important to add the `$set{key: "value"}` operator first, then to specify the document to update. If we don't add the `$set` operator, then it will update the entire document with the `{key: "value"}`. If no document is found and we want to insert the document, we can set `upsert: true` in the options parameter.
- `db.<collection-name>.updateMany({filter}, {data}, {options})` Same as the above command, except it updates multiple documents with the same `filter`.

#### Operators
- `$inc`: increments a number value by a specified number
- `$dec`: decrements a number value by a specified number
- `$min`: checks if the value specified is lower than the value found. If yes, change it to value specified. Else, do nothing
- `$max`: same as above, but checks if the value specified is higher than the value found
- `$mul`: multiplies the value specified with the value found
- `$unSet`: removes a key when the filter finds a document
- `$[]`: is an operator that means: for every entry in an array. It is usually appended to an array.
- `$push`: pushes an element into the specified array
- `$pull`: removes an element from the specified array based on a condition with different filter operators
- `$pop`: removes the first or last item of a specified array


### Delete
- `db.<collection-name>.deleteOne({filter}, {options})` This command deletes on document if it equates to the `filter` parameter.
- `db.<collection-name>.deleteMany({filter}, {options})` Same as above, except it deletes multiple documents with the same filter. If we leave the 
`filter` parameter empty `({})`, then it deletes all documents in a respective collection.

## GeoSpatial Data
In mongoDB, GeoSpatial best works with GeoJSON objects. To construct a GeoJSON object, the structure doesn't matter. However, there is one key document that must be included: `{type: <GeoJSON object type>, coordinates: [longitude, latitude]}`. The previous document is a very basic example with regards to the type: `Point`. As the type changes, so do the `coordinates` array structure.
List of GeoJSON object types:
- Point
- LineString
- Polygon
- MultiPoint
- MultiLineString
- MutliPolygon
- GeometryCollection

Example GeoJSON Object: `{name: "My home", location: { type: "Point", coordinates: [-73.345234, 43.3456]}}`
### GeoQueries
One operator that comes to mind with regards to GeoQueries is the `$near ` & the `$geometry` operator. `$maxDistance` & `$minDistance` also help with the query (in meters). Here is an example query: `db.places.find({location: {$near: {$geometry: {type: "Point", coordinates: [-73, 43]}, $maxDistance: 30, $minDistance: 10}}})`. It is important to note that we must create an index in the collection `places` before querying correctly: `db.places.createIndex({location: "2dsphere"})`

#### Finding places in a certain area
- `$geoWithin`: is an operator provided by mongoDB that allows us to query within a polygon.

When we query within a certain area, we must use the `$geoWithin` operator. The type of GeoJSON we are looking for is a polygon, which must contain at least 3 arrays of coordinates (within an array). The example below defines this better.
`db.places.find({location: {$geoWithin: {$geometry: {type: "Polygon", coordinates: [[p1, p2, p3, p4, p1]]}}}})`

#### Finding users in a certain area
- `$geoIntersects`: returns all points that intersect within a given area
- `$centerSphere`: creates a sphere from coordinates with a specified radius to find points in the sphere.
`db.areas.find({$geoIntersects: {$geometry: {type: "Point", coordinates: [lng, lat]}}})`

## SSL Transport Encryption
- Run the following command: `openssl req -newkey rsa:2048 -new -x509 -days 365 -nodes -out mongodb-cert.crt -keyout mongodb-cert.key`
- Add requested data
- When the shell asks you for `Common Name (e.g. server FQDN or YOUR name) []:` make sure to either add `localhost` if working locally OR the address of the webserver you are working on.
- Concatenate the generated key file with the certificate file by running the command `cat mongodb-cert.key mongodb-cert.crt > mongodb.pem` (on Mac or Linux) or `type mongodb-cert.key mongodb-cert.crt > mongodb.pem`
- Start a mongo server with SSL arguments: `mongod --tlsMode requireTLS --tlsCertKeyFile C:\Program Files\OpenSSL-Win64\bin\mongod.pem` 
- Start a new shell instance and connect to the mongo server: `mongo --ssl --sslCAFile mongodb.pem --host localhost`

## Indexes
Index Scan (IXSCAN) typically beats the Collection Scan (COLLSCAN). # of keys in index examined should be as close as possible to # of documents examined. Simultaneously, # of documents examined should be as close as possible to # of documents returned.
### Creating Indexes
Indexes are use to traverse a large data set more efficiently. As the documents in your collection(s) grow, it is wise to use an index to traverse the data-set quicker. However, there is a performance cost of inserting your documents when using an index (once in the collection and one or more times for multiple indices). To add an index, follow this command: `db.<collection-name>.createIndex({<attribute-name>: <one-or-negative-one>})`. An example would be: `db.contacts.createIndex({"dateOfBirth.age": 1})`. This translates to: create an index on the contacts collection for the attribute `age` on the embedded document `dateOfBirth` for an ascending order of indices.

After you add the index, it is wise to test the query time before or after. To do this: run the following command `db.contacts.explain("executionStats").find({"dateOfBirth.age": {$gt: 60}})`. Which translates to: give me the stats on finding the `age` greater than 60 of every document in this `contacts` collecton. 

### Getting Indexes
`db.<collection-name>.getIndexes()` returns all the indexes in a collection

### Partial Indexes
An example of partial indexing is to create an index that only allows unique e-mails, but allows null values for e-mails (some users don't want to sign up with their e-mails.. but for the ones that do they need to have unique e-mails).
`db.contacts.createIndex({email: 1}, {unqiue: true, partialFilterExpression: {email: {$exists: true}})`.

#### Time To Live
`db.sessions.createIndex({createdAt: 1}, {expireAfterSeconds: 10})`
This will create an Index that only works on an attribute of type `Date`. It's good for clearing session data, cart, showing a photo for 24 hours .. etc.

### Text Index
- `db.products.createIndex({description: "text"})`: this command stores all the keywords found in the `description` attribute. You can only have ONE text index per collection. You can, however, chain multiple fields together in a text index: `db.products.createIndex({title: "text", description: "text"})`

- To find the text index, simply run the command: `db.products.find({$text: {$search: "fantastic"}})`. You can also exclude words by adding a `-` infront of the word you want to exclude: `db.products.find({$text: {$search: "fantastic -book"}})`.

- You can specify the language when creating a text index by adding this document `{default_language: "english"}` in the second argument of `createIndex()`.

- Adding weights when creating a text index can be very powerful, especially when you are adding multiple attributes to one text index. This tells MongoDB which attribute has more priority: `db.products.createIndex({title: "text", description: "text"}, {weights:{title: 5, description: 10}})`.
 

- You can find the score of confidence by mongoDB when querying for a text by running the following command: `db.products.find({$text: {$search: "fantastic"}}, {score: {$meta: "textScore"}}).pretty()`.

- As your collections get bigger with many documents, it's wise to create indexes in the background. This will stop your collection from locking down due to the slow process and still allow your application (or shell) to continue running. To do this, add this command: `{background: true}` in the command: `db.ratings.createIndex({age: 1}, {background: true})`.


### Compounding Index
You can add 2 different keys when creating an index. This will create a compounded index. For example: `db.contacts.createIndex({"dob.age": 1, gender: 1})`, this will create and store values in the index with age and gender in ascending order. 30 male, 30 male, 30 female, 31 male, and so on. Now when you run a query of either `dob.age` (without `gender`) it will use the same compound index for `dob.age`& `gender`. However, running a query on `gender` alone won't work as it can't look into the second value of a compounded indice alone.

# Schema Validation
Check `validation.js` for in-depth information regarding basic schema validation.
