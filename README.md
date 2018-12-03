# Flat File API

## Abstract

> **NOTE** - THIS IS PRE-ALPHA SOFTWARE!

Flat File API is a command line tool to mock APIs using flat files.

You describe your API using a combination of folders containing JSON and JavaScript files, with some special naming which represents URL parameters. An Express server maps requests to files, and returns responses, like a real API.

As an example, the following file and folder structure...

```
+- api
    +- comments.json
    +- images.json
    +- posts
        +- category
        |   +- _name.js
        +- date
        |   +- year
        |       +- _month
        |       |   +- index.js
        |       +- index.js
        +- _id.js
        +- index.json

```

...generates the following routes:

```
/comments
/images
/posts
/posts/:id
/posts/category/:name
/posts/date/:year
/posts/date/:year/:month
```


## WIP

This package is a work in progress, with various [planned features](issues).

It will eventually run as a global script, allowing you to set up an API in any project, and run it on demand.

A browser plugin will intercept requests and will be able to respond with the local API version of files.


## Features

### Static and dynamic files

Static JSON files will their contents, but JavaScript files can be executed!

This allows you to do anything, but examples might be:

- loading and filtering *related* JSON file using the URL parameters
- generating output on the fly, perhaps using `Array.map()` or the like

The difference between this an a full API is:

- you can run this locally
- anyone can edit the files
- the API is in source control


### Custom file handlers

You can set up custom file handlers, based on the extension of the file, which you can use to transform the content of the file before returning.

For example, [simulated CRUD](issues/7) interaction is planned with a `.crud.json` extension.
 
This will allow you to simply copy and paste a JSON array to a single file, then have the framework simulate the correct response by manipulating the file and returning a portion of it or such like.

### Support for methods

Not finalised yet, but there should be support for alternative HTTP methods such as post, probably by naming the file differently:

```
comments.delete.json
comments.post.json
comments.put.json
```

### Index file

Each API shows an index of all its routes from the root URL.

AT some point this will show available methods as well.

## Demo

To play with the demo as it stands, clone and install:

```
git clone https://github.com/davestewart/flat-file-api.git
cd flat-file-api
npm install
```

Run with the following command:

```
npm run start
```

Then, visit:

- http://localhost:3000

Currently the demo loads an example, in-flux API from the package itself.

The index file should load, with clickable links. You will need to edit the URL parameters yourself!

Have fun...
