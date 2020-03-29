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



# Schema Validation
Check `validation.js` for in-depth information regarding basic schema validation.
