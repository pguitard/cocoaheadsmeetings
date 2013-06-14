Demo application built for a presentation at Cocoaheads Ottawa/Gatineau
=======================================================================

To run the application, you need to install:

* [node.js](http://nodejs.org)
* [mongoDB](http://mongodb.org)


Then run the following command from the project root directory:

```Shell
npm install
```

Make sure the mongoDB server is started:

```Shell
mongod &
```

Start the node.js application:

```Shell
node app.js
```

Simple curl commands are provided in the `curl_commands` file showing how to use the API.