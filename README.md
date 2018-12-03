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

...generates the following routes...

```
/comments
/images
/posts
/posts/:id
/posts/category/:name
/posts/date/:year
/posts/date/:year/:month
```

...which return data from within the files.

This makes setting up an API for frontend development extremely fast and easy!

## WIP

This package is a work in progress, with various [planned features](https://github.com/davestewart/flat-file-api/issues).

It will eventually run as a global script, allowing you to set up a flat-file API in any project, and run it on demand.

A browser plugin will intercept requests and will be able to respond with the local API version of files.


## Features / planned features

### Static and dynamic files

Static JSON files will simply return their contents, but JavaScript files can be *executed*.

This allows you to do anything, but examples might be:

- loading and filtering JSON using the passed URL parameters
- generating output on the fly, perhaps using `Array.map()` or the like

Check the source code for examples:

- [api/posts/index.json](https://github.com/davestewart/flat-file-api/blob/master/api/posts/index.json)
- [api/posts/_id.js](https://github.com/davestewart/flat-file-api/blob/master/api/posts/_id.js)
- [api/posts/date/_year/index.js](https://github.com/davestewart/flat-file-api/blob/master/api/posts/date/_year/index.js)


The difference between this and something like Postman is:

- JavaScript allows for complete customisation
- anyone with the repo can run this
- changes can be committed to the repo
- no additional software needed

Note that there are various rules around file prioritisation, which will get documented.

### Custom file handlers

You can set up custom file handlers, based on the extension of the file, which you can use to transform the content of the file before returning:

```js
{
  'posts.res.yaml': function (req, res) {
    // load yaml resource, then return
  }
}
```

For example, [simulated CRUD](https://github.com/davestewart/flat-file-api/issues/7) interaction is planned with a `.crud.json` extension.
 
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

At some point this will show available HTTP methods as well. Additionally, a way to hint parameters per endpoint is planned, so APIs can be run interactively.

## Demo

To play with the demo as it stands, clone and install:

```
git clone https://github.com/davestewart/flat-file-api.git
cd flat-file-api
npm install
```

Run with the following command:

```
npm run demo
```

To run your own API, run:

```
npm run start -- --root <relative or absolute path to your api>
```

Then, visit:

- http://localhost:3000

The index file should load with the demo API. The links are clickable, but you will need to edit the URL parameters yourself!

As such, here are some examples:

- http://localhost:3000/posts
- http://localhost:3000/posts/date/2017
- http://localhost:3000/posts/date/2017/01
- http://localhost:3000/products/300

Have fun...
