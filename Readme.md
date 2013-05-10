# Omega

A web application framework that is designed to support realtime web applications simply and effectively.

## Basic App

A basic Omega application looks like this:

```javascript
var path = require('path');
var app = require('omega-node').app;

app.static.add({url: '/static', path: path.join(__dirname, 'static')});

// Start the omega app.
app.listen();

```

This tells omega to serve the `./static` folder statically at the url `/static`, and then starts listening for incomming
connections. Admitedly, this isn't the most exciting application in the world, but it illustrates the basics of omega;
first and foremost: _omega is simple_. It tries to make whatever you're doing as straightforward as possible, and hide
any complexity from you.

Second, this demonstrates a core concept of working with omega: _the app is king_. Omega's application object provides
an api into omega's functionality. Really, this should be intuitive for most people, but it's worth repeating.

## Static File Serving

The basic example also included a basic example of static file serving. Omega supports as many static files as you would
like, and handled directories, as well as individual files. To exand on the first example, we can also pass a list of
directories to serve:

```javascript
var path = require('path');
var app = require('omega-node').app;

app.static.add(
    {
        url: '/static',
        path: path.join(__dirname, 'static')
    },
    {
        url: '/images',
        path: '/usr/share/images'
    },
    {
        url: '/uploads',
        path: '/tmp/uploads',
        options: {
            showDir: true
        }
);

```

Under the hood omega just uses [ecstatic](https://github.com/jesusabdullah/node-ecstatic). The `options` object is
passed directly to `ecstatic`.

## URL Routing

Even though the focus of omega is on realtime web applications, there are reasons you may wish to do things a more
traditional way, with server-side processing. Or, perhaps, you need to write a simple `REST` service. That's easily done
with omega:

```javascript

var app = require('omega-node').app;
var controllers = require('./controllers');

app.router.add({url: '/', get: controllers.index});

```

It also supports adding multiple paths, with multiple verbs at once:

```javascript

var app = require('omega-node').app;
var controllers = require('./controllers');

app.router.add(
    {
        url: '/',
        get: controllers.index
    },
    {
        path: '/blog',
        get: controllers.blog_index,
        post: controllers.blog_new
    }
);

```

The `url` parameter can be a regular expression, supporting capture groups:

```javascript
app.router.add({url: '/blog/{slug}', get: controllers.blog});
```

In the `controllers.blog` function, you can get the url parameter like this:

```javascript
function(request, response) {
    var slug = request.params.slug;

    // Your code here
    response.end();
}
```

This is all simply a wrapper around [gett/router](https://github.com/gett/router), with a bit of syntactic sugar. All
HTTP verbs supported there are supported by omega.

## Socket.io

One of the big things omega provides is `socket.io` functionality. We expose this in a very straightforward way:

```javascript
var app = require('omega-node').app;

app.sockets.on('connection', function(socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});
```

Since `socket.io` has a great, easy to understand api, we don't even bother to wrap it; we just take care of starting
the server for you. (We don't expose the `io` object directly, as there's hardly any need. Should you need to use it,
you can access it via `app._io`.)

### Namespaces

We also expose socket.io's namespaces as `channels`:

```javascript
var app = require('omega-node').app;

app.channels('/news').on('connection', function (socket) {
    socket.emit('item', { news: 'item' });
});
```

This makes is nice and straightforward to write `socket.io` code however you wish.

## Unit Tests

Tests can be run with:

```bash
$ npm tests
```

## Work in Progress

This is a massive work in progress. Currently, nothing's tested, and while there may be code there, I've not even run it
yet. I'll remove this notice one I have unit tests, and replace it by something a bit more informative.

**Update:** Well, it seems to run, to some extent. I've not really tested anything besides basic static file serving.
However, if you want to run the example application, you will need to do the following in the omega-node directory:

```bash
$ npm link .
$ cd example
$ npm link omega-node
```

Now, the example application can be started:

```bash
$ npm start

> example@0.0.0 start /Users/morgul/Development/omega-node/example
> node server.js

   info  - socket.io started

```

You can then view the example index at: [http://localhost:8080/static/index.html](http://localhost:8080/static/index.html)
