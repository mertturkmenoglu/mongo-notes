# MongoDB Notes - 01
# Introduction
***
- A NoSQL, document based database.
- Every record is a document: A data structure composed of *field* and *value*.
- Similar to JSON (more correctly, BSON: Binary JSON)
- A document may contain nested documents, arrays and other sub-types.
- Documents are stored in **collections**. (Analogous to tables in Relational DBs).
- A *replica set* is a group of MongoDB servers that maintain the same data set, providing redundancy and increasing data availability.
- Mongo supports horizontal scalability.
- Supports multiple storage engines (Default WiredTiger).
- **Storage Engine**: Part of the db that is responsible for managing how data is stored (in memory & on disk).
***
* Databases hold one or more collections.  
* `use myDatabase`  
will switch to *myDatabase* database.
* Databases are created lazily: You have to store data (create a collection and save a document inside that) for that database first.
* `use myDatabase`  
  `db.myCollection.insertOne({name: 'John'})`  
will create *myDatabase* and inside that database will create *myCollection* and will insert one document to that collection.
