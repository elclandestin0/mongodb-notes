db.createCollection("posts", {
    validator: {
             $jsonSchema: {
                 bsonType: "object",
                 required: ["title", "text", "creator", "comments"],
                 properties: {
                     title: {
                         bsonType: "string",
                         description: "Must be a string and is required."
                     },
                     text: {
                         bsonType: "string",
                         description: "Text must be a string."
                     },
                     creator: {
                         bsonType: "objectId",
                         description: "Must be an object id and is required."
                     },
                     comments: {
                         bsonType: "array",
                         description: "Must be an array and is required",
                         items: {
                             bsonType: "object",
                             required: ["text", "author"],
                             properties: {
                                 text: {
                                     bsonType: "string",
                                     description: "Must be a string and is required"
                                 },
                                 author: {
                                     bsonType: "objectId",
                                     description: "Must be an object id and is required."
                                 }
                             }
                         }
                     }
                 }
             }
         }
     })